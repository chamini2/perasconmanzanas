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

  static subscribe(symbol: Symbol, cb: (event: AuthEvent) => void): void {
    TokenHandler.subscribe(symbol, cb);
  }

  static unsubscribe(symbol: Symbol): void {
    TokenHandler.unsubscribe(symbol);
  }

}

const TOKEN_KEY = 'token';

export type AuthEvent = 'SET' | 'REMOVED';

class TokenHandler {

  private static subscribers: Map<Symbol, (event: AuthEvent) => void> = new Map();

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
    TokenHandler.notify('SET');
  }

  static removeToken() {
    localStorage.removeItem(TOKEN_KEY);
    TokenHandler.notify('REMOVED');
  }

  static subscribe(symbol: Symbol, cb: (event: AuthEvent) => void) {
    TokenHandler.subscribers.set(symbol, cb);
  }

  static unsubscribe(symbol: Symbol) {
    TokenHandler.subscribers.delete(symbol);
  }

  static notify(event: AuthEvent) {
    TokenHandler.subscribers.forEach((cb) => {
      cb(event);
    });
  }

}
