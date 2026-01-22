
import { TimelineItem, ItemType } from '../types';

const MOCK_DATA: TimelineItem[] = [
  // Biblical Periods
  {
    id: 'p-patriarchs',
    type: ItemType.PERIOD,
    category: 'tanach',
    startYear: -2100,
    endYear: -1800,
    title: { en: 'Age of the Patriarchs', he: 'תקופת האבות' },
    description: { en: 'The formative era of Abraham, Isaac, and Jacob.', he: 'תקופת אברהם, יצחק ויעקב.' }
  },
  {
    id: 'p-temple1',
    type: ItemType.PERIOD,
    category: 'temple',
    startYear: -957,
    endYear: -586,
    title: { en: 'First Temple Era', he: 'תקופת בית ראשון' },
    description: { en: 'The era of the Temple built by Solomon until its destruction by Babylon.', he: 'תקופת בית המקדש שבנה שלמה ועד חורבנו על ידי בבל.' }
  },
  {
    id: 'p-temple2',
    type: ItemType.PERIOD,
    category: 'temple',
    startYear: -516,
    endYear: 70,
    title: { en: 'Second Temple Era', he: 'תקופת בית שני' },
    description: { en: 'From the Return to Zion until the Roman destruction of Jerusalem.', he: 'משבת ציון ועד חורבן ירושלים על ידי הרומאים.' }
  },
  // People
  {
    id: 'per-moshe',
    type: ItemType.PERSON,
    category: 'tanach',
    startYear: -1391,
    endYear: -1271,
    title: { en: 'Moses', he: 'משה רבנו' },
    description: { en: 'Leader of the Exodus and the receiver of the Torah at Sinai.', he: 'מנהיג יציאת מצרים ומקבל התורה בסיני.' }
  },
  {
    id: 'per-rambam',
    type: ItemType.PERSON,
    category: 'diaspora',
    startYear: 1135,
    endYear: 1204,
    title: { en: 'Maimonides (Rambam)', he: 'רמב"ם' },
    description: { en: 'Preeminent medieval Sephardic Jewish philosopher and physician.', he: 'פילוסוף ורופא יהודי ספרדי בולט בימי הביניים.' }
  },
  {
    id: 'per-herzl',
    type: ItemType.PERSON,
    category: 'modern',
    startYear: 1860,
    endYear: 1904,
    title: { en: 'Theodor Herzl', he: 'בנימין זאב הרצל' },
    description: { en: 'Father of modern political Zionism.', he: 'אבי הציונות המדינית המודרנית.' }
  },
  // Events
  {
    id: 'e-exodus',
    type: ItemType.EVENT,
    category: 'tanach',
    startYear: -1313,
    title: { en: 'The Exodus', he: 'יציאת מצרים' },
    description: { en: 'The miraculous departure of the Israelites from Egyptian slavery.', he: 'יציאת בני ישראל ממצרים מעבדות לחירות.' }
  },
  {
    id: 'e-hannukah',
    type: ItemType.EVENT,
    category: 'temple',
    startYear: -164,
    title: { en: 'Maccabean Revolt', he: 'מרד החשמונאים' },
    description: { en: 'The rededication of the Second Temple in Jerusalem.', he: 'חנוכת המזבח בבית המקדש השני.' }
  },
  {
    id: 'e-state',
    type: ItemType.EVENT,
    category: 'modern',
    startYear: 1948,
    title: { en: 'Independence of Israel', he: 'הכרזת המדינה' },
    description: { en: 'The establishment of the modern State of Israel.', he: 'הקמת מדינת ישראל המודרנית.' }
  }
];

export const fetchTimelineData = async (): Promise<TimelineItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_DATA), 500);
  });
};
