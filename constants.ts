
import { Category } from './types';

export const CATEGORIES: Category[] = [
  { id: 'tanach', label: { en: 'Biblical / Tanach', he: 'תנ״ך' }, color: '#6366f1' },
  { id: 'temple', label: { en: 'Temple Eras', he: 'תקופות המקדש' }, color: '#f43f5e' },
  { id: 'diaspora', label: { en: 'Diaspora & Sages', he: 'גלות וחכמים' }, color: '#10b981' },
  { id: 'modern', label: { en: 'Modern Israel', he: 'ישראל המודרנית' }, color: '#f59e0b' },
];

export const UI_CONFIG = {
  TRACK_HEIGHT: 50,
  TRACK_PADDING: 12,
  TIMELINE_HEIGHT: 450,
  AXIS_HEIGHT: 60,
  MIN_YEAR: -2500,
  MAX_YEAR: 2100,
  INITIAL_ZOOM: 1,
};

export const TRANSLATIONS = {
  en: {
    title: "Chronos: Jewish History",
    subtitle: "From Genesis to the Modern Era",
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
    learnMore: "Read Full Text",
    details: "Details",
    auth: {
      tagline: "Explore the legacy of the Jewish people.",
      fullName: "Full Name",
      email: "Email Address",
      password: "Password",
      signIn: "Sign In",
      signUp: "Create Account",
      noAccount: "New user? Join now",
      hasAccount: "Already a member? Sign In",
      error: "Authentication failed.",
      placeholderName: "Abraham Cohen",
      placeholderEmail: "abraham@example.com"
    }
  },
  he: {
    title: "כרונוס: תולדות ישראל",
    subtitle: "מבראשית ועד ימינו",
    zoomIn: "הגדל",
    zoomOut: "הקטן",
    reset: "איפוס",
    categories: "קטגוריות",
    legend: "מקרא",
    searchPlaceholder: "חיפוש...",
    event: "אירוע",
    person: "דמות",
    period: "תקופה",
    bce: "לפנה״ס",
    ce: "לספירה",
    welcome: "שלום",
    logout: "התנתק",
    syncing: "טוען נתונים...",
    learnMore: "לקריאה נוספת",
    details: "פרטים",
    auth: {
      tagline: "חקרו את המורשת של עם ישראל לאורך הדורות.",
      fullName: "שם מלא",
      email: "כתובת אימייל",
      password: "סיסמה",
      signIn: "התחברות",
      signUp: "הרשמה",
      noAccount: "משתמש חדש? הצטרף",
      hasAccount: "כבר רשום? התחברות",
      error: "ההתחברות נכשלה.",
      placeholderName: "אברהם כהן",
      placeholderEmail: "abraham@example.com"
    }
  }
};
