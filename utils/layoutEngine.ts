
import { TimelineItem, Language } from '../types';

/**
 * Formats year to strictly "number BC" or "number AD"
 */
export const formatYear = (year: number, _lang: Language): string => {
  const absYear = Math.abs(year);
  if (year === 0) return '1 AD'; 
  return year < 0 ? `${absYear} BC` : `${absYear} AD`;
};
