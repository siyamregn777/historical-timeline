
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

  const peopleNamesEn = [
    'Abraham', 'Sarah', 'Isaac', 'Rebecca', 'Jacob', 'Leah', 'Rachel', 'Joseph', 'Moses', 'Aaron', 'Miriam', 'Joshua', 'Deborah', 'Gideon', 'Samson', 'Samuel', 'Saul', 'David', 'Solomon', 'Elijah', 'Elisha', 'Isaiah', 'Jeremiah', 'Ezekiel', 'Hosea', 'Amos', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi', 'Ezra', 'Nehemiah', 'Mordecai', 'Esther', 'Judah Maccabee', 'Hillel the Elder', 'Shammai', 'Philo of Alexandria', 'Josephus', 'Rabbi Akiva', 'Rabbi Meir', 'Bruriah', 'Judah the Prince', 'Rav', 'Shmuel', 'Resh Lakish', 'Rabbi Yochanan', 'Rav Ashi', 'Ravina', 'Saadia Gaon', 'Rashi', 'Maimonides', 'Nahmanides', 'Yehuda Halevi', 'Ibn Ezra', 'Joseph Karo', 'Isaac Luria', 'Shabbetai Tzvi', 'Baal Shem Tov', 'Vilna Gaon', 'Moses Mendelssohn', 'Sir Moses Montefiore', 'Theodor Herzl', 'Ahad Ha\'am', 'Chaim Weizmann', 'David Ben-Gurion', 'Golda Meir', 'Menachem Begin', 'Albert Einstein', 'Sigmund Freud', 'Franz Kafka', 'Hannah Arendt', 'Elie Wiesel', 'Leonard Bernstein', 'Bob Dylan', 'Steven Spielberg', 'Ruth Bader Ginsburg', 'Shai Agnon', 'Leah Goldberg', 'Natan Alterman', 'Rachel the Poetess', 'Yitzhak Rabin', 'Shimon Peres', 'Ada Yonath', 'Gal Gadot', 'Benjamin Netanyahu', 'Golda Meir', 'Rav Kook', 'A.D. Gordon', 'Berl Katznelson', 'Ze\'ev Jabotinsky', 'Hannah Szenes', 'Eli Cohen', 'Ilan Ramon', 'Rona Ramon', 'Yoni Netanyahu', 'Sarah Aaronsohn', 'Joseph Trumpeldor'
  ];

  // Fix: Use double quotes for Hebrew strings to avoid parsing errors with Geresh/Apostrophe
  const peopleNamesHe = [
    "אברהם", "שרה", "יצחק", "רבקה", "יעקב", "לאה", "רחל", "יוסף", "משה", "אהרן", "מרים", "יהושע", "דבורה", "גדעון", "שמשון", "שמואל", "שאול", "דוד", "שלמה", "אליהו", "אלישע", "ישעיהו", "ירמיהו", "יחזקאל", "הושע", "עמוס", "מיכה", "נחום", "חבקוק", "צפניה", "חגי", "זכריה", "מלאכי", "עזרא", "נחמיה", "מרדכי", "אסתר", "יהודה המכבי", "הלל הזקן", "שמאי", "פילון האלכסנדרוני", "יוספוס פלביוס", "רבי עקיבא", "רבי מאיר", "ברוריה", "יהודה הנשיא", "רב", "שמואל", "ריש לקיש", "רבי יוחנן", "רב אשי", "רבינא", "רב סעדיה גאון", "רש\"י", "הרמב\"ם", "הרמב\"ן", "יהודה הלוי", "אבן עזרא", "יוסף קארו", "האר\"י הקדוש", "שבתי צבי", "הבעל שם טוב", "הגר\"א", "משה מנדלסון", "משה מונטיפיורי", "תיאודור הרצל", "אחד העם", "חיים ויצמן", "דוד בן-גוריון", "גולדה מאיר", "מנחם בגין", "אלברט איינשטיין", "זיגמונד פרויד", "פרנץ קפקא", "חנה ארנדט", "אלי ויזל", "ליאונרד ברנשטיין", "בוב דילן", "סטיבן ספילברג", "רות ביידר גינזבורג", "ש\"י עגנון", "לאה גולדברג", "נתן אלתרמן", "רחל המשוררת", "יצחק רבין", "שמעון פרס", "עדה יונת", "גל גדות", "בנימין נתניהו", "גולדה מאיר", "הרב קוק", "א\"ד גורדון", "ברל כצנלסון", "זאב ז'בוטינסקי", "חנה סנש", "אלי כהן", "אילן רמון", "רונה רמון", "יוני נתניהו", "שרה אהרנסון", "יוסף טרומפלדור"
  ];

  // 1. Explicitly generate 100+ People across history
  for (let i = 0; i < peopleNamesEn.length; i++) {
    const year = -2000 + (i * 40); // Spread them out
    const importance = i < 20 ? 2 : (i < 50 ? 3 : 4);
    
    items.push({
      id: `person-fixed-${i}`,
      importance,
      type: ItemType.PERSON,
      category: 'people',
      startYear: year,
      title: { 
        en: peopleNamesEn[i], 
        he: peopleNamesHe[i] 
      },
      summary: { 
        en: `A defining figure in history, known for their contributions to culture, leadership, or thought.`, 
        he: `דמות מפתח בהיסטוריה, הידועה בתרומתה לתרבות, להנהגה או למחשבה.` 
      },
      description: { 
        en: `<p>${peopleNamesEn[i]} played a significant role in the historical narrative of the Jewish people. Their legacy continues to influence modern values and traditions.</p>`, 
        he: `<p>${peopleNamesHe[i]} מילא/ה תפקיד משמעותי בנרטיב ההיסטורי של עם ישראל. מורשתם ממשיכה להשפיע על ערכים ומסורות מודרניות.</p>` 
      },
      imageUrl: `https://picsum.photos/seed/person-${i}/500/300`
    });
  }

  // 2. Generate generic items to fill density (Total items ~500)
  for (let i = 0; i < 350; i++) {
    const year = Math.floor(Math.random() * (2024 - (-3000))) + (-3000);
    let importance = 5;
    if (i % 40 === 0) importance = 2;
    else if (i % 15 === 0) importance = 3;
    else if (i % 5 === 0) importance = 4;

    const typeIdx = i % prefixEn.length;
    const locIdx = i % locationEn.length;
    
    // Distribute remaining types
    const type = i % 2 === 0 ? ItemType.EVENT : ItemType.PERIOD;
    const category = type === ItemType.EVENT ? 'events' : 'durations';

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
        en: `Historical data regarding a significant ${type} in ${locationEn[locIdx]} during the year ${year}.`, 
        he: `נתונים היסטוריים לגבי ${type} משמעותי/ת ב${locationHe[locIdx]} בשנת ${year}.` 
      },
      description: { 
        en: `<p>A contextual exploration of the events or trends that shaped the ${locationEn[locIdx]} region during this era.</p>`, 
        he: `<p>חקירה הקשרית של האירועים או המגמות שעיצבו את אזור ${locationHe[locIdx]} בתקופה זו.</p>` 
      },
      imageUrl: `https://picsum.photos/seed/gen-hist-${i}/500/300`
    });
  }

  return items;
};

export const MOCK_DATA = generateItems();
