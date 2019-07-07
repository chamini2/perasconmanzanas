import { es } from 'date-fns/locale';

export const STRINGS = {
  UNKNOWN_ERROR: 'Error inesperado, avísale a los desarrolladores',
  MUST_BE_ADMIN: 'Debes ser administrador de la cuenta'
};

export const MIN_PASSWORD_LENGTH = 6;

export const DATE_LOCALE = es;
export const LOCALE = 'es';
// export const DATE_FORMAT = "dd 'de' MMMM 'del' yyyy";
export const DATE_FORMAT = "dd/MM/yyyy";
export const TIMESTAMP_FORMAT = "hh:mm:ss a 'el' " + DATE_FORMAT;

export const CONTACT_EMAIL = 'hola@perasconmanzanas.com';
export const CONTACT_TWITTER = 'chamini2';

export const BASE_WEB_URL = process.env.REACT_APP_BASE_WEB_URL;
export const BASE_POSTGREST_URL = process.env.REACT_APP_BASE_POSTGREST_URL;
export const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

export const GOOGLE_ANALYTICS_KEY = 'UA-69937814-3';
