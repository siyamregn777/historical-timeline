
import { TimelineItem, ItemType } from '../types';

const createMock = (
  id: string, 
  type: ItemType, 
  start: number, 
  end: number | undefined, 
  en: string, 
  he: string, 
  imp: number, 
  zMin: number, 
  zMax: number,
  category: string
): Omit<TimelineItem, 'id'> => ({
  type,
  category,
  startYear: start,
  endYear: end,
  title: { en, he },
  summary: { en: `Significant historical record of ${en}.`, he: `תיעוד היסטורי משמעותי של ${he}.` },
  description: { en: `A detailed exploration into the life or impact of ${en} during the period starting ${start}.`, he: `חקירה מפורטת של ההשפעה של ${he} בתקופה שהחלה בשנת ${start}.` },
  importance: imp,
  zoomLevelMin: zMin,
  zoomLevelMax: zMax,
  imageUrl: `https://picsum.photos/seed/${id}/600/600`
});

// Helper to generate chronological ranges
const generateData = (count: number, type: ItemType): Omit<TimelineItem, 'id'>[] => {
  const items: Omit<TimelineItem, 'id'>[] = [];
  const category = type === ItemType.PERSON ? 'person' : 'event';
  const prefix = type === ItemType.PERSON ? 'p' : 'e';

  // Tier 1: Major Landmarks (1x - 30x)
  const tier1Anchors = type === ItemType.PERSON 
    ? [
        { n: "Abraham", h: "אברהם", y: -1813, d: 175 },
        { n: "Moses", h: "משה", y: -1391, d: 120 },
        { n: "King David", h: "דוד המלך", y: -1040, d: 70 },
        { n: "Maimonides", h: "רמב״ם", y: 1135, d: 69 },
        { n: "Ben Gurion", h: "בן גוריון", y: 1886, d: 87 }
      ]
    : [
        { n: "Egyptian Kingdom", h: "ממלכת מצרים", y: -3000, d: 1000 },
        { n: "First Temple Era", h: "בית ראשון", y: -957, d: 371 },
        { n: "Roman Conquest", h: "כיבוש רומי", y: -63, d: 400 },
        { n: "Golden Age", h: "תור הזהב", y: 912, d: 154 },
        { n: "Modern Israel", h: "ישראל המודרנית", y: 1948, d: 77 }
      ];

  tier1Anchors.forEach((a, i) => {
    items.push(createMock(`${prefix}-t1-${i}`, type, a.y, a.y + a.d, a.n, a.h, 100, 1, 30, category));
  });

  // Tier 2: Mid-Level Details (20x - 60x)
  for (let i = 0; i < 40; i++) {
    const year = -2500 + (i * 110);
    const duration = 20 + Math.random() * 50;
    items.push(createMock(
      `${prefix}-t2-${i}`, 
      type, 
      year, 
      year + duration, 
      `${category === 'person' ? 'Philosopher' : 'Treaty'} ${i}`, 
      `${category === 'person' ? 'פילוסוף' : 'חוזה'} ${i}`, 
      70, 20, 60, category
    ));
  }

  // Tier 3: Strict Deep Detail (50x - 75x) - User Requested Specific Range
  for (let i = 0; i < 40; i++) {
    const year = -2000 + (i * 100);
    const duration = 5 + Math.random() * 15;
    items.push(createMock(
      `${prefix}-t3-${i}`, 
      type, 
      year, 
      year + duration, 
      `Micro ${category === 'person' ? 'Scholar' : 'Battle'} ${i}`, 
      `מיקרו ${category === 'person' ? 'מלומד' : 'קרב'} ${i}`, 
      40, 50, 75, category
    ));
  }

  // Tier 4: Ultra Deep Detail (70x - 1000x)
  for (let i = 0; i < 40; i++) {
    const year = -1500 + (i * 85);
    const duration = 2 + Math.random() * 10;
    items.push(createMock(
      `${prefix}-t4-${i}`, 
      type, 
      year, 
      year + duration, 
      `Hidden ${category === 'person' ? 'Artisan' : 'Incident'} ${i}`, 
      `נסתר ${category === 'person' ? 'אומן' : 'תקרית'} ${i}`, 
      20, 70, 1000, category
    ));
  }

  return items;
};

export const MOCK_PEOPLE = generateData(120, ItemType.PERSON);
export const MOCK_EVENTS = generateData(120, ItemType.EVENT);
