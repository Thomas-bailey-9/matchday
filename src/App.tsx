import { useEffect, useRef, useState } from 'react';
import { Planner } from './pages/Planner';
import { Playbook } from './pages/Playbook';
import { HowIMadeThis } from './pages/HowIMadeThis';

type Route = { page: 'planner' | 'playbook' | 'how'; anchor?: string };

// Hash routes (#/playbook) work on GitHub Pages with no server set-up.
function parse(hash: string): Route {
  const [, page, anchor] = hash.replace(/^#/, '').split('/');
  if (page === 'playbook') return { page: 'playbook', anchor };
  if (page === 'how') return { page: 'how' };
  return { page: 'planner' };
}

const NAV: { page: Route['page']; href: string; label: string }[] = [
  { page: 'planner', href: '#/', label: 'Planner' },
  { page: 'playbook', href: '#/playbook', label: 'Playbook' },
  { page: 'how', href: '#/how', label: 'How I made this' },
];

export function App() {
  const [route, setRoute] = useState(() => parse(location.hash));
  const main = useRef<HTMLElement>(null);
  const first = useRef(true);

  useEffect(() => {
    const onHash = () => setRoute(parse(location.hash));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // On page change, move focus to the new heading so keyboard and screen
  // reader users land on the content. Not on first load.
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (route.anchor) {
      const target = document.getElementById(route.anchor);
      if (target) { target.scrollIntoView(); target.focus({ preventScroll: true }); return; }
    }
    window.scrollTo(0, 0);
    main.current?.querySelector<HTMLElement>('h1')?.focus({ preventScroll: true });
  }, [route.page, route.anchor]);

  useEffect(() => {
    const names = { planner: 'Content planner', playbook: 'Playbook', how: 'How I made this' };
    document.title = `Matchday · ${names[route.page]}`;
  }, [route.page]);

  return (
    <>
      <a className="skip" href="#main" onClick={(e) => { e.preventDefault(); main.current?.querySelector<HTMLElement>('h1')?.focus(); }}>
        Skip to content
      </a>
      <header className="site-header">
        <a className="wordmark" href="#/" aria-label="Matchday, planner home">
          Matchday<span aria-hidden="true">.</span>
        </a>
        <nav aria-label="Main">
          <ul className="nav">
            {NAV.map((n) => (
              <li key={n.page}>
                <a className="pill pill-nav" href={n.href} aria-current={route.page === n.page ? 'page' : undefined}>{n.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main id="main" ref={main}>
        {route.page === 'planner' && <Planner />}
        {route.page === 'playbook' && <Playbook />}
        {route.page === 'how' && <HowIMadeThis />}
      </main>

      <footer className="site-footer">
        <p><strong>An independent tool.</strong> Matchday is not made by or for any club, league or brand.</p>
        <p>Free, no sign-up, no tracking. Works offline once loaded.</p>
      </footer>
    </>
  );
}
