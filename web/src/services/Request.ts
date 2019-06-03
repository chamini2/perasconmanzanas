import axios, { AxiosInstance, AxiosRequestConfig, AxiosPromise, AxiosError, AxiosResponse } from 'axios';
import { STRINGS } from '../constants';
import AuthService from './Auth';
import { toast } from 'react-toastify';

const BASE_API_URL = 'http://localhost:5000';
const BASE_POSTGREST_URL = 'http://localhost:4000';

export const axiosAPI = axios.create({
  baseURL: BASE_API_URL,
  validateStatus: validateStatusSessionError
});

export type PostgRESTRow = {
  [field: string]: any;
}

export interface PostgRESTAxiosInstance extends AxiosInstance {
  get<T = PostgRESTRow[]>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>;
}

export const axiosPG: PostgRESTAxiosInstance = axios.create({
  baseURL: BASE_POSTGREST_URL,
  validateStatus: validateStatusSessionError
});

export interface PreferHeader {
  return?: 'representation';
  count?: 'exact';
}

export function preferHeader({ return: ret, count }: PreferHeader): { prefer: string } {
  const preferences: string[] = [];

  if (ret) {
    preferences.push(`return=${ret}`);
  }

  if (count) {
    preferences.push(`count=${count}`);
  }

  return { prefer: preferences.join(',') };
}

export function errorPGMessage(err: AxiosResponse): string {
  switch (typeof err.data) {
    case 'string': {
      return err.data;
    }
    case 'object': {
      if (typeof err.data.message === 'string' && err.data.message) {
        return err.data.message;
      } else if (typeof err.data.details === 'string' && err.data.details) {
        return err.data.details;
      } else {
        return JSON.stringify(err.data);
      }
    }
    default: {
      return STRINGS.UNKNOWN_ERROR;
    }
  }
}

export function defaultValidateStatus(status: number): boolean {
  return status >= 200 && status < 300;
}

export function validateStatusSessionError(status: number): boolean {
  if (status === 401) {
    toast('Tu sesión expiró', { type: 'error' });
    AuthService.logout();
  }

  return defaultValidateStatus(status);
}
