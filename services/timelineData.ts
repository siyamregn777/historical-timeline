
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

  // Properly localized people data
  const peopleData = [
    { en: 'Ruth', he: 'רות', y: -1100 },
    { en: 'Samuel', he: 'שמואל', y: -1050 },
    { en: 'David', he: 'דוד המלך', y: -1010 },
    { en: 'Solomon', he: 'שלמה המלך', y: -970 },
    { en: 'Hezekiah', he: 'חזקיהו המלך', y: -715 },
    { en: 'Josiah', he: 'יאשיהו המלך', y: -640 },
    { en: 'Esther', he: 'אסתר המלכה', y: -480 },
    { en: 'Ezra', he: 'עזרא הסופר', y: -450 },
    { en: 'Judah Maccabee', he: 'יהודה המכבי', y: -165 },
    { en: 'Hillel the Elder', he: 'הלל הזקן', y: -30 },
    { en: 'Rabbi Akiva', he: 'רבי עקיבא', y: 120 },
    { en: 'Judah the Prince', he: 'רבי יהודה הנשיא', y: 180 },
    { en: 'Saadia Gaon', he: 'רב סעדיה גאון', y: 920 },
    { en: 'Rashi', he: 'רש״י', y: 1040 },
    { en: 'Maimonides', he: 'רמב״ם', y: 1135 },
    { en: 'Nahmanides', he: 'רמב״ן', y: 1194 },
    { en: 'Joseph Karo', he: 'רבי יוסף קארו', y: 1488 },
    { en: 'Isaac Luria', he: 'האר״י הקדוש', y: 1534 },
    { en: 'Baal Shem Tov', he: 'הבעל שם טוב', y: 1698 },
    { en: 'Vilna Gaon', he: 'הגר״א', y: 1720 },
    { en: 'Theodor Herzl', he: 'בנימין זאב הרצל', y: 1860 },
    { en: 'Albert Einstein', he: 'אלברט איינשטיין', y: 1879 },
    { en: 'Ben-Gurion', he: 'דוד בן-גוריון', y: 1886 },
    { en: 'Golda Meir', he: 'גולדה מאיר', y: 1898 }
  ];

  peopleData.forEach((p, i) => {
    items.push({
      id: `person-${i}`,
      importance: i < 8 ? 2 : 3,
      type: ItemType.PERSON,
      category: 'people',
      startYear: p.y,
      title: { en: p.en, he: p.he },
      summary: { 
        en: 'Significant historical figure.', 
        he: 'דמות היסטורית משמעותית.' 
      },
      description: { 
        en: 'A key individual who shaped Jewish history.', 
        he: 'אדם מרכזי שעיצב את ההיסטוריה היהודית.' 
      },
      imageUrl: `https://picsum.photos/seed/person-${i}/400/400`
    });
  });

  // Massive Density Generation (600+ items) with full localization
  const eventTypesEn = ['Minor Event', 'Local Tradition', 'Archaeological Find', 'Historical Detail'];
  const eventTypesHe = ['אירוע משני', 'מסורת מקומית', 'ממצא ארכיאולוגי', 'פרט היסטורי'];
  
  const personTypesEn = ['Local Leader', 'Scholar', 'Merchant', 'Community Figure'];
  const personTypesHe = ['מנהיג מקומי', 'תלמיד חכם', 'סוחר', 'דמות קהילתית'];

  const periodTypesEn = ['Era of Transition', 'Regional Governance', 'Cultural Shift'];
  const periodTypesHe = ['תקופת מעבר', 'שלטון אזורי', 'שינוי תרבותי'];

  for (let i = 0; i < 600; i++) {
    const year = Math.floor(Math.random() * (2025 - (-3000))) + (-3000);
    const rand = Math.random();
    const importance = rand > 0.95 ? 2 : (rand > 0.8 ? 3 : (rand > 0.4 ? 4 : 5));
    
    const type = i % 3 === 0 ? ItemType.PERSON : (i % 2 === 0 ? ItemType.EVENT : ItemType.PERIOD);
    const category = type === ItemType.PERSON ? 'people' : (type === ItemType.EVENT ? 'events' : 'durations');

    let titleEn = '';
    let titleHe = '';

    if (type === ItemType.PERSON) {
      const idx = Math.floor(Math.random() * personTypesEn.length);
      titleEn = `${personTypesEn[idx]} ${i}`;
      titleHe = `${personTypesHe[idx]} ${i}`;
    } else if (type === ItemType.EVENT) {
      const idx = Math.floor(Math.random() * eventTypesEn.length);
      titleEn = `${eventTypesEn[idx]} ${i}`;
      titleHe = `${eventTypesHe[idx]} ${i}`;
    } else {
      const idx = Math.floor(Math.random() * periodTypesEn.length);
      titleEn = `${periodTypesEn[idx]} ${i}`;
      titleHe = `${periodTypesHe[idx]} ${i}`;
    }

    items.push({
      id: `dense-${i}`,
      importance,
      type,
      category,
      startYear: year,
      endYear: type === ItemType.PERIOD ? year + Math.floor(Math.random() * 80) + 10 : undefined,
      title: { en: titleEn, he: titleHe },
      summary: { 
        en: 'Supporting context for the historical timeline.', 
        he: 'מידע תומך עבור ציר הזמן ההיסטורי.' 
      },
      description: { 
        en: 'Detailed breakdown available in archives.', 
        he: 'פירוט מלא זמין בארכיונים.' 
      }
    });
  }

  return items;
};

export const MOCK_DATA = generateItems();
