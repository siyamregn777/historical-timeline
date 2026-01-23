
import { TimelineItem, ItemType } from '../types';

export const MOCK_DATA: TimelineItem[] = [
  {
    id: 'p-patriarchs',
    type: ItemType.PERIOD,
    category: 'tanach',
    startYear: -2100,
    endYear: -1800,
    title: { en: 'Age of the Patriarchs', he: 'תקופת האבות' },
    summary: { 
      en: 'The foundational era of Abraham, Isaac, and Jacob, defining the origins of the Jewish people.', 
      he: 'תקופת היסוד של אברהם, יצחק ויעקב, המגדירה את מקורותיו של עם ישראל.' 
    },
    description: { 
      en: 'The Age of the Patriarchs marks the dawn of Jewish history. It begins with Abraham\'s journey to Canaan and the establishment of a monotheistic covenant.', 
      he: 'תקופת האבות מסמלת את ראשית ההיסטוריה היהודית. היא מתחילה במסעו של אברהם לכנען ובכינון הברית המונותאיסטית.' 
    }
  },
  {
    id: 'e-exodus',
    type: ItemType.EVENT,
    category: 'tanach',
    startYear: -1313,
    title: { en: 'The Exodus', he: 'יציאת מצרים' },
    summary: { 
      en: 'The liberation of the Israelites from Egyptian bondage and the receiving of the Torah.', 
      he: 'שחרור בני ישראל מעבדות מצרים וקבלת התורה.' 
    },
    description: { 
      en: 'A pivotal event where the Hebrew slaves left Egypt under Moses\' leadership, leading to the revelation at Mount Sinai.', 
      he: 'אירוע מכונן בו העבדים העבריים עזבו את מצרים תחת הנהגת משה, מה שהוביל למעמד הר סיני.' 
    }
  },
  {
    id: 'p-first-temple',
    type: ItemType.PERIOD,
    category: 'temple',
    startYear: -957,
    endYear: -586,
    title: { en: 'First Temple Period', he: 'תקופת בית ראשון' },
    summary: { 
      en: 'The era of the United and Divided Monarchies centered around Solomon\'s Temple in Jerusalem.', 
      he: 'תקופת הממלכה המאוחדת והמפוצלת סביב בית המקדש של שלמה בירושלים.' 
    },
    description: { 
      en: 'A time of spiritual and political peak, starting with the completion of the Temple and ending with the Babylonian conquest.', 
      he: 'זמן של שיא רוחני ופוליטי, המתחיל עם השלמת המקדש ומסתיים בכיבוש הבבלי.' 
    }
  },
  {
    id: 'e-state',
    type: ItemType.EVENT,
    category: 'modern',
    startYear: 1948,
    title: { en: 'State of Israel Established', he: 'הקמת מדינת ישראל' },
    summary: { 
      en: 'The restoration of Jewish sovereignty in the ancestral homeland after 2,000 years.', 
      he: 'חידוש הריבונות היהודית במולדת אבותיו לאחר 2,000 שנה.' 
    },
    description: { 
      en: 'On May 14, 1948, David Ben-Gurion proclaimed the establishment of the State of Israel, fulfilling the Zionist dream.', 
      he: 'ב-14 במאי 1948, דוד בן-גוריון הכריז על הקמת מדינת ישראל, תוך הגשמת החלום הציוני.' 
    }
  }
];

export const fetchTimelineData = async (): Promise<TimelineItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_DATA), 500);
  });
};
