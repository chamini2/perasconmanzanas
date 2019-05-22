import { axiosPG, preferHeader } from './Request';
import { authHeader } from './Auth';

export interface Account {
  id: string;
  name: string;
  created_at: string;
  owner_id: number;
  // TODO: add User type and owner fetching?
  // owner?: User;
}

export default class AccountsService {

  static async fetchAllAccounts() {
    return await axiosPG.get<Account[]>('/accounts', {
      headers: authHeader(),
      params: {
        order: 'created_at'
      }
    });
  }

  static async fetchAccount(id: Account['id']) {
    const res = await axiosPG.get<Account[]>('/accounts', {
      headers: authHeader(),
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
        ...preferHeader('representation')
      }
    });

    return res.data[0];
  }

}
