
import { Category } from './types';

export const CATEGORIES: Category[] = [
  { id: 'tanach', label: { en: 'Biblical / Tanach', he: 'תנ״ך' }, color: '#6366f1' },
  { id: 'temple', label: { en: 'Temple Eras', he: 'תקופות המקדש' }, color: '#f43f5e' },
  { id: 'diaspora', label: { en: 'Diaspora & Sages', he: 'גלות וחכמים' }, color: '#10b981' },
  { id: 'modern', label: { en: 'Modern Israel', he: 'ישראל המודרנית' }, color: '#f59e0b' },
];

export const UI_CONFIG = {
  TRACK_HEIGHT: 60,
  TRACK_PADDING: 12,
  TIMELINE_HEIGHT: 450,
  AXIS_HEIGHT: 60,
  MIN_YEAR: -2500,
  MAX_YEAR: 2100,
  INITIAL_ZOOM: 1,
};
