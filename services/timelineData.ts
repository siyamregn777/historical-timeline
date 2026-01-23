
import { TimelineItem, ItemType, ArticleContent } from '../types';

const PATRIARCHS_ARTICLE: ArticleContent = {
  intro: {
    en: "The Age of the Patriarchs marks the dawn of the Jewish people, beginning with Abraham's journey to the Land of Canaan.",
    he: "תקופת האבות מסמלת את ראשיתו של עם ישראל, החל ממסעו של אברהם לארץ כנען."
  },
  sections: [
    {
      title: { en: "The Covenant", he: "הברית" },
      content: { 
        en: "Central to this era is the 'Brit Bein HaBetarim', establishing a spiritual and physical connection to the land.",
        he: "במרכז תקופה זו עומדת ברית בין הבתרים, המכוננת קשר רוחני ופיזי לארץ."
      },
      listItems: [
        { en: "Migration from Ur of the Chaldeans", he: "ההגירה מאור כשדים" },
        { en: "The binding of Isaac", he: "עקידת יצחק" },
        { en: "Jacob's transition to Israel", he: "הפיכת יעקב לישראל" }
      ]
    }
  ],
  conclusion: {
    en: "This era defined the ethical monotheism that would characterize Jewish thought for millennia.",
    he: "תקופה זו הגדירה את המונותאיזם האתי שיאפיין את המחשבה היהודית לאורך אלפי שנים."
  }
};

const MOSES_ARTICLE: ArticleContent = {
  intro: {
    en: "Moses, the greatest of all prophets, led the Israelites from slavery in Egypt to the threshold of the Promised Land.",
    he: "משה רבנו, גדול הנביאים, הנהיג את בני ישראל מעבדות מצרים ועד לסף הארץ המובטחת."
  },
  sections: [
    {
      title: { en: "The Revelation at Sinai", he: "מעמד הר סיני" },
      content: { 
        en: "The defining moment of his leadership was the receiving of the Ten Commandments and the Torah at Mount Sinai.",
        he: "רגע השיא של מנהיגותו היה קבלת עשרת הדיברות והתורה במעמד הר סיני."
      }
    }
  ],
  conclusion: {
    en: "His legacy provides the legal and moral foundation for Western civilization.",
    he: "מורשתו מהווה את היסוד המשפטי והמוסרי לתרבות המערב."
  }
};

const FIRST_TEMPLE_ARTICLE: ArticleContent = {
  intro: {
    en: "Built by King Solomon, the First Temple served as the spiritual and political center of the Kingdom of Israel.",
    he: "בית המקדש הראשון, שנבנה על ידי שלמה המלך, שימש כמרכז הרוחני והפוליטי של ממלכת ישראל."
  },
  sections: [
    {
      title: { en: "The Glory of Zion", he: "תפארת ציון" },
      content: { 
        en: "For over four centuries, it was the site of national pilgrimage and the resting place of the Holy Ark.",
        he: "במשך למעלה מארבע מאות שנה, היה המקום מוקד לעלייה לרגל לאומית ומשכנו של ארון הקודש."
      }
    }
  ],
  conclusion: {
    en: "The destruction by the Babylonians in 586 BCE began the first major Jewish exile.",
    he: "חורבן הבית בידי הבבלים בשנת 586 לפנה״ס סימן את תחילת גלות בבל."
  }
};

const SECOND_TEMPLE_ARTICLE: ArticleContent = {
  intro: {
    en: "The return from Babylon led to the reconstruction of the Temple, an era characterized by both great struggle and spiritual revival.",
    he: "השיבה מבבל הובילה לבנייה מחדש של המקדש, תקופה שאופיינה במאבקים גדולים לצד פריחה רוחנית."
  },
  sections: [
    {
      title: { en: "The Hasmonean Period", he: "התקופה החשמונאית" },
      content: { 
        en: "Following the Maccabean Revolt, the Temple was rededicated, an event celebrated annually as Hanukkah.",
        he: "בעקבות מרד החשמונאים, חונך המקדש מחדש, אירוע הנחגג מדי שנה כחג החנוכה."
      }
    }
  ],
  conclusion: {
    en: "The era ended with the Roman destruction in 70 CE, fundamentally reshaping Jewish worship.",
    he: "התקופה הסתיימה עם החורבן הרומי בשנת 70 לספירה, מה ששינה מן היסוד את צורת הפולחן היהודי."
  }
};

