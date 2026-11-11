# Status

Last updated: 11 November 2026. Built locally and committed; **not published**.

## Built

- **Planner** (football): fixture form (club, home/away, opponent, competition, ground, kick-off), seven storylines, optional captain / new signing / milestone player, optional result with scorers. The plan updates as you type.
- **Plan**: three phases. Build-up from 72 h, match day (matchday post, arrivals, team news 60 min before, warm-up, kick-off, goal templates, half-time, clips, full time), after (reaction, player vote, highlights, photos or talking points or back-to-work, next fixture, week ahead). Win, draw and defeat each have their own items; without a result all three are prepared and labelled.
- Every item: time before/after kick-off and the actual date and time, format, channels, caption starter with the names entered, a copy button, and an expandable **Why this works** note linked to its Playbook principle.
- **Brand or event** mode on the same engine: launch or event, six storylines, spokesperson / featured person / partner / milestone, outcome against your own goal.
- **Playbook** page (13 principles, each applied to match day and to brands) and **How I made this** page.
- **Export**: copy as a checklist; print or save as PDF (print layout shows the plan only, with every note open).
- Independent-tool line in the footer and a **Why no crests or photos** note on the planner.
- **Demo**: Burnley 2–0 Liverpool, 20 August 2016, 15:00, Turf Moor, Premier League; scorers Vokes 2′, Gray 37′. All from Thomas's sourced editorial (Premier League match centre, match 855444). No player names added, because no captain or signing is sourced. Storyline set to Ordinary week.
- Phone-first: a Fixture / Plan switch on phones, phase links docked at the bottom, 44 px targets, 16 px+ text, no sideways scroll. Keyboard skip link, visible focus, reduced motion respected, AA contrast. The last plan is remembered on the device only.
- Web manifest, home-screen icons and a service worker: works offline after the first visit (tested).
- GitHub Pages workflow (`.github/workflows/pages.yml`) ready; it runs once the repository exists.

## Checked

- `npm test`: 28 engine unit tests (timings, storyline and result variants, home/away score order, name substitution, no unfilled tokens, numbers only from input, checklist export).
- `npm run build`: passes (type check and build).
- `npm run test:e2e`: 25 Playwright tests pass at desktop (1440×900, Chrome) and iPhone 14 size; one keyboard test is desktop-only by design.
- Screenshots reviewed: `docs/screenshots/desktop/` and `docs/screenshots/iphone/`.

## Left to do

1. **Thomas to review** the site and the screenshots.
2. **Thomas to check the How I made this wording**, especially what ChatGPT and Claude each did (`src/pages/HowIMadeThis.tsx`). It currently says they "helped me shape the idea and write the code and first drafts of the content"; adjust if that is not accurate.
3. **Publish** only after approval: create the public `matchday` repository and turn on Pages (steps in `README.md`).
4. **Real iPhone test** (pending, Thomas): open the live site in Safari, add it to the home screen, try it with flight mode on, and try Copy checklist and Print.
5. Optional later: a share link that carries the fixture in the URL; more storylines (e.g. first home game, pre-season).
