
import { TimelineItem, ItemType, Category } from '../types';

export const MOCK_CATEGORIES: Category[] = [
  { id: 'events', label: { en: 'Events', he: 'אירועים' }, color: '#6366f1' },
  { id: 'people', label: { en: 'People', he: 'אישים' }, color: '#10b981' },
  { id: 'durations', label: { en: 'Durations', he: 'תקופות' }, color: '#f43f5e' },
];

const generateItems = (): TimelineItem[] => {
  const items: TimelineItem[] = [
    // --- TOP PILLARS (Importance 1) ---
    {
      id: 'p-1', importance: 1, type: ItemType.PERIOD, category: 'durations',
      startYear: -2100, endYear: -1800,
      title: { en: 'Patriarchs', he: 'תקופת האבות' },
      summary: { en: 'The beginning of the Jewish narrative.', he: 'תחילת הסיפור היהודי.' },
      description: { en: 'Foundational era.', he: 'תקופה מכוננת.' },
      imageUrl: 'https://images.unsplash.com/photo-1605197509751-62ad15582a8d?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'p-2', importance: 1, type: ItemType.EVENT, category: 'events',
      startYear: -1313,
      title: { en: 'Exodus', he: 'יציאת מצרים' },
      summary: { en: 'National liberation.', he: 'שחרור לאומי.' },
      description: { en: 'The birth of a nation.', he: 'לידת האומה.' },
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'p-3', importance: 1, type: ItemType.PERIOD, category: 'durations',
      startYear: -957, endYear: -586,
      title: { en: 'First Temple', he: 'בית ראשון' },
      summary: { en: 'Sovereignty in Jerusalem.', he: 'ריבונות בירושלים.' },
      description: { en: 'Solomonic era.', he: 'תקופת שלמה.' },
      imageUrl: 'https://images.unsplash.com/photo-1546412414-8035e1776c9a?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'p-4', importance: 1, type: ItemType.EVENT, category: 'events',
      startYear: 1948,
      title: { en: 'State of Israel', he: 'מדינת ישראל' },
      summary: { en: 'Modern Sovereignty.', he: 'ריבונות מודרנית.' },
      description: { en: 'Proclamation of Independence.', he: 'הכרזת העצמאות.' },
      imageUrl: 'https://images.unsplash.com/photo-1552528744-2070386121f1?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'p-5', importance: 1, type: ItemType.PERIOD, category: 'durations',
      startYear: -516, endYear: 70,
      title: { en: 'Second Temple', he: 'בית שני' },
      summary: { en: 'The Return to Zion.', he: 'השיבה לציון.' },
      description: { en: 'Ezra and Nehemiah era.', he: 'תקופת עזרא ונחמיה.' },
      imageUrl: 'https://images.unsplash.com/photo-1584043720379-b56cd9199c94?auto=format&fit=crop&q=80&w=600'
    }
  ];

  // More People
  const people = [
    { n: 'Ruth', y: -1100 }, { n: 'Samuel', y: -1050 }, { n: 'David', y: -1010 }, 
    { n: 'Solomon', y: -970 }, { n: 'Hezekiah', y: -715 }, { n: 'Josiah', y: -640 },
    { n: 'Esther', y: -480 }, { n: 'Ezra', y: -450 }, { n: 'Judah Maccabee', y: -165 },
    { n: 'Hillel', y: -30 }, { n: 'Shammai', y: -20 }, { n: 'Rabbi Akiva', y: 120 },
    { n: 'Judah the Prince', y: 180 }, { n: 'Saadia Gaon', y: 920 }, { n: 'Rashi', y: 1080 },
    { n: 'Maimonides', y: 1170 }, { n: 'Nahmanides', y: 1240 }, { n: 'Joseph Karo', y: 1540 },
    { n: 'Isaac Luria', y: 1560 }, { n: 'Baal Shem Tov', y: 1740 }, { n: 'Vilna Gaon', y: 1770 },
    { n: 'Moses Mendelssohn', y: 1780 }, { n: 'Theodor Herzl', y: 1890 }, { n: 'Chaim Weizmann', y: 1910 },
    { n: 'Albert Einstein', y: 1920 }, { n: 'Ben-Gurion', y: 1940 }, { n: 'Golda Meir', y: 1960 }
  ];

  people.forEach((p, i) => {
    items.push({
      id: `person-${i}`,
      importance: i < 10 ? 2 : 3,
      type: ItemType.PERSON,
      category: 'people',
      startYear: p.y,
      title: { en: p.n, he: p.n }, // PoC simplification
      summary: { en: 'Significant figure.', he: 'דמות משמעותית.' },
      description: { en: 'Legacy contribution.', he: 'תרומה למורשת.' },
      imageUrl: `https://picsum.photos/seed/person-${i}/400/400`
    });
  });

  // Massive Density Generation (600+ items)
  for (let i = 0; i < 600; i++) {
    const year = Math.floor(Math.random() * (2025 - (-3000))) + (-3000);
    // Bias importance towards 4 and 5 (only seen on deep zoom)
    const rand = Math.random();
    const importance = rand > 0.95 ? 2 : (rand > 0.8 ? 3 : (rand > 0.4 ? 4 : 5));
    
    const type = i % 3 === 0 ? ItemType.PERSON : (i % 2 === 0 ? ItemType.EVENT : ItemType.PERIOD);
    const category = type === ItemType.PERSON ? 'people' : (type === ItemType.EVENT ? 'events' : 'durations');

    items.push({
      id: `dense-${i}`,
      importance,
      type,
      category,
      startYear: year,
      endYear: type === ItemType.PERIOD ? year + Math.floor(Math.random() * 100) + 10 : undefined,
      title: { 
        en: `${type.toUpperCase()} #${i}`, 
        he: `${type === ItemType.PERSON ? 'דמות' : 'אירוע'} #${i}` 
      },
      summary: { en: 'Historical context detail.', he: 'פרט הקשר היסטורי.' },
      description: { en: 'Detailed breakdown of this period.', he: 'פירוט מלא של התקופה.' }
    });
  }

  return items;
};

export const MOCK_DATA = generateItems();
