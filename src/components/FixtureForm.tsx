import type { FootballInput } from '../engine/types';
import { footballStorylines } from '../content/labels';
import { Choice, TextField } from './controls';

export function FixtureForm({ value, onChange }: { value: FootballInput; onChange: (v: FootballInput) => void }) {
  const set = <K extends keyof FootballInput>(key: K, v: FootballInput[K]) => onChange({ ...value, [key]: v });
  const result = value.result;
  const goals = (n: number | null | undefined) => (typeof n === 'number' && !Number.isNaN(n) ? String(n) : '');
  const toGoals = (s: string) => (s === '' ? NaN : Math.max(0, Math.min(99, Math.trunc(Number(s)))));

  return (
    <div className="form-grid">
      <h2 className="form-heading">The fixture</h2>
      <TextField label="Your club" value={value.club} onChange={(v) => set('club', v)} placeholder="e.g. Burnley" autoComplete="organization" />
      <Choice legend="Venue" name="venue" value={value.venue} onChange={(v) => set('venue', v)}
        options={[{ value: 'home', label: 'Home' }, { value: 'away', label: 'Away' }]} />
      <TextField label="Opponent" value={value.opponent} onChange={(v) => set('opponent', v)} placeholder="e.g. Liverpool" />
      <TextField label="Competition" optional value={value.competition} onChange={(v) => set('competition', v)} placeholder="e.g. Premier League" />
      {value.venue === 'home' && (
        <TextField label="Your ground" optional value={value.ground ?? ''} onChange={(v) => set('ground', v)} placeholder="e.g. Turf Moor" />
      )}
      <TextField label="Kick-off" type="datetime-local" value={value.kickoff} onChange={(v) => set('kickoff', v)}
        hint="Local time. Every post is timed from this." />

      <h2 className="form-heading">The story</h2>
      <Choice legend="This week’s storyline" name="storyline" wrap value={value.storyline}
        onChange={(v) => set('storyline', v)} options={footballStorylines.map((s) => ({ value: s.id, label: s.label }))}
        hint="Pick one. A week with one story is easier to follow." />

      <h2 className="form-heading">Names</h2>
      <p className="hint">Optional. Names you add go straight into the captions.</p>
      <TextField label="Captain" optional value={value.captain ?? ''} onChange={(v) => set('captain', v)} />
      {value.storyline === 'signing' && (
        <TextField label="New signing" optional value={value.signing ?? ''} onChange={(v) => set('signing', v)} />
      )}
      {value.storyline === 'milestone' && (
        <>
          <TextField label="Milestone player" optional value={value.milestonePlayer ?? ''} onChange={(v) => set('milestonePlayer', v)} />
          <TextField label="The milestone" optional value={value.milestone ?? ''} onChange={(v) => set('milestone', v)}
            placeholder="e.g. 100th appearance" hint="Only add it once it is confirmed." />
        </>
      )}

      <h2 className="form-heading">Result</h2>
      <label className="toggle">
        <input
          type="checkbox"
          checked={!!result}
          onChange={(e) => set('result', e.target.checked ? { scored: NaN, conceded: NaN, scorers: '' } : undefined)}
        />
        <span>Add the result</span>
      </label>
      <p className="hint">{result ? 'Goals are from your club’s side.' : 'Leave it off before the game: the plan prepares a version for a win, a draw and a defeat.'}</p>
      {result && (
        <>
          <div className="score-row">
            <TextField label={value.club.trim() || 'Your goals'} type="number" inputMode="numeric" min={0} max={99}
              value={goals(result.scored)} onChange={(v) => set('result', { ...result, scored: toGoals(v) })} />
            <span className="score-dash" aria-hidden="true">–</span>
            <TextField label={value.opponent.trim() || 'Their goals'} type="number" inputMode="numeric" min={0} max={99}
              value={goals(result.conceded)} onChange={(v) => set('result', { ...result, conceded: toGoals(v) })} />
          </div>
          <TextField label="Your scorers" optional value={result.scorers ?? ''} onChange={(v) => set('result', { ...result, scorers: v })}
            placeholder="e.g. Vokes 2′, Gray 37′" />
        </>
      )}
    </div>
  );
}
