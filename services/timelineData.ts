
import { TimelineItem, ItemType } from '../types';
import { CATEGORIES } from '../constants';

// Fixed missing MOCK_CATEGORIES export
export const MOCK_CATEGORIES = CATEGORIES;

const createEra = (id: string, start: number, end: number, en: string, he: string, img: string): TimelineItem => ({
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
  zoomLevelMax: 4,
  imageUrl: img
});

const createPeriod = (id: string, parentId: string, start: number, end: number, en: string, he: string, img: string): TimelineItem => ({
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
  zoomLevelMax: 12,
  imageUrl: img
});

const generateItems = (): TimelineItem[] => {
  const items: TimelineItem[] = [
    // --- MEGA ERAS (LOD 0) ---
    createEra('era-ancient', -3000, -539, 'Ancient Era', 'העת העתיקה', 'https://images.unsplash.com/photo-1546412414-8035e1776c9a?w=100&h=100&fit=crop'),
    createEra('era-classical', -539, 638, 'Classical Era', 'התקופה הקלאסית', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=100&h=100&fit=crop'),
    createEra('era-medieval', 638, 1517, 'Middle Ages', 'ימי הביניים', 'https://images.unsplash.com/photo-1584043720379-b56cd9199c94?w=100&h=100&fit=crop'),
    createEra('era-modern', 1517, 2025, 'Modern Era', 'העת החדשה', 'https://images.unsplash.com/photo-1552528744-2070386121f1?w=100&h=100&fit=crop'),

    // --- PERIODS (LOD 1) ---
    createPeriod('per-patriarchs', 'era-ancient', -2100, -1800, 'Patriarchs', 'האבות', 'https://images.unsplash.com/photo-1605197509751-62ad15582a8d?w=100&h=100&fit=crop'),
    createPeriod('per-egypt', 'era-ancient', -1550, -1200, 'Egyptian Sojourn', 'ירידה למצרים', 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=100&h=100&fit=crop'),
    createPeriod('per-kings', 'era-ancient', -1000, -586, 'Monarchy', 'תקופת המלכים', 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=100&h=100&fit=crop'),
    createPeriod('per-exile', 'era-classical', -586, -538, 'Babylonian Exile', 'גלות בבל', 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=100&h=100&fit=crop'),
    createPeriod('per-hasmonean', 'era-classical', -167, -63, 'Hasmonean Dynasty', 'בית חשמונאי', 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=100&h=100&fit=crop'),
    createPeriod('per-romans', 'era-classical', 63, 324, 'Roman Rule', 'שלטון רומא', 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=100&h=100&fit=crop'),
    createPeriod('per-crusaders', 'era-medieval', 1099, 1291, 'Crusader Period', 'התקופה הצלבנית', 'https://images.unsplash.com/photo-1564507592333-c60657eaa0af?w=100&h=100&fit=crop'),
    createPeriod('per-zionism', 'era-modern', 1881, 1948, 'Rise of Zionism', 'עליית הציונות', 'https://images.unsplash.com/photo-1546412414-e188523773bc?w=100&h=100&fit=crop'),
    createPeriod('per-israel', 'era-modern', 1948, 2025, 'State of Israel', 'מדינת ישראל', 'https://images.unsplash.com/photo-1552528744-2070386121f1?w=100&h=100&fit=crop')
  ];

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
      zoomLevelMax: 100,
      imageUrl: `https://picsum.photos/seed/event-${i}/100/100`
    });
  });

  for (let i = 0; i < 400; i++) {
    const year = -3000 + Math.random() * 5000;
    items.push({
      id: `detail-${i}`,
      type: ItemType.PERSON,
      category: 'religious',
      startYear: Math.floor(year),
      title: { en: `Figure ${i}`, he: `דמות ${i}` },
      summary: { en: 'Minor historical record.', he: 'רישום היסטורי משני.' },
      description: { en: '', he: '' },
      importance: 20,
      zoomLevelMin: 30,
      zoomLevelMax: 100,
      imageUrl: `https://picsum.photos/seed/detail-${i}/60/60`
    });
  }

  return items;
};

export const MOCK_DATA = generateItems();
