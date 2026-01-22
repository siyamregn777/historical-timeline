
export enum ItemType {
  EVENT = 'event',
  PERSON = 'person',
  PERIOD = 'period'
}

export interface LocalizedString {
  en: string;
  he: string;
}

export interface TimelineItem {
  id: string;
  type: ItemType;
  category: string;
  startYear: number;
  endYear?: number;
  title: LocalizedString;
  description: LocalizedString;
}

export interface Category {
  id: string;
  label: LocalizedString;
  color: string;
}

export type Language = 'en' | 'he';

export interface RenderableItem extends TimelineItem {
  track: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface TimelineRef {
  zoomIn: () => void;
  zoomOut: () => void;
  reset: () => void;
}
