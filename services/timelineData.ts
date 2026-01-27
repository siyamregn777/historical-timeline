
import { TimelineItem, ItemType } from '../types';
import { CATEGORIES } from '../constants';

// Fixed missing MOCK_CATEGORIES export
export const MOCK_CATEGORIES = CATEGORIES;

const createEra = (id: string, start: number, end: number, en: string, he: string): TimelineItem => ({
  id,
  type: ItemType.ERA,
  category: 'political',
  startYear: start,
  endYear: end,
  title: { en, he },
  summary: { en: `The ${en} era.`, he: `תקופת ${he}.` },
  description: { en: '', he: '' },
  importance: 100,
  zoomLevelMin: 1,
  zoomLevelMax: 4
});

const createPeriod = (id: string, parentId: string, start: number, end: number, en: string, he: string): TimelineItem => ({
  id,
  parentId,
  type: ItemType.PERIOD,
  category: 'political',
  startYear: start,
  endYear: end,
  title: { en, he },
  summary: { en: `The ${en} period.`, he: `תקופת ${he}.` },
  description: { en: '', he: '' },
  importance: 80,
  zoomLevelMin: 4,
  zoomLevelMax: 12
});

const generateItems = (): TimelineItem[] => {
  const items: TimelineItem[] = [
    // --- MEGA ERAS (LOD 0) ---
    createEra('era-ancient', -3000, -539, 'Ancient Era', 'העת העתיקה'),
    createEra('era-classical', -539, 638, 'Classical Era', 'התקופה הקלאסית'),
    createEra('era-medieval', 638, 1517, 'Middle Ages', 'ימי הביניים'),
    createEra('era-modern', 1517, 2025, 'Modern Era', 'העת החדשה'),

    // --- PERIODS (LOD 1) ---
    createPeriod('per-patriarchs', 'era-ancient', -2100, -1800, 'Patriarchs', 'האבות'),
    createPeriod('per-egypt', 'era-ancient', -1550, -1200, 'Egyptian Sojourn', 'ירידה למצרים'),
    createPeriod('per-kings', 'era-ancient', -1000, -586, 'Monarchy', 'תקופת המלכים'),
    createPeriod('per-exile', 'era-classical', -586, -538, 'Babylonian Exile', 'גלות בבל'),
    createPeriod('per-hasmonean', 'era-classical', -167, -63, 'Hasmonean Dynasty', 'בית חשמונאי'),
    createPeriod('per-romans', 'era-classical', 63, 324, 'Roman Rule', 'שלטון רומא'),
    createPeriod('per-crusaders', 'era-medieval', 1099, 1291, 'Crusader Period', 'התקופה הצלבנית'),
    createPeriod('per-zionism', 'era-modern', 1881, 1948, 'Rise of Zionism', 'עליית הציונות'),
    createPeriod('per-israel', 'era-modern', 1948, 2025, 'State of Israel', 'מדינת ישראל')
  ];

  // --- DENSE EVENTS (LOD 2+) ---
  // Seed hundreds of events inside the periods
  const events = [
    { y: -1313, en: 'Exodus', he: 'יציאת מצרים' },
    { y: -957, en: 'Solomon\'s Temple', he: 'מקדש שלמה' },
    { y: -164, en: 'Hanukkah', he: 'חנוכה' },
    { y: 70, en: 'Destruction of Second Temple', he: 'חורבן בית שני' },
    { y: 135, en: 'Bar Kokhba Revolt', he: 'מרד בר כוכבא' },
    { y: 1135, en: 'Birth of Maimonides', he: 'הולדת הרמב"ם' },
    { y: 1492, en: 'Spanish Expulsion', he: 'גירוש ספרד' },
    { y: 1897, en: 'First Zionist Congress', he: 'הקונגרס הציוני הראשון' },
    { y: 1967, en: 'Six-Day War', he: 'מלחמת ששת הימים' }
  ];

  events.forEach((ev, i) => {
    items.push({
      id: `ev-${i}`,
      type: ItemType.EVENT,
      category: 'cultural',
      startYear: ev.y,
      title: { en: ev.en, he: ev.he },
      summary: { en: 'Key historical event.', he: 'אירוע היסטורי מרכזי.' },
      description: { en: '', he: '' },
      importance: 60,
      zoomLevelMin: 10,
      zoomLevelMax: 100
    });
  });

  // Micro details for deep zoom
  for (let i = 0; i < 400; i++) {
    const year = -3000 + Math.random() * 5000;
    items.push({
      id: `detail-${i}`,
      type: ItemType.PERSON,
      category: 'religious',
      startYear: Math.floor(year),
      title: { en: `Local Figure ${i}`, he: `דמות מקומית ${i}` },
      summary: { en: 'Minor historical record.', he: 'רישום היסטורי משני.' },
      description: { en: '', he: '' },
      importance: 20,
      zoomLevelMin: 30,
      zoomLevelMax: 100
    });
  }

  return items;
};

export const MOCK_DATA = generateItems();
