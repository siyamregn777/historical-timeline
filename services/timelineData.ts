
import { TimelineItem, ItemType, Category } from '../types';

export const MOCK_CATEGORIES: Category[] = [
  { id: 'events', label: { en: 'Events', he: 'אירועים' }, color: '#6366f1' },
  { id: 'people', label: { en: 'People', he: 'אישים' }, color: '#10b981' },
  { id: 'durations', label: { en: 'Durations', he: 'תקופות' }, color: '#f43f5e' },
];

const generateItems = (): TimelineItem[] => {
  const items: TimelineItem[] = [
    // --- PILLARS ---
    {
      id: 'pillar-patriarchs', importance: 1, type: ItemType.PERIOD, category: 'durations',
      startYear: -2100, endYear: -1800,
      title: { en: 'Age of the Patriarchs', he: 'תקופת האבות' },
      summary: { en: 'Abraham, Isaac, and Jacob establish the covenant.', he: 'אברהם, יצחק ויעקב מכוננים את הברית.' },
      description: { en: 'The foundational era of the Jewish people...', he: 'התקופה המכוננת של עם ישראל...' },
      imageUrl: 'https://images.unsplash.com/photo-1605197509751-62ad15582a8d?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 'pillar-exodus', importance: 1, type: ItemType.EVENT, category: 'events',
      startYear: -1313,
      title: { en: 'The Exodus', he: 'יציאת מצרים' },
      summary: { en: 'Liberation from Egyptian bondage.', he: 'יציאה מעבדות מצרים לחירות.' },
      description: { en: 'A pivotal event in human history...', he: 'אירוע מכונן בתולדות האנושות...' },
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 'pillar-temple1', importance: 1, type: ItemType.PERIOD, category: 'durations',
      startYear: -957, endYear: -586,
      title: { en: 'First Temple Era', he: 'בית ראשון' },
      summary: { en: 'The kingdom of David and Solomon.', he: 'ממלכת דוד ושלמה.' },
      description: { en: 'Centuries of centralized worship in Jerusalem.', he: 'מאות שנים של פולחן ריכוזי בירושלים.' },
      imageUrl: 'https://images.unsplash.com/photo-1546412414-8035e1776c9a?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 'pillar-temple2', importance: 1, type: ItemType.PERIOD, category: 'durations',
      startYear: -516, endYear: 70,
      title: { en: 'Second Temple Era', he: 'בית שני' },
      summary: { en: 'Return from Babylon to the destruction by Rome.', he: 'מהשיבה מבבל ועד החורבן על ידי רומא.' },
      description: { en: 'The era of the Great Assembly, the Maccabees, and the Roman conquest.', he: 'תקופת כנסת הגדולה, המכבים והכיבוש הרומי.' },
      imageUrl: 'https://images.unsplash.com/photo-1552528744-2070386121f1?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 'pillar-independence', importance: 1, type: ItemType.EVENT, category: 'events',
      startYear: 1948,
      title: { en: 'State of Israel', he: 'מדינת ישראל' },
      summary: { en: 'Restoration of Jewish sovereignty.', he: 'חידוש הריבונות היהודית.' },
      description: { en: 'Proclamation of Independence in Tel Aviv.', he: 'הכרזת העצמאות בתל אביב.' },
      imageUrl: 'https://images.unsplash.com/photo-1552528744-2070386121f1?auto=format&fit=crop&q=80&w=400'
    }
  ];

  const keywords = ['Prophet', 'King', 'Judge', 'Warrior', 'Sage', 'Poet', 'Rabbi', 'Doctor', 'Pioneer', 'Thinker', 'Leader'];

  // Generate items across the 4000BC-2030AD range
  for (let i = 0; i < 250; i++) {
    const year = Math.floor(Math.random() * (2030 - (-4000))) + (-4000);
    const importance = i % 15 === 0 ? 2 : (i % 5 === 0 ? 3 : (i % 2 === 0 ? 4 : 5));
    const keyword = keywords[i % keywords.length];
    
    // Assign category based on type
    const type = i % 4 === 0 ? ItemType.PERSON : (i % 3 === 0 ? ItemType.PERIOD : ItemType.EVENT);
    const category = type === ItemType.EVENT ? 'events' : type === ItemType.PERSON ? 'people' : 'durations';

    items.push({
      id: `gen-${i}`,
      importance,
      type,
      category,
      startYear: year,
      endYear: type === ItemType.PERIOD ? year + Math.floor(Math.random() * 150) + 10 : undefined,
      title: { 
        en: `${keyword} ${i+100}`, 
        he: `${keyword === 'Prophet' ? 'נביא' : keyword === 'King' ? 'מלך' : 'דמות'} ${i+100}` 
      },
      summary: { 
        en: `Historical record for ${keyword} during the year ${year}.`, 
        he: `תיעוד היסטורי עבור ${keyword} בשנת ${year}.` 
      },
      description: { 
        en: `Comprehensive narrative for procedural entry ${i}. This data represents a specific milestone in the tapestry of history.`, 
        he: `תיאור מקיף עבור פריט סימולציה ${i}. נתונים אלו מייצגים אבן דרך ספציפית במארג ההיסטוריה.` 
      },
      imageUrl: `https://picsum.photos/seed/hist-${i}/400/300`
    });
  }

  return items;
};

export const MOCK_DATA = generateItems();
