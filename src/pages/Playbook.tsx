import { principles } from '../content/playbook';
import { footballLibrary } from '../content/football';
import { brandLibrary } from '../content/brand';

const uses = (id: string) => footballLibrary.filter((t) => t.principle === id).length + brandLibrary.filter((t) => t.principle === id).length;

export function Playbook() {
  return (
    <div className="page">
      <div className="intro">
        <p className="eyebrow">Playbook</p>
        <h1 tabIndex={-1}>The thinking behind every post.</h1>
        <p className="lead">
          Each “Why this works” note in a plan comes back to one of these principles. They apply to a club on match day
          and to a brand on launch day.
        </p>
      </div>
      <ol className="principles">
        {principles.map((p, i) => (
          <li key={p.id} id={p.id} tabIndex={-1} className="principle panel">
            <p className="principle-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</p>
            <h2 className="principle-title">{p.title}</h2>
            <p className="principle-summary">{p.summary}</p>
            <dl className="principle-apply">
              <div><dt>Match day</dt><dd>{p.football}</dd></div>
              <div><dt>Brand or event</dt><dd>{p.brand}</dd></div>
            </dl>
            <p className="principle-uses">Behind {uses(p.id)} plan items</p>
          </li>
        ))}
      </ol>
      <p className="back"><a className="pill" href="#/">Back to the planner</a></p>
    </div>
  );
}
