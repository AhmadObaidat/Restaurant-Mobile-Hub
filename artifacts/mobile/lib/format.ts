import type { Language } from '@/data/restaurant-config';

export function formatJod(fils: number, language: Language) {
  return new Intl.NumberFormat(language === 'ar' ? 'ar-JO' : 'en-JO', {
    style: 'currency',
    currency: 'JOD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 3,
  }).format(fils / 1000);
}

export function formatDate(timestamp: number, language: Language) {
  return new Intl.DateTimeFormat(language === 'ar' ? 'ar-JO' : 'en-JO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(timestamp));
}
