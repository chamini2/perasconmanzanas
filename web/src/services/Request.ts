import axios, { AxiosInstance, AxiosRequestConfig, AxiosPromise } from 'axios';

const BASE_API_URL = 'http://localhost:5000';
const BASE_POSTGREST_URL = 'http://localhost:4000';

export const axiosAPI = axios.create({
  baseURL: BASE_API_URL
});

export type PostgRESTRow = {
  [field: string]: any;
}

export interface PostgRESTAxiosInstance extends AxiosInstance {
  get<T = PostgRESTRow[]>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>;
}

export const axiosPostgrest: PostgRESTAxiosInstance = axios.create({
  baseURL: BASE_POSTGREST_URL
});
