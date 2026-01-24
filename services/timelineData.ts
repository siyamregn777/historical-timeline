
import { TimelineItem, ItemType, Category } from '../types';

export const MOCK_CATEGORIES: Category[] = [
  { id: 'events', label: { en: 'Events', he: 'אירועים' }, color: '#6366f1' },
  { id: 'people', label: { en: 'People', he: 'אישים' }, color: '#10b981' },
  { id: 'durations', label: { en: 'Durations', he: 'תקופות' }, color: '#f43f5e' },
];

const generateItems = (): TimelineItem[] => {
  const items: TimelineItem[] = [
    // --- PILLARS (Importance 1) - Foundational Milestones ---
    {
      id: 'pillar-patriarchs', importance: 1, type: ItemType.PERIOD, category: 'durations',
      startYear: -2100, endYear: -1800,
      title: { en: 'Age of the Patriarchs', he: 'תקופת האבות' },
      summary: { en: 'Abraham, Isaac, and Jacob establish the covenant.', he: 'אברהם, יצחק ויעקב מכוננים את הברית.' },
      description: { en: 'The foundational era of the Jewish people, starting with Abraham\'s journey to Canaan.', he: 'התקופה המכוננת של עם ישראל, המתחילה במסעו של אברהם לכנען.' },
      imageUrl: 'https://images.unsplash.com/photo-1605197509751-62ad15582a8d?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'pillar-exodus', importance: 1, type: ItemType.EVENT, category: 'events',
      startYear: -1313,
      title: { en: 'The Exodus', he: 'יציאת מצרים' },
      summary: { en: 'Liberation from Egyptian bondage.', he: 'יציאה מעבדות מצרים לחירות.' },
      description: { en: 'The pivotal event of national liberation and the receiving of the Torah at Sinai.', he: 'האירוע המכונן של שחרור לאומי וקבלת התורה בסיני.' },
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'pillar-temple1', importance: 1, type: ItemType.PERIOD, category: 'durations',
      startYear: -957, endYear: -586,
      title: { en: 'First Temple Era', he: 'בית ראשון' },
      summary: { en: 'The kingdom of David and Solomon.', he: 'ממלכת דוד ושלמה.' },
      description: { en: 'Centuries of centralized worship in Jerusalem under the Davidic dynasty.', he: 'מאות שנים של פולחן ריכוזי בירושלים תחת שושלת בית דוד.' },
      imageUrl: 'https://images.unsplash.com/photo-1546412414-8035e1776c9a?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'pillar-temple2', importance: 1, type: ItemType.PERIOD, category: 'durations',
      startYear: -516, endYear: 70,
      title: { en: 'Second Temple Era', he: 'בית שני' },
      summary: { en: 'Return from Babylon to the destruction by Rome.', he: 'מהשיבה מבבל ועד החורבן על ידי רומא.' },
      description: { en: 'The era of the Great Assembly, the Maccabean revolt, and the Roman conquest.', he: 'תקופת כנסת הגדולה, מרד המכבים והכיבוש הרומי.' },
      imageUrl: 'https://images.unsplash.com/photo-1552528744-2070386121f1?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'pillar-mishnah', importance: 1, type: ItemType.PERIOD, category: 'durations',
      startYear: 70, endYear: 200,
      title: { en: 'Era of the Tannaim', he: 'תקופת התנאים' },
      summary: { en: 'Codification of the Oral Law into the Mishnah.', he: 'עריכת המשנה וחתימתה.' },
      description: { en: 'A period of intense legal and spiritual activity following the Temple\'s destruction.', he: 'תקופה של פעילות הלכתית ורוחנית אינטנסיבית בעקבות חורבן הבית.' },
      imageUrl: 'https://images.unsplash.com/photo-1584043720379-b56cd9199c94?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'pillar-independence', importance: 1, type: ItemType.EVENT, category: 'events',
      startYear: 1948,
      title: { en: 'State of Israel', he: 'מדינת ישראל' },
      summary: { en: 'Restoration of Jewish sovereignty.', he: 'חידוש הריבונות היהודית.' },
      description: { en: 'The proclamation of the State of Israel in Tel Aviv on May 14, 1948.', he: 'הכרזת מדינת ישראל בתל אביב ב-14 במאי 1948.' },
      imageUrl: 'https://images.unsplash.com/photo-1552528744-2070386121f1?auto=format&fit=crop&q=80&w=600'
    }
  ];

  const prefixEn = ['Prophet', 'Sage', 'Scholar', 'Rebel', 'General', 'Poet', 'Physician', 'Merchant', 'Rabbi', 'Thinker', 'Mystic', 'Diplomat', 'Scribe', 'Leader'];
  const prefixHe = ['נביא', 'חכם', 'מלומד', 'מורד', 'גנרל', 'משורר', 'רופא', 'סוחר', 'רב', 'הוגה', 'מקובל', 'דיפלומט', 'סופר', 'מנהיג'];
  const locationEn = ['Babylon', 'Jerusalem', 'Alexandria', 'Rome', 'Toledo', 'Cordoba', 'Mainz', 'Vilna', 'Safed', 'New York', 'Tel Aviv', 'Warsaw'];
  const locationHe = ['בבל', 'ירושלים', 'אלכסנדריה', 'רומא', 'טולדו', 'קורדובה', 'מגנצה', 'וילנה', 'צפת', 'ניו יורק', 'תל אביב', 'ורשה'];

  // Generate 420+ items to ensure high density
  for (let i = 0; i < 430; i++) {
    const year = Math.floor(Math.random() * (2024 - (-3000))) + (-3000);
    
    // Weighted importance: 
    // 1 in 40 is Importance 2 (Major detail)
    // 1 in 15 is Importance 3 (Contextual detail)
    // 1 in 5 is Importance 4 (Small data)
    // Else Importance 5 (Micro-data)
    let importance = 5;
    if (i % 40 === 0) importance = 2;
    else if (i % 15 === 0) importance = 3;
    else if (i % 5 === 0) importance = 4;

    const typeIdx = i % prefixEn.length;
    const locIdx = i % locationEn.length;
    
    const type = i % 4 === 0 ? ItemType.PERSON : (i % 3 === 0 ? ItemType.PERIOD : ItemType.EVENT);
    const category = type === ItemType.EVENT ? 'events' : type === ItemType.PERSON ? 'people' : 'durations';

    items.push({
      id: `generated-${i}`,
      importance,
      type,
      category,
      startYear: year,
      endYear: type === ItemType.PERIOD ? year + Math.floor(Math.random() * 100) + 10 : undefined,
      title: { 
        en: `${prefixEn[typeIdx]} of ${locationEn[locIdx]} #${i + 1}`, 
        he: `${prefixHe[typeIdx]} מ${locationHe[locIdx]} #${i + 1}` 
      },
      summary: { 
        en: `Significant record found regarding ${prefixEn[typeIdx]} in ${locationEn[locIdx]} during the year ${year}.`, 
        he: `תיעוד משמעותי נמצא לגבי ${prefixHe[typeIdx]} ב${locationHe[locIdx]} בשנת ${year}.` 
      },
      description: { 
        en: `<p>Archaeological evidence and historical manuscripts suggest that this entry represents a critical cultural development in the region. Further analysis shows a high level of influence on local communities during the ${year}s.</p>`, 
        he: `<p>ממצאים ארכיאולוגיים וכתבי יד היסטוריים מצביעים על כך שפריט זה מייצג התפתחות תרבותית קריטית באזור. ניתוח נוסף מראה רמה גבוהה של השפעה על קהילות מקומיות במהלך שנות ה-${year}.</p>` 
      },
      imageUrl: `https://picsum.photos/seed/hist-${i}/500/300`
    });
  }

  return items;
};

export const MOCK_DATA = generateItems();
