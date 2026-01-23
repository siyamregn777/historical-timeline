
import { TimelineItem, RenderableItem, Language } from '../types';
import { getI18n } from './i18n';

export const calculateLayout = (items: TimelineItem[]): RenderableItem[] => {
  const sorted = [...items].sort((a, b) => a.startYear - b.startYear);
  const tracks: number[] = []; 
  const renderable: RenderableItem[] = [];

  sorted.forEach((item) => {
    const start = item.startYear;
    const actualEnd = item.endYear || item.startYear;
    
    // Increased buffer based on title length estimation to prevent horizontal overlap
    const titleLength = (item.title.en.length + item.title.he.length) / 2;
    const labelBuffer = Math.max(120, titleLength * 8); 
    const effectiveEnd = Math.max(actualEnd, start + labelBuffer);

    // Find first track where the item fits with a safety margin
    let trackIndex = tracks.findIndex((trackEnd) => start > trackEnd + 15);

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

export const formatYear = (year: number, lang: Language): string => {
  const { t } = getI18n(lang);
  const absYear = Math.abs(year);
  const suffixKey = year < 0 ? 'timeline.bce' : 'timeline.ce';
  const suffix = t(suffixKey);
  return `${absYear}${suffix === suffixKey ? (year < 0 ? ' BCE' : '') : suffix}`;
};
