
import { Language } from '../types';

/**
 * Formats year to localized "BC/AD" or "לפנה״ס/לספירה"
 */
export const formatYear = (year: number, lang: Language): string => {
  const absYear = Math.abs(year);
  const isHebrew = lang === 'he';

  if (year === 0) {
    return isHebrew ? '1 לספירה' : '1 AD';
  }

  if (year < 0) {
    return isHebrew ? `${absYear} לפנה״ס` : `${absYear} BC`;
  }

  // Conventionally, AD is often omitted for positive years in Hebrew unless needed
  return isHebrew ? `${absYear} לספירה` : `${absYear} AD`;
};
