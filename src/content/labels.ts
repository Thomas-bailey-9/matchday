import type { BrandStoryline, FootballStoryline } from '../engine/types';

export const footballStorylines: { id: FootballStoryline; label: string }[] = [
  { id: 'ordinary', label: 'Ordinary week' },
  { id: 'derby', label: 'Derby' },
  { id: 'cup', label: 'Cup tie' },
  { id: 'signing', label: 'New signing' },
  { id: 'title', label: 'Title race' },
  { id: 'relegation', label: 'Relegation fight' },
  { id: 'milestone', label: 'Player milestone' },
];

export const brandStorylines: { id: BrandStoryline; label: string }[] = [
  { id: 'new-product', label: 'New product' },
  { id: 'limited-drop', label: 'Limited drop' },
  { id: 'collaboration', label: 'Collaboration' },
  { id: 'live-event', label: 'Live event' },
  { id: 'anniversary', label: 'Anniversary' },
  { id: 'ordinary', label: 'Regular release' },
];