const RAMBAM_ARTICLE: ArticleContent = {
  intro: {
    en: "Rabbi Moshe ben Maimon, known as Rambam, was a titan of Sephardic scholarship during the Golden Age of Spain.",
    he: "רבי משה בן מימון, המוכר כרמב״ם, היה ענק הרוח של יהדות ספרד בתור הזהב."
  },
  sections: [
    {
      title: { en: "The Guide for the Perplexed", he: "מורה נבוכים" },
      content: { 
        en: "His philosophical masterpiece bridged the gap between Aristotelian logic and Torah scholarship.",
        he: "יצירת המופת הפילוסופית שלו גישרה על הפער בין הלוגיקה האריסטוטלית ללימוד התורה."
      }
    },
    {
      title: { en: "Medical Legacy", he: "מורשת רפואית" },
      content: {
        en: "Serving as the personal physician to Saladin, his treatises on hygiene and psychology are still studied today.",
        he: "כרופאו האישי של צלאח א-דין, חיבוריו על היגיינה ופסיכולוגיה נלמדים עד היום."
      }
    }
  ],
  conclusion: {
    en: "From Moses to Moses, there arose none like Moses.",
    he: "ממשה ועד משה לא קם כמשה."
  }
};

const ISRAEL_ARTICLE: ArticleContent = {
  intro: {
    en: "The Declaration of Independence on May 14, 1948, fulfilled a two-thousand-year-old dream of Jewish sovereignty.",
    he: "הכרזת העצמאות ב-14 במאי 1948 הגשימה חלום בן אלפיים שנה לריבונות יהודית."
  },
  sections: [
    {
      title: { en: "The Ingathering of Exiles", he: "קיבוץ גלויות" },
      content: { 
        en: "Following the declaration, millions of Jews from Arab lands and Europe returned to their ancestral homeland.",
        he: "בעקבות ההכרזה, מיליוני יהודים מארצות ערב ומאירופה שבו למולדת אבותיהם."
      }
    }
  ],
  conclusion: {
    en: "Modern Israel represents a unique synthesis of ancient tradition and high-tech innovation.",
    he: "ישראל המודרנית מייצגת סינתזה ייחודית בין מסורת עתיקה לחדשנות טכנולוגית."
  }
};

const MOCK_DATA: TimelineItem[] = [
  {
    id: 'p-patriarchs',
    type: ItemType.PERIOD,
    category: 'tanach',
    startYear: -2100,
    endYear: -1800,
    title: { en: 'Age of the Patriarchs', he: 'תקופת האבות' },
    description: { en: 'The formative era of Abraham, Isaac, and Jacob.', he: 'תקופת אברהם, יצחק ויעקב.' },
    article: PATRIARCHS_ARTICLE
  },
  {
    id: 'e-exodus',
    type: ItemType.EVENT,
    category: 'tanach',
    startYear: -1313,
    title: { en: 'The Exodus', he: 'יציאת מצרים' },
    description: { en: 'The miraculous departure of the Israelites from Egyptian bondage.', he: 'יציאת בני ישראל משעבוד מצרים לחירות.' },
    article: MOSES_ARTICLE
  },
  {
    id: 'per-moses',
    type: ItemType.PERSON,
    category: 'tanach',
    startYear: -1393,
    endYear: -1273,
    title: { en: 'Moses', he: 'משה רבנו' },
    description: { en: 'Prophet, leader, and lawgiver who received the Torah at Sinai.', he: 'נביא, מנהיג ומחוקק שקיבל את התורה בסיני.' },
    article: MOSES_ARTICLE
  },
  {
    id: 'p-first-temple',
    type: ItemType.PERIOD,
    category: 'temple',
    startYear: -957,
    endYear: -586,
    title: { en: 'First Temple Period', he: 'בית ראשון' },
    description: { en: 'The era of the Temple built by King Solomon in Jerusalem.', he: 'תקופת המקדש שנבנה על ידי שלמה המלך בירושלים.' },
    article: FIRST_TEMPLE_ARTICLE
  },
  {
    id: 'p-second-temple',
    type: ItemType.PERIOD,
    category: 'temple',
    startYear: -516,
    endYear: 70,
    title: { en: 'Second Temple Period', he: 'בית שני' },
    description: { en: 'The era following the return from Babylon until the Roman destruction.', he: 'התקופה שלאחר השיבה מבבל ועד לחורבן על ידי הרומאים.' },
    article: SECOND_TEMPLE_ARTICLE
  },
  {
    id: 'per-rambam',
    type: ItemType.PERSON,
    category: 'diaspora',
    startYear: 1135,
    endYear: 1204,
    title: { en: 'Maimonides (Rambam)', he: 'רמב"ם' },
    description: { en: 'Preeminent medieval Sephardic Jewish philosopher and physician.', he: 'פילוסוף ורופא יהודי ספרדי בולט בימי הביניים.' },
    article: RAMBAM_ARTICLE
  },
  {
    id: 'e-state',
    type: ItemType.EVENT,
    category: 'modern',
    startYear: 1948,
    title: { en: 'Independence of Israel', he: 'הכרזת המדינה' },
    description: { en: 'The establishment of the modern State of Israel.', he: 'הקמת מדינת ישראל המודרנית.' },
    article: ISRAEL_ARTICLE
  }
];

export const fetchTimelineData = async (): Promise<TimelineItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_DATA), 500);
  });
};
