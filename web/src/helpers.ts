import formatd from 'date-fns/format';
import { DATE_FORMAT, DATE_LOCALE, TIMESTAMP_FORMAT } from './constants';
import { Timestamp } from './types';

export function timestampDateFormat(ts: Timestamp) {
  return formatd(new Date(ts), DATE_FORMAT, { locale: DATE_LOCALE });
}

export function timestampTimestampFormat(ts: Timestamp) {
  return formatd(new Date(ts), TIMESTAMP_FORMAT, { locale: DATE_LOCALE });
}
