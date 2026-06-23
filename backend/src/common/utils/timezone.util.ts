import { formatISO, startOfDay } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { SAO_PAULO_TIMEZONE } from '../../config/timezone.config';

export const convertToSaoPauloISOString = (value: Date | string): string => {
  const date = typeof value === 'string' ? new Date(value) : value;
  const zoned = utcToZonedTime(date, SAO_PAULO_TIMEZONE);
  return formatISO(zoned, { representation: 'complete' });
};

export const getSaoPauloStartOfDayUtc = (value?: Date | string): Date => {
  const date = value ? (typeof value === 'string' ? new Date(value) : value) : new Date();
  const zoned = utcToZonedTime(date, SAO_PAULO_TIMEZONE);
  const start = startOfDay(zoned);
  return zonedTimeToUtc(start, SAO_PAULO_TIMEZONE);
};

export const getDayOfWeek = (value?: Date | string): string => {
  const date = value ? (typeof value === 'string' ? new Date(value) : value) : new Date();
  const zoned = utcToZonedTime(date, SAO_PAULO_TIMEZONE);
  return ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][
    zoned.getDay()
  ];
};

export const normalizeDateString = (value: Date | string): string =>
  convertToSaoPauloISOString(value);
