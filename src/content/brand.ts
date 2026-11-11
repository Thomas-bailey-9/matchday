// Brand or event playbook: the same match-day thinking, applied to a product
// launch or an event. "Win, draw, loss" become beating, meeting or missing
// your own goal. Square brackets mark what the user fills in.

import type { PlanPhase, Template } from '../engine/types';

export function brandPhases(kind: 'launch' | 'event'): Omit<PlanPhase, 'items'>[] {
  const day = kind === 'event' ? 'Event day' : 'Launch day';
  return [
    { id: 'build-up', title: 'Build-up', intro: 'About 72 hours to go. Set one story, then raise anticipation a step at a time.' },
    { id: 'match-day', title: day, intro: 'The details an hour out, the moment it goes live, then real reactions. Speed, accuracy, restraint.' },
    { id: 'after', title: 'After', intro: 'Recap, thanks and what comes next. The tone follows how it went against your goal.' },
  ];
}

export const outcomeLabels = {
  football: { win: 'Win', draw: 'Draw', loss: 'Defeat' },
  brand: { win: 'Beat the goal', draw: 'Met the goal', loss: 'Fell short' },
} as const;

const H = 60;

export const brandLibrary: Template[] = [
  // ——— Build-up ———
  {
    id: 'b-teaser', phase: 'build-up', at: -72 * H,
    title: 'Teaser', format: 'Poster', channels: ['Instagram', 'LinkedIn', 'X'],
    caption: 'Something’s coming from {brand}. {day}, {time}.',
    why: 'Three days out, a teaser plants the date without giving everything away. Like a fixture poster, it fixes the when and sets the look for every post that follows.',
    principle: 'ladder', when: { variants: ['launch'] },
  },
  {
    id: 'b-save-date', phase: 'build-up', at: -72 * H,
    title: 'Save the date', format: 'Poster', channels: ['Instagram', 'LinkedIn', 'X'],
    caption: 'Save the date: {launch}, {date}, {time}.',
    why: 'Three days out, people are making plans. One clear image answers what, when and where, and is easy to screenshot and share.',
    principle: 'ladder', when: { variants: ['event'] },
  },

  {
    id: 'b-story-product', phase: 'build-up', at: -70 * H,
    title: 'The problem it solves', format: 'Carousel', channels: ['Instagram', 'LinkedIn'],
    caption: '[the problem]. {launch} is our answer. {date}. Swipe →',
    why: 'People buy solutions, not features. Lead with the problem your audience already feels, and let the product arrive as the answer.',
    principle: 'one-story', when: { storylines: ['new-product'] },
  },
  {
    id: 'b-story-drop', phase: 'build-up', at: -70 * H,
    title: 'Limited run', format: 'Story', channels: ['Instagram Stories', 'TikTok'],
    caption: 'Limited run. {launch} drops {day} at {time}. Set a reminder.',
    why: 'Scarcity works only if it is true. State the real quantity or time limit, and give people a reminder button so interest turns into action on the day.',
    principle: 'one-story', when: { storylines: ['limited-drop'] },
  },
  {
    id: 'b-story-collab', phase: 'build-up', at: -70 * H,
    title: '{brand} × {partner}', format: 'Reel', channels: ['Instagram', 'TikTok', 'LinkedIn'],
    caption: 'Two names, one idea. {brand} × {partner}: {launch}, {date}.',
    why: 'A collaboration borrows two audiences. Post it on both accounts at once, with the same look, so each side’s followers meet the other.',
    principle: 'one-story', when: { storylines: ['collaboration'], needs: ['partner'] },
  },
  {
    id: 'b-story-collab-generic', phase: 'build-up', at: -70 * H,
    title: 'Collaboration reveal', format: 'Reel', channels: ['Instagram', 'TikTok', 'LinkedIn'],
    caption: 'Two names, one idea. {brand} × [partner]: {launch}, {date}.',
    why: 'A collaboration borrows two audiences. Post it on both accounts at once. Add the partner’s name above to fill this in.',
    principle: 'one-story', when: { storylines: ['collaboration'], lacks: ['partner'] },
  },
  {
    id: 'b-story-event', phase: 'build-up', at: -70 * H,
    title: 'Line-up reveal', format: 'Carousel', channels: ['Instagram', 'LinkedIn', 'Facebook'],
    caption: 'Who’s on at {launch}? Swipe →',
    why: 'People come to events for people. Reveal the line-up one face per slide, so each guest has a reason to share it with their own followers.',
    principle: 'people', when: { storylines: ['live-event'] },
  },
  {
    id: 'b-story-anniversary', phase: 'build-up', at: -70 * H,
    title: '{milestone}: how we got here', format: 'Carousel', channels: ['Instagram', 'LinkedIn', 'Facebook'],
    caption: '{milestone}. A look back before {launch}. Swipe →',
    why: 'An anniversary is a story about the people who got you here, customers included. Use real moments from your archive and thank people by name, with their permission.',
    principle: 'people', when: { storylines: ['anniversary'] },
  },
  {
    id: 'b-story-ordinary', phase: 'build-up', at: -70 * H,
    title: 'Behind the scenes', format: 'Reel', channels: ['Instagram', 'TikTok'],
    caption: 'Getting {launch} ready.',
    why: 'Not every release is a headline. Showing the work behind it builds trust and gives people a reason to follow the next one.',
    principle: 'one-story', when: { storylines: ['ordinary'] },
  },

  {
    id: 'b-interview', phase: 'build-up', at: -48 * H,
    title: '{spokesperson} on {launch}', format: 'Podcast clip', channels: ['LinkedIn', 'YouTube', 'Podcast feed'],
    caption: '“[best line]” {spokesperson} on why {launch} matters.',
    why: 'Like a pre-match press conference, one interview gives you a week of clips. Cut answers that stand on their own, and subtitle each one.',
    principle: 'repurpose', when: { needs: ['spokesperson'] },
  },
  {
    id: 'b-interview-generic', phase: 'build-up', at: -48 * H,
    title: 'Why we made it', format: 'Podcast clip', channels: ['LinkedIn', 'YouTube', 'Podcast feed'],
    caption: '“[best line]” [name] on why {launch} matters.',
    why: 'Like a pre-match press conference, one interview gives you a week of clips. Add a spokesperson above and this item will use their name.',
    principle: 'repurpose', when: { lacks: ['spokesperson'] },
  },
  {
    id: 'b-where-launch', phase: 'build-up', at: -46 * H,
    title: 'Where to get it', format: 'Story', channels: ['Instagram Stories', 'WhatsApp channel', 'Email'],
    caption: 'Where to get {launch}: {day}, {time}. [link]',
    why: 'Useful posts earn trust. The best campaign fails if people cannot find where to buy. Keep it short and practical.',
    principle: 'service', when: { variants: ['launch'] },
  },
  {
    id: 'b-where-event-place', phase: 'build-up', at: -46 * H,
    title: 'Getting to {place}', format: 'Story', channels: ['Instagram Stories', 'WhatsApp channel', 'Email'],
    caption: 'Getting to {launch}: {place}, doors {time}. Tickets and travel: [link]',
    why: 'Useful posts earn trust. Guests who cannot find the venue or their tickets will not enjoy the day, however good the graphics are.',
    principle: 'service', when: { variants: ['event'], needs: ['place'] },
  },
  {
    id: 'b-where-event', phase: 'build-up', at: -46 * H,
    title: 'Everything you need', format: 'Story', channels: ['Instagram Stories', 'WhatsApp channel', 'Email'],
    caption: 'Everything you need for {launch}: times, tickets, travel. [link]',
    why: 'Useful posts earn trust. Guests who cannot find the venue or their tickets will not enjoy the day, however good the graphics are.',
    principle: 'service', when: { variants: ['event'], lacks: ['place'] },
  },
  {
    id: 'b-meet', phase: 'build-up', at: -24 * H,
    title: 'Meet {featured}', format: 'Reel', channels: ['Instagram', 'TikTok', 'LinkedIn'],
    caption: 'Meet {featured}, part of {launch}.',
    why: 'The day before, put a face to it. People follow people more than logos, and a featured person will often share the post themselves.',
    principle: 'people', when: { needs: ['featured'] },
  },
  {
    id: 'b-meet-team', phase: 'build-up', at: -24 * H,
    title: 'Meet the team', format: 'Reel', channels: ['Instagram', 'TikTok', 'LinkedIn'],
    caption: 'Meet the people behind {launch}.',
    why: 'The day before, put a face to it. People follow people more than logos. Add a featured person above to name them.',
    principle: 'people', when: { lacks: ['featured'] },
  },
  {
    id: 'b-question', phase: 'build-up', at: -20 * H,
    title: 'Ask your audience', format: 'Story', channels: ['Instagram Stories', 'LinkedIn'],
    caption: 'What do you want to know about {launch}? Ask us anything.',
    why: 'A question box turns followers into participants and tells you what to answer on the day. Reply to the best questions in public.',
    principle: 'native',
  },

  // ——— Launch or event day ———
  {
    id: 'b-today', phase: 'match-day', at: -3 * H,
    title: 'It’s today', format: 'Story', channels: ['Instagram Stories', 'X', 'LinkedIn'],
    caption: 'Today. {launch}, {time}.',
    why: 'The morning post is the alarm clock. Reuse the teaser’s look so people recognise it straight away.',
    principle: 'ladder',
  },
  {
    id: 'b-details-launch', phase: 'match-day', at: -60,
    title: 'The details', format: 'Poster', channels: ['Instagram', 'X', 'LinkedIn', 'Email'],
    caption: 'Here it is: {launch}. What it is, the price and where to get it. [link]',
    why: 'This is your team-news moment: the post people are waiting for. Build it in advance, check every detail twice, and post it on time.',
    principle: 'first-facts', when: { variants: ['launch'] },
  },
  {
    id: 'b-details-event', phase: 'match-day', at: -60,
    title: 'Running order', format: 'Poster', channels: ['Instagram', 'X', 'LinkedIn', 'Email'],
    caption: 'Running order for {launch}. Doors {time}. [timings]',
    why: 'This is your team-news moment: the post people are waiting for. Build it in advance, check every time twice, and post it as text too, for screen readers.',
    principle: 'first-facts', when: { variants: ['event'] },
  },
  {
    id: 'b-final-prep', phase: 'match-day', at: -15,
    title: 'Final preparations', format: 'Story', channels: ['Instagram Stories'],
    caption: 'Almost time.',
    why: 'A quick story keeps the feed calm before the big moment. Save the main post for when it goes live.',
    principle: 'native',
  },
  {
    id: 'b-live-launch', phase: 'match-day', at: 0,
    title: 'It’s live', format: 'Live post', channels: ['X', 'Instagram', 'LinkedIn', 'WhatsApp channel'],
    caption: '{launch} is live. [link]',
    why: 'Post on the minute you promised. A late launch post makes the countdown feel empty.',
    principle: 'live', when: { variants: ['launch'] },
  },
  {
    id: 'b-live-event', phase: 'match-day', at: 0,
    title: 'Doors open', format: 'Live post', channels: ['X', 'Instagram Stories', 'WhatsApp channel'],
    caption: 'Doors are open at {launch}. Follow along here.',
    why: 'People who could not come use your feed as their window on the day. Tell them where to follow, then post moments, not commentary.',
    principle: 'live', when: { variants: ['event'] },
  },
  {
    id: 'b-reactions', phase: 'match-day', at: 30, moment: 'As it happens',
    title: 'First reactions', format: 'Story', channels: ['Instagram Stories', 'TikTok'],
    caption: 'First reactions to {launch}. Tag us to be featured.',
    why: 'Real reactions are more convincing than your own claims. Ask before you repost anyone, and credit them by name.',
    principle: 'rights',
  },
  {
    id: 'b-moment', phase: 'match-day', at: 90, moment: 'As it happens',
    title: 'Best moment so far', format: 'Reel', channels: ['Instagram', 'TikTok', 'X'],
    caption: 'The best moment so far at {launch}.',
    why: 'Pick one moment, not ten. A single strong clip, subtitled for sound-off viewing, travels further than a gallery of everything.',
    principle: 'access',
  },
  {
    id: 'b-wrap-win', phase: 'match-day', at: 3 * H, moment: 'Close',
    title: 'Thank you: it went beyond our goal', format: 'Poster', channels: ['Instagram', 'LinkedIn', 'X'],
    caption: 'Thank you. {launch} went beyond what we hoped. [your checked numbers, if any]',
    why: 'Celebrate, but give credit to the people who made it happen. If you share numbers, share only ones you have checked and are happy to stand behind.',
    principle: 'mood', when: { outcomes: ['win'] },
  },
  {
    id: 'b-wrap-draw', phase: 'match-day', at: 3 * H, moment: 'Close',
    title: 'Thank you', format: 'Poster', channels: ['Instagram', 'LinkedIn', 'X'],
    caption: 'Thank you to everyone who was part of {launch}.',
    why: 'Meeting the goal is a good day. A warm, simple thank-you lands better than inflated claims.',
    principle: 'mood', when: { outcomes: ['draw'] },
  },
  {
    id: 'b-wrap-loss', phase: 'match-day', at: 3 * H, moment: 'Close',
    title: 'Thank you, and more to come', format: 'Poster', channels: ['Instagram', 'LinkedIn', 'X'],
    caption: 'Thank you to everyone who joined us for {launch}. More soon.',
    why: 'When it falls short, say less and say it warmly. Thank the people who came, and do not pretend it was bigger than it was.',
    principle: 'mood', when: { outcomes: ['loss'] },
  },

  // ——— After ———
  {
    id: 'b-recap', phase: 'after', at: 18 * H,
    title: 'Recap', format: 'Reel', channels: ['Instagram', 'TikTok', 'LinkedIn', 'YouTube'],
    caption: '{launch}, in under a minute.',
    why: 'The recap is what most people will see, so it is your highlights package. Make it short, subtitled and easy to share.',
    principle: 'after-life',
  },
  {
    id: 'b-ugc-win', phase: 'after', at: 24 * H,
    title: 'You made it', format: 'Carousel', channels: ['Instagram', 'LinkedIn'],
    caption: 'You made {launch}. Your best posts, shared with permission. Swipe →',
    why: 'After a strong day, hand the spotlight to your audience. Always ask before reposting, and credit each person.',
    principle: 'rights', when: { outcomes: ['win'] },
  },
  {
    id: 'b-faq-draw', phase: 'after', at: 24 * H,
    title: 'Your questions, answered', format: 'Carousel', channels: ['Instagram', 'LinkedIn'],
    caption: 'Your top questions about {launch}, answered. Swipe →',
    why: 'Answering real questions keeps the conversation going and removes the doubts that stop people buying or booking next time.',
    principle: 'service', when: { outcomes: ['draw'] },
  },
  {
    id: 'b-second-chance-loss', phase: 'after', at: 24 * H,
    title: 'Missed it?', format: 'Story', channels: ['Instagram Stories', 'Email', 'WhatsApp channel'],
    caption: 'Missed {launch}? Here’s where to catch up. [link]',
    why: 'A quiet day is not the end. A calm second chance reaches people who were busy, without sounding desperate.',
    principle: 'after-life', when: { outcomes: ['loss'] },
  },
  {
    id: 'b-reflection', phase: 'after', at: 48 * H,
    title: 'Reflection', format: 'Podcast clip', channels: ['LinkedIn', 'YouTube', 'Podcast feed'],
    caption: '“[best line]” Looking back on {launch}.',
    why: 'Like a manager’s post-match interview, an honest look back builds trust whatever the result, and gives you material for the next campaign.',
    principle: 'repurpose',
  },
  {
    id: 'b-next', phase: 'after', at: 72 * H,
    title: 'What’s next', format: 'Poster', channels: ['Instagram', 'LinkedIn', 'X'],
    caption: 'What’s next from {brand}: [date or tease].',
    why: 'Turn the page. A clear next step keeps the audience you have just built, and starts the ladder again.',
    principle: 'ladder',
  },
];
