
import { TimelineItem, ItemType } from '../types';

const MOCK_DATA: TimelineItem[] = [
  // Periods
  {
    id: 'p1',
    type: ItemType.PERIOD,
    category: 'politics',
    startYear: -753,
    endYear: 476,
    title: { en: 'Roman Empire', he: 'האימפריה הרומית' },
    description: { en: 'The period of Roman political hegemony in Europe, Africa, and Asia.', he: 'תקופת ההגמוניה הפוליטית הרומית באירופה, אפריקה ואסיה.' }
  },
  {
    id: 'p2',
    type: ItemType.PERIOD,
    category: 'culture',
    startYear: 1400,
    endYear: 1600,
    title: { en: 'The Renaissance', he: 'הרנסאנס' },
    description: { en: 'A fervent period of European cultural, artistic, political and economic "rebirth".', he: 'תקופת "לידה מחדש" תרבותית, אמנותית, פוליטית וכלכלית באירופה.' }
  },
  {
    id: 'p3',
    type: ItemType.PERIOD,
    category: 'religion',
    startYear: -586,
    endYear: 70,
    title: { en: 'Second Temple Period', he: 'תקופת בית שני' },
    description: { en: 'A period in Jewish history between 516 BCE and 70 CE.', he: 'תקופה בתולדות עם ישראל בין 516 לפנה"ס ל-70 לספירה.' }
  },
  // People
  {
    id: 'per1',
    type: ItemType.PERSON,
    category: 'religion',
    startYear: -1813,
    endYear: -1638,
    title: { en: 'Abraham', he: 'אברהם אבינו' },
    description: { en: 'The common patriarch of the Abrahamic religions.', he: 'האב המשותף של הדתות האברהמיות.' }
  },
  {
    id: 'per2',
    type: ItemType.PERSON,
    category: 'culture',
    startYear: 1452,
    endYear: 1519,
    title: { en: 'Leonardo da Vinci', he: 'לאונרדו דה וינצ\'י' },
    description: { en: 'Italian polymath of the High Renaissance.', he: 'איש אשכולות איטלקי מתקופת הרנסאנס.' }
  },
  {
    id: 'per3',
    type: ItemType.PERSON,
    category: 'politics',
    startYear: 1809,
    endYear: 1865,
    title: { en: 'Abraham Lincoln', he: 'אברהם לינקולן' },
    description: { en: '16th president of the United States.', he: 'הנשיא ה-16 של ארצות הברית.' }
  },
  // Events
  {
    id: 'e1',
    type: ItemType.EVENT,
    category: 'war',
    startYear: 1914,
    endYear: 1918,
    title: { en: 'World War I', he: 'מלחמת העולם הראשונה' },
    description: { en: 'Global war that lasted from 1914 to 1918.', he: 'מלחמה עולמית שנמשכה בין 1914 ל-1918.' }
  },
  {
    id: 'e2',
    type: ItemType.EVENT,
    category: 'culture',
    startYear: 1969,
    title: { en: 'Moon Landing', he: 'הנחיתה על הירח' },
    description: { en: 'Apollo 11 mission lands the first humans on the Moon.', he: 'משימת אפולו 11 מנחיתה את בני האדם הראשונים על הירח.' }
  },
  {
    id: 'e3',
    type: ItemType.EVENT,
    category: 'politics',
    startYear: 1776,
    title: { en: 'Declaration of Independence', he: 'הכרזת העצמאות של ארה"ב' },
    description: { en: 'The 13 colonies declare independence from Britain.', he: '13 המושבות מכריזות על עצמאות מבריטניה.' }
  },
  {
    id: 'e4',
    type: ItemType.EVENT,
    category: 'religion',
    startYear: -1250,
    title: { en: 'The Exodus', he: 'יציאת מצרים' },
    description: { en: 'The departure of the Israelites from Egypt.', he: 'יציאת בני ישראל ממצרים.' }
  }
];

export const fetchTimelineData = async (): Promise<TimelineItem[]> => {
  // Simulate network latency
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_DATA), 500);
  });
};
