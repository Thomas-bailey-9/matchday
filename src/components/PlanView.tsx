import { useEffect, useState } from 'react';
import type { Plan, PlanItem } from '../engine/types';
import { toChecklist } from '../engine/checklist';
import { principleById } from '../content/playbook';
import { outcomeLabels } from '../content/brand';

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for browsers that block the clipboard API.
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    area.remove();
    return ok;
  }
}

function useFlash(): [string, (msg: string) => void] {
  const [msg, setMsg] = useState('');
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(''), 2500);
    return () => clearTimeout(t);
  }, [msg]);
  return [msg, setMsg];
}

// Open every "Why this works" note for printing, then put them back.
function usePrintOpensNotes() {
  useEffect(() => {
    let opened: HTMLDetailsElement[] = [];
    const before = () => {
      opened = [...document.querySelectorAll<HTMLDetailsElement>('.plan details:not([open])')];
      opened.forEach((d) => (d.open = true));
    };
    const after = () => opened.forEach((d) => (d.open = false));
    window.addEventListener('beforeprint', before);
    window.addEventListener('afterprint', after);
    return () => {
      window.removeEventListener('beforeprint', before);
      window.removeEventListener('afterprint', after);
    };
  }, []);
}

export function PlanView({ plan, source }: { plan: Plan; source?: { text: string; href: string } }) {
  const [status, flash] = useFlash();
  usePrintOpensNotes();
  const labels = outcomeLabels[plan.mode];
  const count = plan.phases.reduce((n, p) => n + p.items.length, 0);

  return (
    <section className="plan" aria-labelledby="plan-title">
      <header className="plan-head">
        <p className="eyebrow">Your plan · {count} posts</p>
        <h2 id="plan-title" className="plan-title">{plan.title}</h2>
        <p className="plan-sub">{plan.subtitle}</p>
        {plan.outcome && <p className={`result-chip result-${plan.outcome}`}>{labels[plan.outcome]}</p>}
        {source && (
          <p className="source">
            {source.text} <a href={source.href} target="_blank" rel="noreferrer">Source<span className="sr-only"> (opens in a new tab)</span></a>
          </p>
        )}
      </header>

      <div className="exports">
        <button type="button" className="pill pill-solid" onClick={async () => flash((await copyText(toChecklist(plan))) ? 'Checklist copied' : 'Copy failed. Try Print instead.')}>
          Copy checklist
        </button>
        <button type="button" className="pill" onClick={() => window.print()}>Print or save PDF</button>
      </div>

      <div className="dock">
        <nav aria-label="Jump to phase" className="phase-jump">
          {plan.phases.map((p) => (
            <a key={p.id} className="pill pill-small" href={`#phase-${p.id}`}
              onClick={(e) => { e.preventDefault(); const el = document.getElementById(`phase-${p.id}`); el?.scrollIntoView({ block: 'start' }); el?.focus({ preventScroll: true }); }}>
              {p.title}
            </a>
          ))}
        </nav>
      </div>
      <p className="status" role="status" aria-live="polite">{status}</p>

      {plan.phases.map((phase) => (
        <section key={phase.id} className="phase" aria-labelledby={`phase-${phase.id}`}>
          <h3 id={`phase-${phase.id}`} className="phase-title" tabIndex={-1}>{phase.title}</h3>
          <p className="phase-intro">{phase.intro}</p>
          {phase.id !== 'build-up' && !plan.outcome && (
            <p className="phase-note">No result yet, so this phase has a version for each result. Use the one that fits.</p>
          )}
          <ol className="items">
            {phase.items.map((item) => (
              <li key={item.id}>
                <ItemCard item={item} labels={labels} showOutcome={!plan.outcome} onCopy={async () => flash((await copyText(item.caption)) ? 'Caption copied' : 'Copy failed')} />
              </li>
            ))}
          </ol>
        </section>
      ))}
    </section>
  );
}

function ItemCard({ item, labels, showOutcome, onCopy }: {
  item: PlanItem;
  labels: Record<'win' | 'draw' | 'loss', string>;
  showOutcome: boolean;
  onCopy: () => void;
}) {
  const principle = principleById[item.principle];
  return (
    <article className="item">
      <p className="item-when">
        <span className="item-time">{item.timeLabel}</span>
        {item.dateLabel && <span className="item-date">{item.dateLabel}</span>}
      </p>
      <h4 className="item-title">{item.title}</h4>
      <p className="item-meta">
        <span className={`format format-${item.format.replace(/\s+/g, '-').toLowerCase()}`}>{item.format}</span>
        <span className="channels">{item.channels.join(' · ')}</span>
        {showOutcome && item.outcomes && (
          <span className="if-outcome">If {item.outcomes.map((o) => labels[o].toLowerCase()).join(' or ')}</span>
        )}
      </p>
      <div className="caption">
        <p><span className="sr-only">Caption starter: </span>{item.caption}</p>
        <button type="button" className="copy" onClick={onCopy}>
          Copy<span className="sr-only"> caption for {item.title}</span>
        </button>
      </div>
      <details className="why">
        <summary>Why this works</summary>
        <p>{item.why}</p>
        <p className="why-principle">
          Principle: <a href={`#/playbook/${principle.id}`}>{principle.title}</a>
        </p>
      </details>
    </article>
  );
}
