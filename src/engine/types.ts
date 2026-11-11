// Shapes shared by the plan engine and the content library.
// Content lives in src/content; the logic that assembles it lives here.

export type Mode = 'football' | 'brand';
export type Outcome = 'win' | 'draw' | 'loss';
export type PhaseId = 'build-up' | 'match-day' | 'after';
export type Format = 'Reel' | 'Carousel' | 'Story' | 'Poster' | 'Podcast clip' | 'Live post';

export type FootballStoryline = 'derby' | 'cup' | 'signing' | 'title' | 'relegation' | 'milestone' | 'ordinary';
export type BrandStoryline = 'new-product' | 'limited-drop' | 'collaboration' | 'live-event' | 'anniversary' | 'ordinary';

export type PrincipleId =
  | 'one-story'
  | 'ladder'
  | 'people'
  | 'native'
  | 'first-facts'
  | 'live'
  | 'mood'
  | 'repurpose'
  | 'service'
  | 'rights'
  | 'rivalry'
  | 'after-life'
  | 'access';

export interface FootballInput {
  mode: 'football';
  club: string;
  venue: 'home' | 'away';
  opponent: string;
  competition: string;
  ground?: string;
  /** Local kick-off as typed: YYYY-MM-DDTHH:mm */
  kickoff: string;
  storyline: FootballStoryline;
  signing?: string;
  captain?: string;
  milestonePlayer?: string;
  milestone?: string;
  /** Optional, for the after-match phase. Goals are from your club's side. */
  result?: { scored: number; conceded: number; scorers?: string };
}

export interface BrandInput {
  mode: 'brand';
  brand: string;
  launch: string;
  kind: 'launch' | 'event';
  place?: string;
  /** Local start as typed: YYYY-MM-DDTHH:mm */
  start: string;
  storyline: BrandStoryline;
  spokesperson?: string;
  partner?: string;
  featured?: string;
  milestone?: string;
  /** Optional, for the after phase: how it went against your own goal. */
  outcome?: Outcome;
}

export type PlanInput = FootballInput | BrandInput;

/** One reusable plan item. Captions use {tokens} filled from the input. */
export interface Template {
  id: string;
  phase: PhaseId;
  /** Minutes relative to kick-off (or launch / doors open). Negative is before. */
  at: number;
  /** Replaces the computed time label, e.g. "When a goal goes in". */
  moment?: string;
  title: string;
  format: Format;
  channels: string[];
  caption: string;
  why: string;
  principle: PrincipleId;
  when?: {
    storylines?: string[];
    outcomes?: Outcome[];
    /** home / away in football, launch / event in brand mode. */
    variants?: string[];
    /** Tokens that must be filled for this item to appear. */
    needs?: string[];
    /** Tokens that must be empty for this item to appear (the generic version). */
    lacks?: string[];
  };
}

export interface PlanItem {
  id: string;
  phase: PhaseId;
  at: number;
  timeLabel: string;
  dateLabel: string;
  title: string;
  format: Format;
  channels: string[];
  caption: string;
  why: string;
  principle: PrincipleId;
  /** Set on items written for particular results. */
  outcomes?: Outcome[];
}

export interface PlanPhase {
  id: PhaseId;
  title: string;
  intro: string;
  items: PlanItem[];
}

export interface Plan {
  mode: Mode;
  title: string;
  subtitle: string;
  /** Set when the user entered a result; otherwise the after phase covers all three. */
  outcome?: Outcome;
  phases: PlanPhase[];
}
