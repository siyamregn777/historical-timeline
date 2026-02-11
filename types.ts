
import * as d3 from 'd3';

export type Language = 'en' | 'he';
export type ViewState = 'timeline' | 'article';

export enum ItemType {
  EVENT = 'event',
  PERSON = 'person',
  PERIOD = 'period',
  ERA = 'era'
}

export interface LocalizedString {
  en: string;
  he: string;
}

export interface Category {
  id: string;
  label: LocalizedString;
  color: string;
}

export interface TimelineItem {
  id: string;
  type: ItemType;
  category: string;
  startYear: number;
  endYear?: number;
  title: LocalizedString;
  summary: LocalizedString;
  description: LocalizedString;
  imageUrl?: string;
  
  // Map Logic Properties
  importance: number;      // 1-100
  zoomLevelMin: number;    // Scale at which it appears
  zoomLevelMax: number;    // Scale at which it disappears
}

export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  photoURL?: string;
}

export interface TimelineRef {
  zoomIn: () => void;
  zoomOut: () => void;
  reset: () => void;
  setZoomScale: (scale: number) => void;
  jumpToYear: (year: number) => void;
}
