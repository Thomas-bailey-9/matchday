import type { BrandInput, Outcome } from '../engine/types';
import { brandStorylines } from '../content/labels';
import { outcomeLabels } from '../content/brand';
import { Choice, TextField } from './controls';

export function BrandForm({ value, onChange }: { value: BrandInput; onChange: (v: BrandInput) => void }) {
  const set = <K extends keyof BrandInput>(key: K, v: BrandInput[K]) => onChange({ ...value, [key]: v });
  const event = value.kind === 'event';

  return (
    <div className="form-grid">
      <h2 className="form-heading">The {event ? 'event' : 'launch'}</h2>
      <Choice legend="Type" name="kind" value={value.kind} onChange={(v) => set('kind', v)}
        options={[{ value: 'launch', label: 'Product launch' }, { value: 'event', label: 'Event' }]} />
      <TextField label="Your brand or company" value={value.brand} onChange={(v) => set('brand', v)} placeholder="e.g. Northlight Coffee" autoComplete="organization" />
      <TextField label={event ? 'Event name' : 'Product or launch name'} optional value={value.launch} onChange={(v) => set('launch', v)}
        placeholder={event ? 'e.g. Summer Social' : 'e.g. Winter Blend'} />
      {event && <TextField label="Venue" optional value={value.place ?? ''} onChange={(v) => set('place', v)} />}
      <TextField label={event ? 'Doors open' : 'Goes live'} type="datetime-local" value={value.start} onChange={(v) => set('start', v)}
        hint="Local time. Every post is timed from this." />

      <h2 className="form-heading">The story</h2>
      <Choice legend="What kind of moment is it?" name="brand-storyline" wrap value={value.storyline}
        onChange={(v) => set('storyline', v)} options={brandStorylines.map((s) => ({ value: s.id, label: s.label }))} />

      <h2 className="form-heading">Names</h2>
      <p className="hint">Optional. Names you add go straight into the captions.</p>
      <TextField label="Spokesperson" optional value={value.spokesperson ?? ''} onChange={(v) => set('spokesperson', v)} placeholder="e.g. your founder" />
      <TextField label={event ? 'Featured guest' : 'Featured person'} optional value={value.featured ?? ''} onChange={(v) => set('featured', v)} />
      {value.storyline === 'collaboration' && (
        <TextField label="Partner" optional value={value.partner ?? ''} onChange={(v) => set('partner', v)} />
      )}
      {value.storyline === 'anniversary' && (
        <TextField label="The milestone" optional value={value.milestone ?? ''} onChange={(v) => set('milestone', v)} placeholder="e.g. Ten years" />
      )}

      <h2 className="form-heading">How it went</h2>
      <Choice<'none' | Outcome>
        legend="Against your own goal"
        name="outcome"
        wrap
        value={value.outcome ?? 'none'}
        onChange={(v) => set('outcome', v === 'none' ? undefined : v)}
        hint="Leave it at “Not yet” beforehand: the plan prepares all three."
        options={[
          { value: 'none', label: 'Not yet' },
          { value: 'win', label: outcomeLabels.brand.win },
          { value: 'draw', label: outcomeLabels.brand.draw },
          { value: 'loss', label: outcomeLabels.brand.loss },
        ]}
      />
    </div>
  );
}
