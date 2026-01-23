
import { Language } from '../types';

const en = {
  "common": {
    "welcome": "Welcome",
    "logout": "Logout",
    "loading": "Syncing History...",
    "back": "Back to Timeline",
    "learnMore": "Read Full Text",
    "return": "Return to Exploration",
    "reference": "Reference"
  },
  "nav": {
    "title": "Chronos: Jewish History",
    "subtitle": "From Genesis to the Modern Era",
    "categories": "Categories",
    "legend": "Legend"
  },
  "controls": {
    "zoomIn": "Zoom In",
    "zoomOut": "Zoom Out",
    "reset": "Reset View"
  },
  "timeline": {
    "bce": " BCE",
    "ce": "",
    "event": "Event",
    "person": "Person",
    "period": "Period"
  },
  "auth": {
    "tagline": "Explore the legacy of the Jewish people.",
    "fullName": "Full Name",
    "email": "Email Address",
    "password": "Password",
    "signIn": "Sign In",
    "signUp": "Create Account",
    "noAccount": "New user? Join now",
    "hasAccount": "Already a member? Sign In",
    "error": "Authentication failed.",
    "placeholderName": "Abraham Cohen",
    "placeholderEmail": "abraham@example.com"
  }
};

const he = {
  "common": {
    "welcome": "שלום",
    "logout": "התנתק",
    "loading": "טוען נתונים...",
    "back": "חזרה לציר הזמן",
    "learnMore": "לקריאה נוספת",
    "return": "חזרה לחקירה",
    "reference": "מזהה"
  },
  "nav": {
    "title": "כרונוס: תולדות ישראל",
    "subtitle": "מבראשית ועד ימינו",
    "categories": "קטגוריות",
    "legend": "מקרא"
  },
  "controls": {
    "zoomIn": "הגדל",
    "zoomOut": "הקטן",
    "reset": "איפוס"
  },
  "timeline": {
    "bce": " לפנה״ס",
    "ce": "",
    "event": "אירוע",
    "person": "דמות",
    "period": "תקופה"
  },
  "auth": {
    "tagline": "חקרו את המורשת של עם ישראל לאורך הדורות.",
    "fullName": "שם מלא",
    "email": "כתובת אימייל",
    "password": "סיסמה",
    "signIn": "התחברות",
    "signUp": "הרשמה",
    "noAccount": "משתמש חדש? הצטרף",
    "hasAccount": "כבר רשום? התחברות",
    "error": "ההתחברות נכשלה.",
    "placeholderName": "אברהם כהן",
    "placeholderEmail": "abraham@example.com"
  }
};

const translations: Record<Language, any> = { en, he };

/**
 * A standard utility function for translations. 
 * Renamed from 'useTranslation' to 'getI18n' to avoid React Hook Rule violations 
 * when called from utility functions or D3 callbacks.
 */
export const getI18n = (lang: Language) => {
  const t = (key: string): string => {
    const keys = key.split('.');
    let result = translations[lang];
    
    for (const k of keys) {
      if (result && result[k]) {
        result = result[k];
      } else {
        return key;
      }
    }
    
    return typeof result === 'string' ? result : key;
  };

  return { t };
};
