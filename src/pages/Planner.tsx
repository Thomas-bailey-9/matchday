import { useEffect, useMemo, useState } from 'react';
import type { BrandInput, FootballInput, Mode } from '../engine/types';
import { buildPlan, missingFields } from '../engine/plan';
import { blankBrand, blankFixture, demoFixture, demoSource } from '../content/demo';
import { FixtureForm } from '../components/FixtureForm';
import { BrandForm } from '../components/BrandForm';
import { PlanView } from '../components/PlanView';
import { Choice } from '../components/controls';

interface Saved { mode: Mode; football: FootballInput; brand: BrandInput }
const KEY = 'matchday:v1';

// Remembers the last plan on this device only. Falls back to the demo.
function load(): Saved {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const s = JSON.parse(raw) as Saved;
      if (s.football?.mode === 'football' && s.brand?.mode === 'brand') return s;
    }
  } catch { /* storage blocked: use defaults */ }
  return { mode: 'football', football: demoFixture, brand: blankBrand };
}

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

export function Planner() {
  const [state, setState] = useState<Saved>(load);
  // Phones show one side at a time; wider screens show both.
  const [view, setView] = useState<'form' | 'plan'>('plan');
  const show = (v: 'form' | 'plan') => {
    setView(v);
    document.getElementById('view-switch')?.scrollIntoView({ block: 'start' });
  };
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ }
  }, [state]);

  const input = state.mode === 'football' ? state.football : state.brand;
  const plan = useMemo(() => buildPlan(input), [input]);
  const missing = missingFields(input);
  const isDemo = state.mode === 'football' && same(state.football, demoFixture);

  return (
    <div className="planner">
      <div className="intro">
        <h1 tabIndex={-1}>Plan the whole match day in a minute.</h1>
        <p className="lead">
          Enter a fixture. Get a build-up, match-day and after-match plan, with a caption starter for every post and the reasoning behind it.
        </p>
      </div>

      <div className="view-switch" id="view-switch" role="group" aria-label="Show">
        <button type="button" className="pill" aria-pressed={view === 'form'} onClick={() => show('form')}>Fixture</button>
        <button type="button" className="pill" aria-pressed={view === 'plan'} onClick={() => show('plan')}>Plan</button>
      </div>

      <div className={`planner-grid view-${view}`}>
        <section className="panel form-panel" aria-labelledby="form-title">
          <h2 id="form-title" className="sr-only">Your fixture</h2>
          <Choice<Mode>
            legend="Plan for"
            name="mode"
            value={state.mode}
            onChange={(mode) => setState({ ...state, mode })}
            options={[{ value: 'football', label: 'Football' }, { value: 'brand', label: 'Brand or event' }]}
          />
          {state.mode === 'football' ? (
            <FixtureForm value={state.football} onChange={(football) => setState({ ...state, football })} />
          ) : (
            <BrandForm value={state.brand} onChange={(brand) => setState({ ...state, brand })} />
          )}
          <div className="form-actions">
            <button type="button" className="pill pill-solid phone-only" onClick={() => show('plan')}>
              See the plan
            </button>
            {state.mode === 'football' && !isDemo && (
              <button type="button" className="pill" onClick={() => setState({ ...state, football: demoFixture })}>
                Load demo: Burnley 2–0 Liverpool
              </button>
            )}
            <button type="button" className="pill pill-quiet"
              onClick={() => setState(state.mode === 'football' ? { ...state, football: blankFixture } : { ...state, brand: blankBrand })}>
              Clear form
            </button>
          </div>

          <aside className="note" aria-labelledby="crests-title">
            <h2 id="crests-title" className="note-title">Why no crests or photos</h2>
            <p>
              Club crests, kits and player photos are protected by trademarks and image rights. Matchday uses names only,
              so add your own club’s cleared assets when you make each post.
            </p>
          </aside>
        </section>

        <div className="plan-column">
          {plan ? (
            <PlanView plan={plan} source={isDemo ? demoSource : undefined} />
          ) : (
            <div className="panel empty" role="status">
              <h2 className="empty-title">Your plan appears here</h2>
              <p>Add {missing.join(', ').replace(/, ([^,]*)$/, ' and $1')} to see it.</p>
              <button type="button" className="pill pill-solid phone-only" onClick={() => show('form')}>Add the fixture</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
