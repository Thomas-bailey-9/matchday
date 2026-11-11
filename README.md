# Matchday

A free match-day content planner. Enter a fixture and get a full content plan in three phases (build-up, match day and after), with a format, channel, time and caption starter for every post, plus a **Why this works** note that explains the reasoning.

- **Football mode:** home or away, opponent, competition, kick-off, one storyline (derby, cup tie, new signing, title race, relegation fight, player milestone or an ordinary week), optional player names and an optional result. Win, draw and defeat each get their own guidance; with no result, the plan prepares all three.
- **Brand or event mode:** the same engine for a product launch or an event, so any company can use it.
- **Playbook:** the 13 principles behind the notes.
- **Export:** copy the plan as a checklist, or print it / save it as a PDF.
- **Demo:** Burnley 2–0 Liverpool, Premier League, 20 August 2016 at Turf Moor. Every fact comes from the Premier League match centre (match 855444), as recorded in Thomas's portfolio sources.

Matchday is an independent tool, not made by or for any club. It uses names only: club crests, kits and player photos are protected by trademarks and image rights, so users add their own club's cleared assets.

Live site (once published): https://thomas-bailey-9.github.io/matchday/

## How it works

No AI at runtime, no server, no accounts, no API keys. A rules-and-templates engine:

| Folder | What it holds |
|---|---|
| `src/content/` | The content: plan items for football (`football.ts`) and brands (`brand.ts`), the Playbook principles, the demo fixture and labels. Edit these to change the advice. |
| `src/engine/` | Pure functions that pick the right items for the inputs, time them from kick-off, and fill in the names (`plan.ts`, `time.ts`, `checklist.ts`). Unit-tested in `plan.test.ts`. |
| `src/components/`, `src/pages/` | The React interface. |
| `sw/sw.js` | A small service worker so the site works offline after the first visit. |
| `scripts/deploy.mjs` | Publishes the built site to the `gh-pages` branch (`npm run deploy`). |
| `tests/` | Playwright smoke tests at desktop and iPhone size. They also save review screenshots to `docs/screenshots/`. |

Captions are starters. Text in `[square brackets]` is for the user to fill in on the day. The only numbers a plan contains are the ones the user typed (score, scorers, times), which a unit test checks.

## Run it on Windows

You need Node.js 22.12 or later (`node -v` in PowerShell shows your version) and Google Chrome for the browser tests.

1. Open PowerShell in this folder: in File Explorer open `C:\Dev\Matchday`, click the address bar, type `powershell` and press Enter.
2. Install once:

```bash
npm install
```

3. Start it, then open the address it prints (http://localhost:5173/matchday/):

```bash
npm run dev
```

Press `Ctrl+C` in PowerShell to stop it.

### Checks

```bash
npm test
```

```bash
npm run build
```

```bash
npm run test:e2e
```

`npm test` runs the engine unit tests. `npm run build` type-checks and builds the site into `dist/`. `npm run test:e2e` builds the site, serves it at http://localhost:4173/matchday/ and runs the browser tests in your installed Chrome.

To try the built site yourself: `npm run build`, then `npm run preview`, then open http://localhost:4173/matchday/.

## Publish on GitHub Pages

The site lives at https://thomas-bailey-9.github.io/matchday/ (see `base` in `vite.config.ts`). The code is in the `main` branch; the finished site is in the `gh-pages` branch, which GitHub Pages serves.

**To publish an update**, open PowerShell in `C:\Dev\Matchday` (File Explorer → the folder → click the address bar → type `powershell` → Enter), then:

```bash
npm run deploy
```

It builds the site and pushes it to `gh-pages`. The live site updates within a couple of minutes. Remember to commit and push your code changes to `main` too.

**One-off set-up (already done once):** on the repository page, **Settings** → **Pages** → **Source: Deploy from a branch** → branch `gh-pages`, folder `/ (root)` → **Save**.

### Add it to an iPhone home screen

Open the site in Safari, tap **Share** → **Add to Home Screen** → **Add**. It opens full screen like an app, and works offline once it has loaded.

## Credits

Built by Thomas Bailey with ChatGPT, Claude and GitHub. Headings use Barlow Condensed (SIL Open Font License), bundled so it works offline.
