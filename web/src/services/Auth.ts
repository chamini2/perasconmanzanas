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

  static getUser(): number | undefined {
    const decoded = TokenHandler.getDecoded();
    return decoded && decoded.user;
  }

  static async login(identifier: string, password: string): Promise<void> {
    const response = await axiosAPI.post('/api/authenticate', { identifier, password }, { responseType: 'text' });
    TokenHandler.storeToken(response.data);
  }

  static logout(): void {
    TokenHandler.removeToken();
  }

  static isLoggedIn(): boolean {
    return !!TokenHandler.getDecoded();
  }

  static getAccount(): string | undefined {
    const decoded = TokenHandler.getDecoded();
    return decoded && decoded.account;
  }

  static async setAccount(id: string): Promise<void> {
    const response = await axiosAPI.put('/api/account', { account: id }, { headers: authHeader(), responseType: 'text' });
    TokenHandler.storeToken(response.data);
  }

  static isAccountSet(): boolean {
    return !!Auth.getAccount();
  }

}

const TOKEN_KEY = 'token';

class TokenHandler {

  static getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  static getDecoded(): SessionToken | undefined {
    const token = TokenHandler.getToken();

    if (!token) {
      return undefined;
    }

    try {
      return decode(token);
    } catch (err) {
      console.error('Error decoding token. Logging out.');
      Auth.logout();
      return undefined;
    }
  }

  static storeToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  static removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  }

}
