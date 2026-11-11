// The plan engine: pure functions that turn a fixture (or launch) into a plan.
// No network, no AI: the same input always gives the same plan.

import { footballLibrary, footballPhases } from '../content/football';
import { brandLibrary, brandPhases } from '../content/brand';
import { addMinutes, clock, dayName, longDate, parseLocal, relativeLabel, shortDate, stamp } from './time';
import type { BrandInput, FootballInput, Outcome, Plan, PlanInput, PlanItem, PlanPhase, Template } from './types';

export type Vars = Record<string, string>;

const clean = (s: string | undefined) => (s ?? '').trim().replace(/\s+/g, ' ');

/** Replaces {token} with its value. Unknown tokens are left as they are. */
export function fill(template: string, vars: Vars): string {
  return template.replace(/\{(\w+)\}/g, (whole, key: string) => (key in vars ? vars[key] : whole));
}

export function outcomeOf(scored: number, conceded: number): Outcome {
  if (scored > conceded) return 'win';
  if (scored < conceded) return 'loss';
  return 'draw';
}

export function isValidScore(n: unknown): n is number {
  return typeof n === 'number' && Number.isInteger(n) && n >= 0 && n <= 99;
}

interface Context {
  vars: Vars;
  storyline: string;
  variant: string;
  outcome?: Outcome;
  start: Date;
  startWord: string;
  library: Template[];
  phases: Omit<PlanPhase, 'items'>[];
  title: string;
  subtitle: string;
  mode: PlanInput['mode'];
}

function footballContext(input: FootballInput, start: Date): Context {
  const club = clean(input.club);
  const opponent = clean(input.opponent);
  const home = input.venue === 'home' ? club : opponent;
  const away = input.venue === 'home' ? opponent : club;
  const r = input.result;
  const hasResult = !!r && isValidScore(r.scored) && isValidScore(r.conceded);
  const outcome = hasResult ? outcomeOf(r!.scored, r!.conceded) : undefined;
  const homeGoals = input.venue === 'home' ? r?.scored : r?.conceded;
  const awayGoals = input.venue === 'home' ? r?.conceded : r?.scored;
  const scorers = hasResult ? clean(r!.scorers) : '';
  const fixture = `${home} v ${away}`;

  const vars: Vars = {
    club,
    opponent,
    competition: clean(input.competition) || 'the match',
    ground: clean(input.ground),
    atGround: clean(input.ground) ? ` at ${clean(input.ground)}` : '',
    fixture,
    day: dayName(start),
    date: shortDate(start),
    time: clock(start),
    signing: clean(input.signing),
    captain: clean(input.captain),
    milestonePlayer: clean(input.milestonePlayer),
    milestone: clean(input.milestone) || 'A milestone',
    // Without a result, the plan prepares a fill-in version instead of guessing.
    scoreline: hasResult ? `${home} ${homeGoals}–${awayGoals} ${away}` : `${home} [score] ${away}`,
    scorers,
    scorersLine: scorers ? ` Goals: ${scorers}.` : '',
  };

  return {
    vars,
    storyline: input.storyline,
    variant: input.venue,
    outcome,
    start,
    startWord: 'Kick-off',
    library: footballLibrary,
    phases: footballPhases,
    title: hasResult ? vars.scoreline : fixture,
    subtitle: [vars.competition === 'the match' ? '' : vars.competition, vars.ground, `${shortDate(start)} ${start.getUTCFullYear()}, ${vars.time}`]
      .filter(Boolean)
      .join(' · '),
    mode: 'football',
  };
}

function brandContext(input: BrandInput, start: Date): Context {
  const brand = clean(input.brand);
  const launch = clean(input.launch) || brand;
  const vars: Vars = {
    brand,
    launch,
    place: clean(input.place),
    day: dayName(start),
    date: longDate(start),
    time: clock(start),
    spokesperson: clean(input.spokesperson),
    partner: clean(input.partner),
    featured: clean(input.featured),
    milestone: clean(input.milestone) || 'A milestone',
  };
  return {
    vars,
    storyline: input.storyline,
    variant: input.kind,
    outcome: input.outcome,
    start,
    startWord: input.kind === 'event' ? 'Doors open' : 'Launch',
    library: brandLibrary,
    phases: brandPhases(input.kind),
    title: launch,
    subtitle: [brand !== launch ? brand : '', vars.place, `${stamp(start)} ${start.getUTCFullYear()}`].filter(Boolean).join(' · '),
    mode: 'brand',
  };
}

/** Whether a template belongs in this plan. */
export function applies(t: Template, ctx: Pick<Context, 'vars' | 'storyline' | 'variant' | 'outcome'>): boolean {
  const w = t.when;
  if (!w) return true;
  if (w.storylines && !w.storylines.includes(ctx.storyline)) return false;
  if (w.variants && !w.variants.includes(ctx.variant)) return false;
  if (w.outcomes && ctx.outcome && !w.outcomes.includes(ctx.outcome)) return false;
  if (w.needs && !w.needs.every((k) => clean(ctx.vars[k]) !== '')) return false;
  if (w.lacks && !w.lacks.every((k) => clean(ctx.vars[k]) === '')) return false;
  return true;
}

/** What is missing before a plan can be made. Empty means ready. */
export function missingFields(input: PlanInput): string[] {
  const missing: string[] = [];
  if (input.mode === 'football') {
    if (!clean(input.club)) missing.push('your club');
    if (!clean(input.opponent)) missing.push('the opponent');
    if (!parseLocal(input.kickoff)) missing.push('the kick-off date and time');
  } else {
    if (!clean(input.brand)) missing.push('your brand');
    if (!parseLocal(input.start)) missing.push('the start date and time');
  }
  return missing;
}

/** Builds the plan, or returns null if required fields are missing. */
export function buildPlan(input: PlanInput): Plan | null {
  if (missingFields(input).length) return null;
  const start = parseLocal(input.mode === 'football' ? input.kickoff : input.start)!;
  const ctx = input.mode === 'football' ? footballContext(input, start) : brandContext(input, start);

  const items: PlanItem[] = ctx.library
    .filter((t) => applies(t, ctx))
    .map((t) => ({
      id: t.id,
      phase: t.phase,
      at: t.at,
      timeLabel: t.moment ?? relativeLabel(t.at, ctx.startWord),
      dateLabel: t.moment ? '' : stamp(addMinutes(start, t.at)),
      title: fill(t.title, ctx.vars),
      format: t.format,
      channels: t.channels,
      caption: fill(t.caption, ctx.vars),
      why: t.why,
      principle: t.principle,
      outcomes: t.when?.outcomes,
    }))
    .sort((a, b) => a.at - b.at || order(a.outcomes) - order(b.outcomes));

  return {
    mode: ctx.mode,
    title: ctx.title,
    subtitle: ctx.subtitle,
    outcome: ctx.outcome,
    phases: ctx.phases.map((p) => ({ ...p, items: items.filter((i) => i.phase === p.id) })),
  };
}

const order = (o?: Outcome[]) => (o?.length ? ['win', 'draw', 'loss'].indexOf(o[0]) + 1 : 0);
