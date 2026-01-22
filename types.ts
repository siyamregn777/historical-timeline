
export enum ItemType {
  EVENT = 'event',     // Point in time
  PERSON = 'person',   // Lifespan
  PERIOD = 'period'    // Historical era
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
  endYear?: number;    // Optional for events
  title: LocalizedString;
  description: LocalizedString;
  tags?: string[];
}

export interface Category {
  id: string;
  label: LocalizedString;
  color: string;
}

export type Language = 'en' | 'he';

export interface ViewportState {
  scale: number;
  translateX: number;
}

export interface RenderableItem extends TimelineItem {
  track: number; // Vertical position level
}
