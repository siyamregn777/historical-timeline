
import { TimelineItem, ItemType, Category } from '../types';

export const MOCK_CATEGORIES: Category[] = [
  { id: 'events', label: { en: 'Events', he: 'אירועים' }, color: '#6366f1' },
  { id: 'people', label: { en: 'People', he: 'אישים' }, color: '#10b981' },
  { id: 'durations', label: { en: 'Durations', he: 'תקופות' }, color: '#f43f5e' },
];

const generateData = (): TimelineItem[] => {
  const items: TimelineItem[] = [];
  const start = -3000;
  const range = 5025;

  for (let i = 0; i < 800; i++) {
    const year = start + (Math.random() * range);
    const category = MOCK_CATEGORIES[i % 3].id;
    items.push({
      id: `h-${i}`,
      type: i % 10 === 0 ? ItemType.PERIOD : (i % 2 === 0 ? ItemType.PERSON : ItemType.EVENT),
      category,
      startYear: Math.floor(year),
      title: { 
        en: `Marker ${i}`, 
        he: `נקודה ${i}` 
      },
      summary: { 
        en: 'A significant point in human history.', 
        he: 'נקודת זמן משמעותית בהיסטוריה האנושית.' 
      },
      description: { 
        en: '<p>A deep dive into this historical moment, exploring its causes and consequences.</p>', 
        he: '<p>תיאור מעמיק של הרגע ההיסטורי, בחינת הסיבות וההשלכות שלו.</p>' 
      },
      imageUrl: `https://picsum.photos/seed/${i}/200/200`
    });
  }
  return items;
};

export const MOCK_DATA = generateData();
