
export const UI_CONFIG = {
  AXIS_HEIGHT: 50,
  MIN_YEAR: -3500,
  MAX_YEAR: 2100,
  CENTER_YEAR: 1,
  
  // Semantic Zoom Scales
  ZOOM_LEVELS: {
    ERAS: 1,
    PERIODS: 3,
    MAJOR_EVENTS: 8,
    DETAILS: 20,
    MICRO: 45
  },

  // Collision Logic
  LABEL_WIDTH_PX: 160,
  LABEL_HEIGHT_PX: 24,
  COLLISION_PADDING: 15,
  
  MAX_SCALE: 100,
  TRANSITION_DUR: 300
};

export const CATEGORIES = [
  { id: 'political', label: { en: 'Political', he: 'מדיני' }, color: '#78716c' },
  { id: 'cultural', label: { en: 'Cultural', he: 'תרבותי' }, color: '#0891b2' },
  { id: 'religious', label: { en: 'Religious', he: 'דתי' }, color: '#8b5cf6' },
];
