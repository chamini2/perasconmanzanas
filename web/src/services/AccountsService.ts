import { axiosPostgrest } from './Request';
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
    return await axiosPostgrest.get<Account[]>('/accounts', {
      headers: authHeader(),
      params: {
        order: 'created_at'
      }
    });
  }

  static async fetchAccount(id: string) {
    const account = await axiosPostgrest.get<Account[]>('/accounts', {
      headers: authHeader(),
      params: {
        id: 'eq.' + id
      }
    });

    return account.data[0];
  }

}
