
import * as d3 from 'd3';

export enum ItemType {
  ERA = 'era',
  PERIOD = 'period',
  EVENT = 'event',
  PERSON = 'person'
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
  summary: LocalizedString;
  description: LocalizedString;
  imageUrl?: string;
  
  // Map Logic Properties
  importance: number;      // 1-100 (100 is most important)
  zoomLevelMin: number;   // Minimum scale (k) to appear
  zoomLevelMax: number;   // Maximum scale (k) before disappearing (for merging)
  parentId?: string;      // For hierarchical drill-down
}

// Fixed missing User and UserRole types
export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  photoURL?: string;
}

// Local definition for SimulationNodeDatum to avoid D3 namespace resolution errors
export interface SimulationNodeDatum {
  index?: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface MapNode extends SimulationNodeDatum {
  id: string;
  item: TimelineItem;
  x: number;
  y: number;
  priority: number;
  visible: boolean;
  width: number;
  height: number;
}

export interface Category {
  id: string;
  label: LocalizedString;
  color: string;
}

export type Language = 'en' | 'he';
export type ViewState = 'timeline' | 'article';

export interface TimelineRef {
  zoomIn: () => void;
  zoomOut: () => void;
  reset: () => void;
  setZoomScale: (scale: number) => void;
  jumpToYear: (year: number) => void;
}
