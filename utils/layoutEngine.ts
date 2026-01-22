
import { TimelineItem, RenderableItem } from '../types';

/**
 * Assigns tracks to prevent overlapping.
 * We use an aggressive buffer for specific historical periods where density is high.
 */
export const calculateLayout = (items: TimelineItem[]): RenderableItem[] => {
  const sorted = [...items].sort((a, b) => a.startYear - b.startYear);
  const tracks: number[] = []; 
  const renderable: RenderableItem[] = [];

  sorted.forEach((item) => {
    const start = item.startYear;
    const actualEnd = item.endYear || item.startYear;
    
    // Heuristic: Titles are ~12px. We estimate "year-width" of a label.
    // Events need more horizontal space for their text than their "dot".
    // 80 years is a safe horizontal buffer for labels at default zoom.
    const labelBuffer = 90; 
    const effectiveEnd = Math.max(actualEnd, start + labelBuffer);

    // Find first track where this item fits with a safety gap
    let trackIndex = tracks.findIndex((trackEnd) => start > trackEnd + 5);

    if (trackIndex === -1) {
      trackIndex = tracks.length;
      tracks.push(effectiveEnd);
    } else {
      tracks[trackIndex] = effectiveEnd;
    }

    renderable.push({ ...item, track: trackIndex });
  });

  return renderable;
};

export const formatYear = (year: number, lang: 'en' | 'he'): string => {
  const absYear = Math.abs(year);
  const suffix = year < 0 
    ? (lang === 'en' ? ' BCE' : ' לפנה״ס') 
    : (lang === 'en' ? '' : '');
  return `${absYear}${suffix}`;
};
