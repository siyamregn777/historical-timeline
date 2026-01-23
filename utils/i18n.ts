
import { Language } from '../types';

const en = {
  "common": {
    "welcome": "Welcome",
    "logout": "Logout",
    "loading": "Syncing History...",
    "back": "Back to Timeline",
    "learnMore": "Read Full Text",
    "return": "Return to Exploration",
    "reference": "Reference",
    "save": "Save Changes",
    "cancel": "Cancel",
    "edit": "Edit",
    "delete": "Delete"
  },
  "nav": {
    "title": "Chronos",
    "subtitle": "Jewish History",
    "categories": "Categories",
    "legend": "Legend",
    "hello": "Hello",
    "admin": "Admin"
  },
  "admin": {
    "dashboardTitle": "Admin Dashboard",
    "portalTag": "Curator Portal",
    "tagline": "Manage the historical tapestry of the Jewish people.",
    "newMilestone": "New Milestone",
    "editMilestone": "Edit Milestone",
    "historyLibrary": "History Library",
    "backToTimeline": "Back to Timeline",
    "syncing": "Live Draft Syncing",
    "discard": "Discard Changes",
    "backToEditor": "Back to Editor",
    "userSimulation": "User View Simulation",
    "fieldRequired": "This field is required",
    "fetching": "Fetching Library...",
    "noMilestones": "No historical milestones found.",
    "publish": "Publish Milestone",
    "update": "Update Milestone",
    "successPublish": "Milestone published successfully!",
    "successUpdate": "Milestone updated successfully!",
    "confirmDelete": "Are you sure you want to delete this historical milestone? This action cannot be undone.",
    "errorSave": "Error saving item.",
    "errorDelete": "Failed to delete item.",
    "sections": {
      "metadata": "Timeline Metadata",
      "content": "Historical Content",
      "englishContent": "English Content",
      "hebrewContent": "Hebrew Content"
    },
    "fields": {
      "type": "Item Type",
      "category": "Category",
      "importance": "Importance (1-5)",
      "startYear": "Start Year",
      "endYear": "End Year",
      "optional": "Optional",
      "titleEn": "Title (English)",
      "titleHe": "Title (Hebrew)",
      "summaryEn": "Summary / Description (English)",
      "summaryHe": "Summary / Description (Hebrew)",
      "bodyEn": "Detailed Narrative / Body (English)",
      "bodyHe": "Detailed Narrative / Body (Hebrew)"
    },
    "simulation": {
      "raw": "Raw Metadata",
      "interactive": "Interactive Simulation",
      "popupTitle": "Simulation: Timeline Popup",
      "learnMoreTitle": "Simulation: Learn More Page",
      "context": "Timeline Context Simulation",
      "untitled": "Untitled Milestone",
      "noSummary": "No summary provided...",
      "noContent": "No detailed narrative provided...",
      "ref": "REF: SIMULATION"
    }
  },
  "profile": {
    "title": "My Profile",
    "editPhoto": "Change Photo",
    "fullName": "Full Name",
    "email": "Email Address",
    "password": "New Password",
    "passwordHint": "Leave blank to keep current",
    "success": "Profile updated successfully!",
    "role": "Account Type"
  },
  "controls": {
    "zoomIn": "Zoom In",
    "zoomOut": "Zoom Out",
    "reset": "Reset View"
  },
  "timeline": {
    "bc": " BC",
    "ad": " AD",
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
    "demoMode": "Enter Simulation Mode",
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
    "reference": "מזהה",
    "save": "שמור שינויים",
    "cancel": "ביטול",
    "edit": "ערוך",
    "delete": "מחק"
  },
  "nav": {
    "title": "כרונוס",
    "subtitle": "תולדות ישראל",
    "categories": "קטגוריות",
    "legend": "מקרא",
    "hello": "שלום",
    "admin": "ניהול"
  },
  "admin": {
    "dashboardTitle": "דשבורד ניהול",
    "portalTag": "פורטל אוצרות",
    "tagline": "נהלו את המארג ההיסטורי של עם ישראל.",
    "newMilestone": "אבן דרך חדשה",
    "editMilestone": "עריכת אבן דרך",
    "historyLibrary": "ספריית היסטוריה",
    "backToTimeline": "חזרה לציר הזמן",
    "syncing": "סנכרון טיוטה חי",
    "discard": "בטל שינויים",
    "backToEditor": "חזרה לעורך",
    "userSimulation": "סימולציית משתמש",
    "fieldRequired": "שדה זה הינו חובה",
    "fetching": "טוען ספרייה...",
    "noMilestones": "לא נמצאו אבני דרך היסטוריות.",
    "publish": "פרסם לציר הזמן",
    "update": "עדכן אבן דרך",
    "successPublish": "אבן הדרך פורסמה בהצלחה!",
    "successUpdate": "אבן הדרך עודכנה בהצלחה!",
    "confirmDelete": "האם אתה בטוח שברצונך למחוק אבן דרך זו? פעולה זו אינה ניתנת לביטול.",
    "errorSave": "שגיאה בשמירת הפריט.",
    "errorDelete": "המחיקה נכשלה.",
    "sections": {
      "metadata": "מטא-דאטה של ציר הזמן",
      "content": "תוכן היסטורי",
      "englishContent": "תוכן באנגלית",
      "hebrewContent": "תוכן בעברית"
    },
    "fields": {
      "type": "סוג פריט",
      "category": "קטגוריה",
      "importance": "חשיבות (1-5)",
      "startYear": "שנת התחלה",
      "endYear": "שנת סיום",
      "optional": "אופציונלי",
      "titleEn": "כותרת (אנגלית)",
      "titleHe": "כותרת (עברית)",
      "summaryEn": "תקציר / תיאור (אנגלית)",
      "summaryHe": "תקציר / תיאור (עברית)",
      "bodyEn": "גוף התוכן / פירוט (אנגלית)",
      "bodyHe": "גוף התוכן / פירוט (עברית)"
    },
    "simulation": {
      "raw": "מטא-דאטה גולמי",
      "interactive": "סימולציה אינטראקטיבית",
      "popupTitle": "סימולציה: חלונית ציר זמן",
      "learnMoreTitle": "סימולציה: דף קריאה נוספת",
      "context": "סימולציית הקשר של ציר זמן",
      "untitled": "אבן דרך ללא כותרת",
      "noSummary": "לא הוזן תקציר...",
      "noContent": "לא הוזן תיאור מפורט...",
      "ref": "מזהה סימולציה"
    }
  },
  "profile": {
    "title": "הפרופיל שלי",
    "editPhoto": "החלף תמונה",
    "fullName": "שם מלא",
    "email": "אימייל",
    "password": "סיסמה חדשה",
    "passwordHint": "השאר ריק כדי לשמור על הקיימת",
    "success": "הפרופיל עודכן בהצלחה!",
    "role": "סוג חשבון"
  },
  "controls": {
    "zoomIn": "הגדל",
    "zoomOut": "הקטן",
    "reset": "איפוס"
  },
  "timeline": {
    "bc": " BC",
    "ad": " AD",
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
    "demoMode": "כניסה למצב סימולציה",
    "error": "ההתחברות נכשלה.",
    "placeholderName": "אברהם כהן",
    "placeholderEmail": "abraham@example.com"
  }
};

const translations: Record<Language, any> = { en, he };

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
