import { describe, expect, it } from 'vitest';
import { buildPlan, fill, missingFields, outcomeOf } from './plan';
import { toChecklist } from './checklist';
import { parseLocal, relativeLabel } from './time';
import { demoFixture } from '../content/demo';
import { footballLibrary } from '../content/football';
import { brandLibrary } from '../content/brand';
import { principleById } from '../content/playbook';
import { footballStorylines, brandStorylines } from '../content/labels';
import type { BrandInput, FootballInput, Plan, PlanItem } from './types';

const base: FootballInput = {
  mode: 'football', club: 'Hill Town', venue: 'home', opponent: 'River City',
  competition: 'League Two', kickoff: '2026-11-14T15:00', storyline: 'ordinary',
};
const brand: BrandInput = {
  mode: 'brand', brand: 'Northlight', launch: 'Trail 2', kind: 'launch',
  start: '2026-12-01T09:00', storyline: 'new-product',
};

const all = (p: Plan | null): PlanItem[] => p!.phases.flatMap((ph) => ph.items);
const byId = (p: Plan | null, id: string) => all(p).find((i) => i.id === id);
const ids = (p: Plan | null) => all(p).map((i) => i.id);

describe('time', () => {
  it('parses only real dates and times', () => {
    expect(parseLocal('2026-11-14T15:00')?.toISOString()).toBe('2026-11-14T15:00:00.000Z');
    expect(parseLocal('2026-02-30T15:00')).toBeNull();
    expect(parseLocal('14/11/2026')).toBeNull();
  });
  it('labels times relative to kick-off', () => {
    expect(relativeLabel(-4320, 'Kick-off')).toBe('72 h before');
    expect(relativeLabel(-60, 'Kick-off')).toBe('60 min before');
    expect(relativeLabel(0, 'Kick-off')).toBe('Kick-off');
    expect(relativeLabel(130, 'Kick-off')).toBe('2 h 10 min after kick-off');
  });
});

describe('timings', () => {
  const plan = buildPlan(base);
  it('starts the build-up 72 hours out', () => {
    const first = plan!.phases[0].items[0];
    expect(first.at).toBe(-72 * 60);
    expect(first.dateLabel).toBe('Wed 11 Nov, 15:00');
  });
  it('posts team news one hour before kick-off', () => {
    const news = byId(plan, 'team-news')!;
    expect(news.phase).toBe('match-day');
    expect(news.at).toBe(-60);
    expect(news.dateLabel).toBe('Sat 14 Nov, 14:00');
  });
  it('keeps every phase in time order', () => {
    for (const phase of plan!.phases) {
      const times = phase.items.map((i) => i.at);
      expect(times).toEqual([...times].sort((a, b) => a - b));
    }
  });
  it('crosses midnight and month ends correctly', () => {
    const late = buildPlan({ ...base, kickoff: '2026-03-01T00:30' });
    expect(byId(late, 'team-news')!.dateLabel).toBe('Sat 28 Feb, 23:30');
  });
  it('puts every item in the right phase window', () => {
    for (const t of [...footballLibrary, ...brandLibrary]) {
      if (t.phase === 'build-up') expect(t.at).toBeLessThan(-3 * 60);
      if (t.phase === 'match-day') expect(t.at).toBeGreaterThanOrEqual(-3 * 60);
      if (t.phase === 'after') expect(t.at).toBeGreaterThan(112);
    }
  });
});

describe('storylines', () => {
  it('every storyline gives a full three-phase plan', () => {
    for (const s of footballStorylines) {
      const plan = buildPlan({ ...base, storyline: s.id });
      for (const phase of plan!.phases) expect(phase.items.length).toBeGreaterThan(2);
    }
    for (const s of brandStorylines) {
      const plan = buildPlan({ ...brand, storyline: s.id });
      for (const phase of plan!.phases) expect(phase.items.length).toBeGreaterThan(2);
    }
  });
  it('adds the storyline’s own items and only those', () => {
    const derby = ids(buildPlan({ ...base, storyline: 'derby' }));
    expect(derby).toContain('story-derby');
    expect(derby).toContain('deepen-derby');
    expect(derby).not.toContain('story-cup');
    expect(derby).not.toContain('story-ordinary');
  });
  it('uses a generic version when a storyline name is missing', () => {
    expect(ids(buildPlan({ ...base, storyline: 'signing' }))).toContain('story-signing-generic');
    const named = buildPlan({ ...base, storyline: 'signing', signing: 'Sam Okafor' });
    expect(ids(named)).toContain('story-signing');
    expect(ids(named)).not.toContain('story-signing-generic');
  });
  it('uses the right home and away items', () => {
    expect(ids(buildPlan(base))).toContain('fixture-poster-home');
    const away = buildPlan({ ...base, venue: 'away' });
    expect(ids(away)).toContain('away-guide');
    expect(ids(away)).not.toContain('getting-there');
    expect(away!.title).toBe('River City v Hill Town');
  });
});

