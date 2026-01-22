
import { Category, ItemType } from './types';

export const CATEGORIES: Category[] = [
  { id: 'religion', label: { en: 'Religion & Faith', he: 'דת ואמונה' }, color: '#6366f1' },
  { id: 'politics', label: { en: 'Politics & Empire', he: 'פוליטיקה ואימפריה' }, color: '#f43f5e' },
  { id: 'culture', label: { en: 'Culture & Science', he: 'תרבות ומדע' }, color: '#10b981' },
  { id: 'war', label: { en: 'Conflict & War', he: 'מלחמה וסכסוך' }, color: '#f59e0b' },
];

export const UI_CONFIG = {
  TRACK_HEIGHT: 40,
  TRACK_PADDING: 10,
  TIMELINE_HEIGHT: 500,
  AXIS_HEIGHT: 60,
  MIN_YEAR: -2000,
  MAX_YEAR: 2100,
  INITIAL_ZOOM: 1,
};

export const TRANSLATIONS = {
  en: {
    title: "Chronos Timeline",
    subtitle: "A Journey Through History",
    zoomIn: "Zoom In",
    zoomOut: "Zoom Out",
    reset: "Reset View",
    categories: "Categories",
    legend: "Legend",
    searchPlaceholder: "Search events, people...",
    event: "Event",
    person: "Person",
    period: "Period",
    bce: "BCE",
    ce: "CE",
  },
  he: {
    title: "ציר זמן כרונוס",
    subtitle: "מסע דרך ההיסטוריה",
    zoomIn: "הגדל",
    zoomOut: "הקטן",
    reset: "איפוס תצוגה",
    categories: "קטגוריות",
    legend: "מקרא",
    searchPlaceholder: "חיפוש אירועים, אישים...",
    event: "אירוע",
    person: "אישיות",
    period: "תקופה",
    bce: "לפנה״ס",
    ce: "לספירה",
  }
};
