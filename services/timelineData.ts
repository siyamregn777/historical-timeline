
import { TimelineItem, ItemType, Category } from '../types';

export const MOCK_CATEGORIES: Category[] = [
  { id: 'tanach', label: { en: 'Biblical / Tanach', he: 'תנ״ך' }, color: '#6366f1' },
  { id: 'temple', label: { en: 'Temple Eras', he: 'תקופות המקדש' }, color: '#f43f5e' },
  { id: 'diaspora', label: { en: 'Diaspora & Sages', he: 'גלות וחכמים' }, color: '#10b981' },
  { id: 'modern', label: { en: 'Modern Israel', he: 'ישראל המודרנית' }, color: '#f59e0b' },
];

const generateItems = (): TimelineItem[] => {
  const items: TimelineItem[] = [
    // --- PILLARS ---
    {
      id: 'pillar-patriarchs', importance: 1, type: ItemType.PERIOD, category: 'tanach',
      startYear: -2100, endYear: -1800,
      title: { en: 'Age of the Patriarchs', he: 'תקופת האבות' },
      summary: { en: 'Abraham, Isaac, and Jacob establish the covenant.', he: 'אברהם, יצחק ויעקב מכוננים את הברית.' },
      description: { en: 'The foundational era of the Jewish people...', he: 'התקופה המכוננת של עם ישראל...' },
      imageUrl: 'https://images.unsplash.com/photo-1605197509751-62ad15582a8d?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 'pillar-exodus', importance: 1, type: ItemType.EVENT, category: 'tanach',
      startYear: -1313,
      title: { en: 'The Exodus', he: 'יציאת מצרים' },
      summary: { en: 'Liberation from Egyptian bondage.', he: 'יציאה מעבדות מצרים לחירות.' },
      description: { en: 'A pivotal event in human history...', he: 'אירוע מכונן בתולדות האנושות...' },
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 'pillar-temple1', importance: 1, type: ItemType.PERIOD, category: 'temple',
      startYear: -957, endYear: -586,
      title: { en: 'First Temple Era', he: 'בית ראשון' },
      summary: { en: 'The kingdom of David and Solomon.', he: 'ממלכת דוד ושלמה.' },
      description: { en: 'Centuries of centralized worship in Jerusalem.', he: 'מאות שנים של פולחן ריכוזי בירושלים.' },
      imageUrl: 'https://images.unsplash.com/photo-1546412414-8035e1776c9a?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 'pillar-temple2', importance: 1, type: ItemType.PERIOD, category: 'temple',
      startYear: -516, endYear: 70,
      title: { en: 'Second Temple Era', he: 'בית שני' },
      summary: { en: 'Return from Babylon to the destruction by Rome.', he: 'מהשיבה מבבל ועד החורבן על ידי רומא.' },
      description: { en: 'The era of the Great Assembly, the Maccabees, and the Roman conquest.', he: 'תקופת כנסת הגדולה, המכבים והכיבוש הרומי.' },
      imageUrl: 'https://images.unsplash.com/photo-1552528744-2070386121f1?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 'pillar-independence', importance: 1, type: ItemType.EVENT, category: 'modern',
      startYear: 1948,
      title: { en: 'State of Israel', he: 'מדינת ישראל' },
      summary: { en: 'Restoration of Jewish sovereignty.', he: 'חידוש הריבונות היהודית.' },
      description: { en: 'Proclamation of Independence in Tel Aviv.', he: 'הכרזת העצמאות בתל אביב.' },
      imageUrl: 'https://images.unsplash.com/photo-1552528744-2070386121f1?auto=format&fit=crop&q=80&w=400'
    }
  ];

  const eras = [
    { start: -2500, end: -1000, cat: 'tanach', keywords: ['Prophet', 'King', 'Judge', 'Warrior'] },
    { start: -1000, end: 135, cat: 'temple', keywords: ['Priest', 'Scholar', 'Rebel', 'Governor'] },
    { start: 135, end: 1880, cat: 'diaspora', keywords: ['Sage', 'Poet', 'Rabbi', 'Doctor'] },
    { start: 1880, end: 2025, cat: 'modern', keywords: ['Pioneer', 'Soldier', 'Thinker', 'Leader'] }
  ];

  // Generate 200 items for high density
  for (let i = 0; i < 200; i++) {
    const era = eras[i % eras.length];
    const year = Math.floor(Math.random() * (era.end - era.start)) + era.start;
    // Distribute importance: 10% Important (2), 30% Notable (3), 60% granular (4-5)
    const importance = i % 10 === 0 ? 2 : (i % 3 === 0 ? 3 : (i % 2 === 0 ? 4 : 5));
    const keyword = era.keywords[i % era.keywords.length];
    const type = i % 4 === 0 ? ItemType.PERSON : (i % 3 === 0 ? ItemType.PERIOD : ItemType.EVENT);

    items.push({
      id: `gen-${i}`,
      importance,
      type,
      category: era.cat,
      startYear: year,
      endYear: type === ItemType.PERIOD ? year + Math.floor(Math.random() * 80) + 5 : undefined,
      title: { 
        en: `${keyword} ${i+100}`, 
        he: `${keyword} ${i+100}` 
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
