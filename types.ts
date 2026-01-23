
// Fix: Import d3 to resolve the 'Cannot find namespace d3' error in SimulationNode interface
import * as d3 from 'd3';

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
  importance: number; // 1 (Pillar) to 5 (Granular)
  startYear: number;
  endYear?: number;
  title: LocalizedString;
  summary: LocalizedString;
  description: LocalizedString;
  imageUrl?: string;
}

// Internal type for the D3 Force Simulation
export interface SimulationNode extends d3.SimulationNodeDatum {
  id: string;
  item: TimelineItem;
  width: number;
  height: number;
  importance: number;
  targetX: number;
  targetY: number;
  opacity: number;
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
  photoURL?: string;
}

export interface TimelineRef {
  zoomIn: () => void;
  zoomOut: () => void;
  reset: () => void;
}

export type ViewState = 'timeline' | 'article' | 'admin' | 'profile';
