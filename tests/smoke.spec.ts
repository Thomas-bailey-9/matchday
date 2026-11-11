import { expect, test, type Page } from '@playwright/test';

const isPhone = (page: Page) => (page.viewportSize()?.width ?? 1440) < 900;

/** On phones the form sits behind the Fixture switch. */
async function openForm(page: Page) {
  if (isPhone(page)) await page.getByRole('button', { name: 'Fixture', exact: true }).click();
}
async function showPlan(page: Page) {
  if (isPhone(page)) await page.getByRole('button', { name: 'See the plan' }).click();
}

test.beforeEach(async ({ page }) => {
  await page.goto('./');
});

test('opens on the sourced demo plan', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Plan the whole match day/);
  await expect(page.locator('#plan-title')).toHaveText('Burnley 2–0 Liverpool');
  await expect(page.getByText('Premier League · Turf Moor · Sat 20 Aug 2016, 15:00')).toBeVisible();
  for (const phase of ['Build-up', 'Match day', 'After']) {
    await expect(page.getByRole('heading', { level: 3, name: phase })).toBeVisible();
  }
  const teamNews = page.locator('.item', { has: page.getByRole('heading', { name: 'Team news' }) });
  await expect(teamNews).toContainText('60 min before');
  await expect(teamNews).toContainText('Sat 20 Aug, 14:00');
  await expect(page.getByText('FULL TIME. Burnley 2–0 Liverpool. Goals: Vokes 2′, Gray 37′. What a feeling.')).toBeVisible();
  await expect(page.getByRole('link', { name: /Source/ })).toHaveAttribute('href', 'https://www.premierleague.com/en/match/855444');
});

test('why notes open and link to the playbook', async ({ page }) => {
  const first = page.locator('.item').first();
  await first.getByText('Why this works').click();
  await expect(first.locator('.why p').first()).toBeVisible();
  await first.getByRole('link', { name: 'Build anticipation in steps' }).click();
  await expect(page).toHaveURL(/#\/playbook\/ladder$/);
  await expect(page.locator('#ladder')).toBeFocused();
});

test('names typed in appear in captions instantly', async ({ page }) => {
  await openForm(page);
  await page.getByLabel(/^Captain/).fill('Jordan Reid');
  await showPlan(page);
  await expect(page.getByText('Team news. Your Burnley side to face Liverpool, led by Jordan Reid.')).toBeVisible();
});

test('without a result, the plan prepares every outcome', async ({ page }) => {
  await openForm(page);
  await page.getByLabel('Add the result').uncheck();
  await showPlan(page);
  await expect(page.locator('#plan-title')).toHaveText('Burnley v Liverpool');
  for (const t of ['Full time: win', 'Full time: draw', 'Full time: defeat']) {
    await expect(page.getByRole('heading', { name: t })).toBeVisible();
  }
});

test('brand or event mode reuses the engine', async ({ page }) => {
  await openForm(page);
  await page.getByRole('radio', { name: 'Brand or event' }).check();
  await page.getByLabel('Your brand or company').fill('Northlight');
  await page.getByLabel(/Product or launch name/).fill('Winter Blend');
  await page.getByLabel('Goes live').fill('2026-12-01T09:00');
  await showPlan(page);
  await expect(page.locator('#plan-title')).toHaveText('Winter Blend');
  await expect(page.getByRole('heading', { level: 3, name: 'Launch day' })).toBeVisible();
  await expect(page.getByText('Winter Blend is live. [link]')).toBeVisible();
});

test('copies the plan as a checklist', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.getByRole('button', { name: 'Copy checklist' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Checklist copied' })).toBeVisible();
  const text = await page.evaluate(() => navigator.clipboard.readText());
  expect(text).toContain('MATCHDAY PLAN: Burnley 2–0 Liverpool');
  expect(text).toContain('[ ] 60 min before (Sat 20 Aug, 14:00): Team news');
});

test('print shows the plan only', async ({ page }) => {
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.form-panel')).toBeHidden();
  await expect(page.locator('.site-header')).toBeHidden();
  await expect(page.locator('#plan-title')).toBeVisible();
});

test('pages, notes and credits are in place', async ({ page }) => {
  await expect(page.getByText('Matchday is not made by or for any club, league or brand.')).toBeVisible();
  await openForm(page);
  await expect(page.getByRole('heading', { name: 'Why no crests or photos' })).toBeVisible();
  await page.getByRole('link', { name: 'Playbook', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/thinking behind every post/);
  await expect(page.locator('.principle')).toHaveCount(13);
  await page.getByRole('link', { name: 'How I made this' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  for (const name of ['ChatGPT', 'Claude', 'GitHub']) await expect(page.locator('main')).toContainText(name);
});

test('phone-first basics: no sideways scroll, big targets, readable text', async ({ page }) => {
  for (const route of ['./', './#/playbook', './#/how']) {
    await page.goto(route);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, route).toBeLessThanOrEqual(0);
  }
  await page.goto('./');
  await openForm(page);
  const small = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>('button, .pill, .choice-option span, summary, .input')]
      .filter((el) => el.offsetParent !== null)
      .map((el) => ({ text: el.textContent?.trim().slice(0, 30), h: el.getBoundingClientRect().height }))
      .filter((r) => r.h < 44),
  );
  expect(small).toEqual([]);
  const bodySize = await page.evaluate(() => parseFloat(getComputedStyle(document.body).fontSize));
  expect(bodySize).toBeGreaterThanOrEqual(16);
});

test('keyboard: skip link and visible focus', async ({ page }) => {
  test.skip(isPhone(page), 'Keyboard check runs at desktop size');
  await expect(page.locator('#plan-title')).toBeVisible();
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press('Tab');
  const outline = await page.evaluate(() => getComputedStyle(document.activeElement!).outlineStyle);
  expect(outline).toBe('solid');
});

test('reduced motion turns animation off', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const anim = await page.locator('.item').first().evaluate((el) => getComputedStyle(el).animationName);
  expect(anim).toBe('none');
});

test('installable and offline-ready', async ({ page, request, context }) => {
  const manifest = await (await request.get('manifest.webmanifest')).json();
  expect(manifest.display).toBe('standalone');
  expect((await request.get('icons/apple-touch-icon.png')).ok()).toBe(true);
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('#plan-title')).toHaveText('Burnley 2–0 Liverpool');
  await context.setOffline(false);
});

test('screenshots for review', async ({ page }, info) => {
  const dir = `docs/screenshots/${info.project.name}`;
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.screenshot({ path: `${dir}/01-planner.png` });
  await page.locator('.item').nth(1).getByText('Why this works').click();
  await page.locator('#phase-match-day').scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${dir}/02-plan-match-day.png` });
  await page.screenshot({ path: `${dir}/03-plan-full.png`, fullPage: true });
  await page.evaluate(() => window.scrollTo(0, 0));
  await openForm(page);
  await page.screenshot({ path: `${dir}/04-form.png` });
  await page.getByRole('radio', { name: 'Brand or event' }).check();
  await page.screenshot({ path: `${dir}/05-brand-form.png` });
  await page.goto('./#/playbook');
  await page.screenshot({ path: `${dir}/06-playbook.png` });
  await page.goto('./#/how');
  await page.screenshot({ path: `${dir}/07-how-i-made-this.png` });
});
