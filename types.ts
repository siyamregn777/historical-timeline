
export enum ItemType {
  EVENT = 'event',
  PERSON = 'person',
  PERIOD = 'period'
}

export interface LocalizedString {
  en: string;
  he: string;
}

export interface ArticleSection {
  title: LocalizedString;
  content: LocalizedString;
  listItems?: LocalizedString[];
}

export interface ArticleContent {
  intro: LocalizedString;
  sections: ArticleSection[];
  conclusion: LocalizedString;
}

export interface TimelineItem {
  id?: string;
  type: ItemType;
  category: string;
  startYear: number;
  endYear?: number;
  title: LocalizedString;
  description: LocalizedString;
  article?: ArticleContent;
}

// Fixed: Added missing RenderableItem interface used in layout calculation
export interface RenderableItem extends TimelineItem {
  track: number;
}

export interface Category {
  id: string;
  label: LocalizedString;
  color: string;
}

export type Language = 'en' | 'he';
export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface TimelineRef {
  zoomIn: () => void;
  zoomOut: () => void;
  reset: () => void;
}
