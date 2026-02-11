
export const UI_CONFIG = {
  AXIS_HEIGHT: 60,
  MIN_YEAR: -3000,
  MAX_YEAR: 2100,
  CENTER_YEAR: 1,
  
  ZOOM_LEVELS: {
    OVERVIEW: 1,
    MID: 20,
    HIGH: 50,
    ULTRA: 100
  },

  LABEL_WIDTH_PX: 160,
  LABEL_HEIGHT_PX: 24,
  BAR_HEIGHT: 4,       // Slightly thicker line (increased from 2)
  BAR_SPACING: 8,      // Increased gap between lines (increased from 4)
  
  MAX_SCALE: 1000, 
  TRANSITION_DUR: 400
};

export const CATEGORIES = [
  { id: 'event', label: { en: 'Events', he: 'אירועים' }, color: '#10b981' }, 
  { id: 'person', label: { en: 'People', he: 'אישים' }, color: '#f43f5e' },
  { id: 'durations', label: { en: 'Show Durations', he: 'הצג תקופות' }, color: '#6366f1' },
];
