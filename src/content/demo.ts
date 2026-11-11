// The showcase fixture. Every value is taken from Thomas's sourced football
// editorial (portfolio: src/content/football.ts and football/SOURCES.md),
// which traces to the Premier League match centre, match 855444.
// Player fields are left empty: no captain or signing is sourced.

import type { BrandInput, FootballInput } from '../engine/types';

export const demoFixture: FootballInput = {
  mode: 'football',
  club: 'Burnley',
  venue: 'home',
  opponent: 'Liverpool',
  competition: 'Premier League',
  ground: 'Turf Moor',
  kickoff: '2016-08-20T15:00',
  storyline: 'ordinary',
  result: { scored: 2, conceded: 0, scorers: 'Vokes 2′, Gray 37′' },
};

export const demoSource = {
  text: 'Demo: Burnley 2–0 Liverpool, Premier League, 20 August 2016, Turf Moor. Result, date, kick-off, venue and scorers from the Premier League match centre.',
  href: 'https://www.premierleague.com/en/match/855444',
};

export const blankFixture: FootballInput = {
  mode: 'football',
  club: '',
  venue: 'home',
  opponent: '',
  competition: '',
  ground: '',
  kickoff: '',
  storyline: 'ordinary',
};

/** An empty brand form; example names appear only as placeholders. */
export const blankBrand: BrandInput = {
  mode: 'brand',
  brand: '',
  launch: '',
  kind: 'launch',
  place: '',
  start: '',
  storyline: 'new-product',
};
