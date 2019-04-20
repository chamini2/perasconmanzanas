import { axiosAPI } from './Request';
import decode from 'jwt-decode';

export type SessionRole = 'web_user' | 'web_admin';

// "exp": 1555714606
// "iat": 1555109806,
// "user": 10,
// "account": "zoi",
// "role": "web_user",
export interface SessionToken {
  exp: number; // Expiration
  iat: number; // Issued at
  user: number;
  account?: string;
  role: SessionRole;
};

export function authHeader() {
  return { Authorization: 'Bearer ' + TokenHandler.getToken() };
}

export default class Auth {

  static async login(identifier: string, password: string) {
    const response = await axiosAPI.post('/api/authenticate', { identifier, password }, { responseType: 'text' });
    TokenHandler.storeToken(response.data);
  }

  static logout() {
    TokenHandler.removeToken();
  }

  static isLoggedIn() {
    return TokenHandler.getDecoded() != null;
  }

  static getAccount() {
    const decoded = TokenHandler.getDecoded();
    const account = decoded && decoded.account;
    return account || null;
  }

  static async setAccount(id: string) {
    const response = await axiosAPI.put('/api/account', { account: id }, { headers: authHeader(), responseType: 'text' });
    TokenHandler.storeToken(response.data);
  }

  static isAccountSet() {
    return Auth.getAccount() != null;
  }

}

const TOKEN_KEY = 'token';

class TokenHandler {

  static getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  static getDecoded(): SessionToken | null {
    const token = TokenHandler.getToken();

    if (!token) {
      return null;
    }

    try {
      return decode(token);
    } catch (err) {
      console.error('Error decoding token. Logging out.');
      Auth.logout();
      return null;
    }
  }

  static storeToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  static removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  }

}
