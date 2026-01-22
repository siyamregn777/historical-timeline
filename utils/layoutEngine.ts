
import { TimelineItem, RenderableItem } from '../types';

/**
 * Assigns tracks (vertical lanes) to items to prevent overlapping.
 * This logic is rendering-agnostic and could be used for SVG, Canvas, or 3D.
 */
export const calculateLayout = (items: TimelineItem[]): RenderableItem[] => {
  // Sort items by start year to process chronologically
  const sorted = [...items].sort((a, b) => a.startYear - b.startYear);
  
  const tracks: number[] = []; // Stores the 'endYear' for each track
  const renderable: RenderableItem[] = [];

  sorted.forEach((item) => {
    const start = item.startYear;
    const end = item.endYear || item.startYear + 5; // Buffer for events to treat them as small spans

    // Find first available track
    let trackIndex = tracks.findIndex((trackEndYear) => start > trackEndYear + 2); // 2-year padding

    if (trackIndex === -1) {
      // Create a new track
      trackIndex = tracks.length;
      tracks.push(end);
    } else {
      // Update existing track with new end year
      tracks[trackIndex] = end;
    }

    renderable.push({
      ...item,
      track: trackIndex,
    });
  });

  return renderable;
};

/**
 * Format year display based on language and magnitude
 */
export const formatYear = (year: number, lang: 'en' | 'he'): string => {
  const absYear = Math.abs(year);
  const suffix = year < 0 
    ? (lang === 'en' ? ' BCE' : ' לפנה״ס') 
    : (lang === 'en' ? '' : '');
    
  return `${absYear}${suffix}`;
};
