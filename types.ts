
import * as d3 from 'd3';

export enum ItemType {
  EVENT = 'event',
  PERSON = 'person',
  PERIOD = 'period',
  CLUSTER = 'cluster'
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
  clusterCount?: number;
}

export interface SimulationNode extends d3.SimulationNodeDatum {
  id: string;
  item: TimelineItem;
  width: number;
  height: number;
  targetX: number;
  targetY: number;
  opacity: number;
  isCluster?: boolean;
  clusterItems?: TimelineItem[];
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
  setZoomScale: (scale: number) => void;
  jumpToYear: (year: number) => void;
}

export type ViewState = 'timeline' | 'article' | 'admin' | 'profile';