describe('results', () => {
  it('works out the outcome from your own goals', () => {
    expect(outcomeOf(2, 0)).toBe('win');
    expect(outcomeOf(1, 1)).toBe('draw');
    expect(outcomeOf(0, 3)).toBe('loss');
  });
  it('without a result, prepares win, draw and loss versions', () => {
    const plan = buildPlan(base)!;
    expect(plan.outcome).toBeUndefined();
    const fullTime = all(plan).filter((i) => i.id.startsWith('full-time'));
    expect(fullTime.map((i) => i.outcomes)).toEqual([['win'], ['draw'], ['loss']]);
    expect(fullTime[0].caption).toContain('Hill Town [score] River City');
  });
  for (const [scored, conceded, outcome] of [[3, 1, 'win'], [1, 1, 'draw'], [0, 2, 'loss']] as const) {
    it(`a ${outcome} gets only its own guidance`, () => {
      const plan = buildPlan({ ...base, result: { scored, conceded } })!;
      expect(plan.outcome).toBe(outcome);
      for (const item of all(plan)) if (item.outcomes) expect(item.outcomes).toContain(outcome);
      expect(ids(plan)).toContain(`full-time-${outcome}`);
      expect(ids(plan)).toContain(`reaction-${outcome}`);
    });
  }
  it('leaves the player vote out after a defeat', () => {
    expect(ids(buildPlan({ ...base, result: { scored: 0, conceded: 1 } }))).not.toContain('potm');
    expect(ids(buildPlan({ ...base, result: { scored: 1, conceded: 0 } }))).toContain('potm');
  });
  it('writes the score the right way round when away', () => {
    const plan = buildPlan({ ...base, venue: 'away', result: { scored: 2, conceded: 1 } })!;
    expect(plan.title).toBe('River City 1–2 Hill Town');
    expect(plan.outcome).toBe('win');
  });
  it('brand mode uses the chosen outcome', () => {
    const plan = buildPlan({ ...brand, outcome: 'loss' });
    expect(ids(plan)).toContain('b-wrap-loss');
    expect(ids(plan)).not.toContain('b-wrap-win');
  });
});

describe('names and numbers', () => {
  it('fills tokens and leaves unknown ones visible', () => {
    expect(fill('{club} v {opponent} {x}', { club: 'A', opponent: 'B' })).toBe('A v B {x}');
  });
  it('puts the entered names into captions', () => {
    const plan = buildPlan({ ...base, captain: 'Jordan Reid', storyline: 'milestone', milestonePlayer: 'Alex Moore', milestone: '200th appearance' });
    expect(byId(plan, 'team-news-captain')!.caption).toBe('Team news. Your Hill Town side to face River City, led by Jordan Reid.');
    expect(byId(plan, 'story-milestone')!.title).toBe('Alex Moore: 200th appearance');
    expect(ids(plan)).not.toContain('team-news');
  });
  it('never leaves an unfilled {token} in any plan', () => {
    const variants: (FootballInput | BrandInput)[] = [];
    for (const s of footballStorylines) for (const venue of ['home', 'away'] as const) {
      variants.push({ ...base, storyline: s.id, venue });
      variants.push({ ...base, storyline: s.id, venue, signing: 'S', captain: 'C', milestonePlayer: 'M', ground: 'G', result: { scored: 1, conceded: 0, scorers: 'X 9′' } });
    }
    for (const s of brandStorylines) for (const kind of ['launch', 'event'] as const) {
      variants.push({ ...brand, storyline: s.id, kind });
      variants.push({ ...brand, storyline: s.id, kind, partner: 'P', spokesperson: 'Sp', featured: 'F', place: 'Pl', outcome: 'win' });
    }
    for (const v of variants) for (const i of all(buildPlan(v))) {
      expect(`${i.title} ${i.caption}`).not.toMatch(/[{}]/);
    }
  });
  it('only uses numbers from the input or the clock', () => {
    // Digits in captions may come only from the score, scorers, dates or times entered.
    const plan = buildPlan(demoFixture)!;
    const allowed = new Set(['2', '0', '37', '15', '00', '20', '2016']);
    for (const i of all(plan)) for (const n of i.caption.match(/\d+/g) ?? []) expect(allowed).toContain(n);
  });
  it('asks for the required fields first', () => {
    expect(missingFields({ ...base, club: ' ', kickoff: '' })).toEqual(['your club', 'the kick-off date and time']);
    expect(buildPlan({ ...base, opponent: '' })).toBeNull();
  });
});

describe('content', () => {
  it('every item links to a real principle and has a why note', () => {
    for (const t of [...footballLibrary, ...brandLibrary]) {
      expect(principleById[t.principle]).toBeDefined();
      expect(t.why.length).toBeGreaterThan(40);
    }
  });
  it('item ids are unique', () => {
    for (const lib of [footballLibrary, brandLibrary]) expect(new Set(lib.map((t) => t.id)).size).toBe(lib.length);
  });
});

describe('demo fixture', () => {
  const plan = buildPlan(demoFixture)!;
  it('shows the sourced result', () => {
    expect(plan.title).toBe('Burnley 2–0 Liverpool');
    expect(plan.subtitle).toBe('Premier League · Turf Moor · Sat 20 Aug 2016, 15:00');
    expect(byId(plan, 'full-time-win')!.caption).toBe('FULL TIME. Burnley 2–0 Liverpool. Goals: Vokes 2′, Gray 37′. What a feeling.');
  });
  it('exports as a checklist', () => {
    const text = toChecklist(plan);
    expect(text.startsWith('MATCHDAY PLAN: Burnley 2–0 Liverpool')).toBe(true);
    expect(text).toContain('[ ] 60 min before (Sat 20 Aug, 14:00): Team news');
    expect(text.split('[ ]').length - 1).toBe(all(plan).length);
  });
});
