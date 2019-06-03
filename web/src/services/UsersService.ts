import { axiosPG, preferHeader } from './Request';
import { authHeader } from './Auth';
import { Timestamp } from '../types';

export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  created_at: Timestamp;
}

export default class UsersService {

  static async fetchUser(id: User['id']) {
    const res = await axiosPG.get<User[]>('/users', {
      headers: authHeader(),
      params: {
        id: `eq.${id}`
      }
    });

    return res.data[0];
  }

  static async patchUser(id: User['id'], user: Partial<User>) {
    const res = await axiosPG.patch<User[]>('/users', user, {
      headers: {
        ...authHeader(),
        ...preferHeader({ return: 'representation' })
      },
      params: {
        id: `eq.${id}`
      }
    });

    return res.data[0];
  }

}
