import { axiosPG, preferHeader } from './Request';
import { authHeader } from './Auth';
import { User } from './UsersService';
import { Timestamp } from '../types';

export interface Account {
  id: string;
  name: string;
  created_at: Timestamp;
  owner_id: User['id'];
  // owner?: User;
}

export default class AccountsService {

  static async fetchAllAccounts() {
    return await axiosPG.get<Account[]>('/accounts', {
      headers: {
        ...authHeader(),
      },
      params: {
        order: 'created_at.desc'
      }
    });
  }

  static async fetchAccount(id: Account['id']) {
    const res = await axiosPG.get<Account[]>('/accounts', {
      headers: {
        ...authHeader(),
      },
      params: {
        id: 'eq.' + id
      }
    });

    return res.data[0];
  }

  static async postAccount(payload: Partial<Account>) {
    const res = await axiosPG.post<Account[]>('/accounts', payload, {
      headers: {
        ...authHeader(),
        ...preferHeader({ return: 'representation' })
      }
    });

    return res.data[0];
  }

}
