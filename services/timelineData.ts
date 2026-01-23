
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

const BABYLON_EXILE_ARTICLE: ArticleContent = {
  intro: {
    en: "The Babylonian Exile was a pivotal period where Jewish life shifted from a Temple-centered worship to a focus on prayer and study.",
    he: "גלות בבל הייתה תקופת מפתח שבה החיים היהודיים עברו מפולחן סביב המקדש להתמקדות בתפילה ולימוד."
  },
  sections: [
    {
      title: { en: "By the Rivers of Babylon", he: "על נהרות בבל" },
      content: { 
        en: "Despite the tragedy of destruction, this era saw the compilation of significant biblical texts and the preservation of identity.",
        he: "למרות טרגדיית החורבן, תקופה זו ראתה את עריכתם של טקסטים מקראיים משמעותיים ושמירה על הזהות."
      }
    }
  ],
  conclusion: {
    en: "The return to Zion under Cyrus the Great marked the beginning of the Second Temple era.",
    he: "השיבה לציון תחת הצהרת כורש סימנה את תחילת ימי הבית השני."
  }
};

const SECOND_TEMPLE_DESTRUCTION_ARTICLE: ArticleContent = {
  intro: {
    en: "The destruction of the Second Temple in 70 CE by the Romans led to the long dispersion of the Jewish people.",
    he: "חורבן בית המקדש השני בשנת 70 לספירה בידי הרומאים הוביל לפיזור הממושך של עם ישראל בגולה."
  },
  sections: [
    {
      title: { en: "The Siege of Jerusalem", he: "המצור על ירושלים" },
      content: { 
        en: "The fall of the city followed years of internal strife and a fierce rebellion against Roman rule.",
        he: "נפילת העיר הגיעה לאחר שנים של מאבקים פנימיים ומרד עז נגד השלטון הרומי."
      }
    }
  ],
  conclusion: {
    en: "This event forced the evolution of Judaism into a mobile, text-based faith that could survive anywhere.",
    he: "אירוע זה אילץ את היהדות להתפתח לאמונה ניידת מבוססת טקסט שיכולה לשרוד בכל מקום."
  }
};

const GOLDEN_AGE_SPAIN_ARTICLE: ArticleContent = {
  intro: {
    en: "The Golden Age of Spain was a period of cultural and intellectual flourishing for Jews in the Iberian Peninsula.",
    he: "תור הזהב בספרד היה תקופה של פריחה תרבותית ואינטלקטואלית עבור היהודים בחצי האי האיברי."
  },
  sections: [
    {
      title: { en: "Poetry and Philosophy", he: "שירה ופילוסופיה" },
      content: { 
        en: "Figures like Judah Halevi and Ibn Gabirol merged Jewish tradition with Arabic poetic and philosophical forms.",
        he: "דמויות כמו יהודה הלוי ואבן גבירול מיזגו את המסורת היהודית עם צורות שירה ופילוסופיה ערביות."
      }
    }
  ],
  conclusion: {
    en: "This era remains a model for Jewish integration and cultural synthesis.",
    he: "תקופה זו נותרה מודל להשתלבות יהודית וסינתזה תרבותית."
  }
};

const ZIONIST_CONGRESS_ARTICLE: ArticleContent = {
  intro: {
    en: "The First Zionist Congress in 1897 organized the Jewish national movement to re-establish a homeland in Israel.",
    he: "הקונגרס הציוני הראשון בשנת 1897 ארגן את התנועה הלאומית היהודית להקמה מחדש של בית לאומי בארץ ישראל."
  },
  sections: [
    {
      title: { en: "Herzl's Vision", he: "חזונו של הרצל" },
      content: { 
        en: "The Basel Program defined the goal of Zionism: a publicly recognized, legally secured home in Palestine.",
        he: "תוכנית באזל הגדירה את מטרת הציונות: בית מובטח על פי משפט הכלל בארץ ישראל."
      }
    }
  ],
  conclusion: {
    en: "In Basel I founded the Jewish State. If I said this out loud today, I would be greeted by universal laughter.",
    he: "בבאזל יסדתי את מדינת היהודים. אילו אמרתי זאת היום בקול, היו הכל צוחקים לי."
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
    id: 'p-first-temple',
    type: ItemType.PERIOD,
    category: 'temple',
    startYear: -957,
    endYear: -586,
    title: { en: 'First Temple Period', he: 'בית ראשון' },
    description: { en: 'The era of the Temple built by King Solomon in Jerusalem.', he: 'תקופת המקדש שנבנה על ידי שלמה המלך בירושלים.' },
    article: {
        intro: { en: "The era of the First Temple represents the height of the early Israelite monarchy.", he: "תקופת בית ראשון מייצגת את שיאה של המלוכה הישראלית הקדומה." },
        sections: [{ title: {en:"Jerusalem", he:"ירושלים"}, content: {en:"Establishment of the capital city.", he: "ייסוד עיר הבירה."}}],
        conclusion: { en: "Destroyed by Babylon in 586 BCE.", he: "נחרב בידי בבל בשנת 586 לפנה״ס." }
    }
  },
  {
    id: 'e-babylon-exile',
    type: ItemType.EVENT,
    category: 'temple',
    startYear: -586,
    title: { en: 'Babylonian Exile', he: 'גלות בבל' },
    description: { en: 'The displacement of the Jewish leadership to Babylon.', he: 'גלות הנהגת העם לבבל.' },
    article: BABYLON_EXILE_ARTICLE
  },
  {
    id: 'p-second-temple',
    type: ItemType.PERIOD,
    category: 'temple',
    startYear: -516,
    endYear: 70,
    title: { en: 'Second Temple Period', he: 'בית שני' },
    description: { en: 'The era following the return from Babylon until the Roman destruction.', he: 'התקופה שלאחר השיבה מבבל ועד לחורבן על ידי הרומאים.' },
  },
  {
    id: 'e-destruction-70',
    type: ItemType.EVENT,
    category: 'temple',
    startYear: 70,
    title: { en: 'Destruction of Second Temple', he: 'חורבן בית שני' },
    description: { en: 'The fall of Jerusalem to the Roman legions.', he: 'נפילת ירושלים לידי הלגיונות הרומיים.' },
    article: SECOND_TEMPLE_DESTRUCTION_ARTICLE
  },
  {
    id: 'p-golden-age',
    type: ItemType.PERIOD,
    category: 'diaspora',
    startYear: 900,
    endYear: 1150,
    title: { en: 'Golden Age of Spain', he: 'תור הזהב בספרד' },
    description: { en: 'A cultural explosion of Jewish philosophy, science, and poetry.', he: 'פריחה תרבותית של פילוסופיה, מדע ושירה יהודית.' },
    article: GOLDEN_AGE_SPAIN_ARTICLE
  },
  {
    id: 'per-rambam',
    type: ItemType.PERSON,
    category: 'diaspora',
    startYear: 1135,
    endYear: 1204,
    title: { en: 'Maimonides (Rambam)', he: 'רמב"ם' },
    description: { en: 'Preeminent medieval Sephardic Jewish philosopher and physician.', he: 'פילוסוף ורופא יהודי ספרדי בולט בימי הביניים.' },
  },
  {
    id: 'e-zionist-congress',
    type: ItemType.EVENT,
    category: 'modern',
    startYear: 1897,
    title: { en: 'First Zionist Congress', he: 'הקונגרס הציוני הראשון' },
    description: { en: 'The formal organization of the movement for Jewish national return.', he: 'ההתארגנות הרשמית של התנועה לשיבה לאומית יהודית.' },
    article: ZIONIST_CONGRESS_ARTICLE
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
