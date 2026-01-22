
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
    welcome: "Welcome",
    logout: "Logout",
    syncing: "Syncing History...",
    learnMore: "Learn More",
    auth: {
      tagline: "Explore human history across time.",
      fullName: "Full Name",
      email: "Email Address",
      password: "Password",
      signIn: "Sign In",
      signUp: "Create Account",
      noAccount: "Don't have an account? Sign Up",
      hasAccount: "Already have an account? Sign In",
      error: "Authentication failed. Please check your credentials.",
      placeholderName: "John Doe",
      placeholderEmail: "you@example.com"
    }
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
    welcome: "ברוכים הבאים",
    logout: "התנתק",
    syncing: "מסנכרן היסטוריה...",
    learnMore: "למידע נוסף",
    auth: {
      tagline: "חקרו את ההיסטוריה האנושית לאורך הזמן.",
      fullName: "שם מלא",
      email: "כתובת אימייל",
      password: "סיסמה",
      signIn: "התחברות",
      signUp: "יצירת חשבון",
      noAccount: "אין לך חשבון? הרשמה",
      hasAccount: "כבר יש לך חשבון? התחברות",
      error: "ההתחברות נכשלה. אנא בדוק את הפרטים שלך.",
      placeholderName: "ישראל ישראלי",
      placeholderEmail: "israel@example.com"
    }
  }
};
