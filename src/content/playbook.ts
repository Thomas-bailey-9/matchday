// The principles behind every "Why this works" note.
// Written as general reasoning, with no statistics: nothing here needs a source
// beyond the experience of running a channel.

import type { PrincipleId } from '../engine/types';

export interface Principle {
  id: PrincipleId;
  title: string;
  summary: string;
  football: string;
  brand: string;
}

export const principles: Principle[] = [
  {
    id: 'one-story', title: 'One story a week',
    summary: 'Pick the one thing this week is about, and let every post serve it.',
    football: 'Derby, cup tie, new signing: fans remember a week by its story, not by its post count.',
    brand: 'A launch with one clear message beats a launch that says ten things at once.',
  },
  {
    id: 'ladder', title: 'Build anticipation in steps',
    summary: 'Each post raises the stakes a little: date, story, people, details, go.',
    football: 'Fixture poster, press conference, captain, matchday, team news, kick-off.',
    brand: 'Teaser, story, interview, today, details, live.',
  },
  {
    id: 'people', title: 'People before graphics',
    summary: 'Audiences follow people. Put names and faces at the centre.',
    football: 'Players, the manager and fans carry more feeling than any badge or template.',
    brand: 'Founders, makers, guests and customers make a brand feel real.',
  },
  {
    id: 'native', title: 'Made for the channel',
    summary: 'Each platform has its own habits. Make the post fit where it is seen.',
    football: 'Vertical video for stories and reels, carousels for saving, short text for live feeds.',
    brand: 'The same idea, cut to fit each place, not one asset pasted everywhere.',
  },
  {
    id: 'first-facts', title: 'Be first with the facts',
    summary: 'The most wanted post must be fast and right. Prepare it so only the details change.',
    football: 'Team news: built in advance, checked, posted the moment it is public.',
    brand: 'Price, time and link: checked twice before they go out.',
  },
  {
    id: 'live', title: 'Live: moments, not commentary',
    summary: 'During the action, post less and post accurately. Confirm before you celebrate.',
    football: 'Goals, half-time and full time, from ready templates, once the facts are certain.',
    brand: 'Go-live on the minute, then the real moments as they happen.',
  },
  {
    id: 'mood', title: 'Match the mood',
    summary: 'The result sets the tone. Celebrate a win, steady a draw, respect a defeat.',
    football: 'After a loss: say less, no spin, no jokes. Prepare a version for every result before kick-off.',
    brand: 'Beat the goal, meet it or miss it: each has its own honest message.',
  },
  {
    id: 'repurpose', title: 'One recording, many cuts',
    summary: 'Long conversations become a week of short clips.',
    football: 'One press conference gives you clips for X, reels, YouTube and the podcast.',
    brand: 'One interview gives you LinkedIn, Instagram and newsletter material.',
  },
  {
    id: 'service', title: 'Useful is content too',
    summary: 'Practical information earns trust, even when it is not exciting.',
    football: 'Tickets, travel and gate times decide whether fans enjoy the day.',
    brand: 'Where to buy, how to get there and what it costs.',
  },
  {
    id: 'rights', title: 'Use only what you are cleared to use',
    summary: 'Footage, photos, music, crests and other people’s posts all have owners.',
    football: 'Competitions and broadcasters control match footage. Check the rules before posting clips.',
    brand: 'Ask before reposting anyone, and credit them by name.',
  },
  {
    id: 'rivalry', title: 'Rivalry without hostility',
    summary: 'Banter is part of the game. Abuse is not.',
    football: 'Celebrate your fans, not the rival’s misery. Moderate comments closely on derby week.',
    brand: 'Compete on what you offer, never by mocking a competitor.',
  },
  {
    id: 'after-life', title: 'It doesn’t end at the whistle',
    summary: 'The hours and days after are when most people catch up.',
    football: 'Reaction, highlights, photos, then the next fixture.',
    brand: 'Recap, thanks, answers, then what’s next.',
  },
  {
    id: 'access', title: 'Made for everyone',
    summary: 'Design for sound off, small screens and screen readers.',
    football: 'Subtitles on every clip, alt text on every graphic, line-ups as text.',
    brand: 'The same: subtitles, alt text and readable contrast.',
  },
];

export const principleById = Object.fromEntries(principles.map((p) => [p.id, p])) as Record<PrincipleId, Principle>;
