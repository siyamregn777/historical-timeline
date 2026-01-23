
import { Category } from './types';

export const CATEGORIES: Category[] = [
  { id: 'events', label: { en: 'Events', he: 'אירועים' }, color: '#6366f1' },
  { id: 'people', label: { en: 'People', he: 'אישים' }, color: '#10b981' },
  { id: 'durations', label: { en: 'Durations', he: 'תקופות' }, color: '#f43f5e' },
];

export const UI_CONFIG = {
  TRACK_HEIGHT: 60,
  TRACK_PADDING: 12,
  TIMELINE_HEIGHT: 450,
  AXIS_HEIGHT: 60,
  MIN_YEAR: -4000,
  MAX_YEAR: 2030,
  INITIAL_ZOOM: 0.05,
};
