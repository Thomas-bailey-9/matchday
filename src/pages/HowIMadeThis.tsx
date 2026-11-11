// Wording to be confirmed by Thomas before publishing (see STATUS.md).

export function HowIMadeThis() {
  return (
    <div className="page prose">
      <div className="intro">
        <p className="eyebrow">How I made this</p>
        <h1 tabIndex={-1}>Built with AI tools. Decided by me.</h1>
        <p className="lead">
          I’m Thomas Bailey, a creative storyteller in sport, content and design. I made Matchday to show how a club media
          team plans a match day, and why each post is there.
        </p>
      </div>

      <section className="panel">
        <h2>The tools</h2>
        <ul>
          <li><strong>ChatGPT</strong> and <strong>Claude</strong> helped me shape the idea and write the code and first drafts of the content.</li>
          <li><strong>GitHub</strong> stores the code and hosts the site, for free.</li>
        </ul>
      </section>

      <section className="panel">
        <h2>What I decided</h2>
        <ul>
          <li>Football as the theme, with a brand and event mode so any company can use it.</li>
          <li>A rules-based planner instead of AI at runtime: the same fixture always gives the same plan, it costs nothing to run, and it works offline.</li>
          <li>Teaching built in: every post explains why it works, and the Playbook collects the principles.</li>
          <li>A website that feels like an app on a phone, rather than an App Store app.</li>
          <li>Real club and player names in captions, and a real demo fixture with every fact sourced.</li>
          <li>No crests, kits or player photos, because I don’t hold the rights to them.</li>
        </ul>
      </section>

      <section className="panel">
        <h2>What it doesn’t do</h2>
        <ul>
          <li>It doesn’t invent facts or statistics. Any number in a plan comes from what you type in.</li>
          <li>It doesn’t send your fixture anywhere. Everything stays on your device.</li>
          <li>It isn’t made by or for any club, league or brand.</li>
        </ul>
      </section>

      <section className="panel">
        <h2>The demo fixture</h2>
        <p>
          Burnley 2–0 Liverpool, Premier League, 20 August 2016 at Turf Moor. I checked the result, date, kick-off time,
          venue and scorers against the{' '}
          <a href="https://www.premierleague.com/en/match/855444" target="_blank" rel="noreferrer">
            Premier League match centre<span className="sr-only"> (opens in a new tab)</span>
          </a>{' '}
          for my football editorial.
        </p>
      </section>

      <section className="panel">
        <h2>See more of my work</h2>
        <p>
          <a href="https://thomas-bailey-9.github.io" target="_blank" rel="noreferrer">
            thomas-bailey-9.github.io<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </p>
      </section>
    </div>
  );
}
