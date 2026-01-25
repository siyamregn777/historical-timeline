
import { Category } from './types';

export const CATEGORIES: Category[] = [
  { id: 'events', label: { en: 'Events', he: 'אירועים' }, color: '#6366f1' },
  { id: 'people', label: { en: 'People', he: 'אישים' }, color: '#10b981' },
  { id: 'durations', label: { en: 'Durations', he: 'תקופות' }, color: '#f43f5e' },
];

export const UI_CONFIG = {
  TIMELINE_HEIGHT: 450,
  AXIS_HEIGHT: 60,
  MIN_YEAR: -4000,
  MAX_YEAR: 3000,
  INITIAL_ZOOM: 1,
  MAX_SCALE: 100,
  
  // GEOGRAPHIC TIERS (User Requested Limits)
  TIERS: [
    { max: 4, count: 5, type: 'cluster' },
    { max: 15, count: 30, type: 'anchor' },
    { max: 35, count: 60, type: 'individual' },
    { max: 60, count: 100, type: 'individual' },
    { max: 85, count: 150, type: 'individual' },
    { max: 100, count: 200, type: 'individual' }
  ],
  
  // PHYSICAL DIMENSIONS (Strict Collision Control)
  MARKER_SIZE: 32, 
  MARKER_PADDING: 20,
  // Increased lanes to fill the whole height
  VERTICAL_LANES: 20, 
};
