import { axiosPG, preferHeader, axiosAPI } from './Request';
import { authHeader } from './Auth';
import { Timestamp } from '../types';
import { Account } from './AccountsService';
import { User } from './UsersService';

export interface Invite {
  id: string;
  notes: string;
  created_at: Timestamp;
  claimed_at: Timestamp;
  claimed_by_id: User['id'];
  claimed_by?: User;
  account_id: Account['id'];
}

const SELECT_STATEMET = '*,claimed_by:users(*)'

export default class InvitesService {

  static async fetchInvite(account: string, id: string) {
    const res = await axiosAPI.get<Invite>(`/api/accounts/${account}/invites/${id}`, {
      headers: {
        ...authHeader(),
      }
    });

    return res.data;
  }

  static async claimInvite(account: string, id: string) {
    const res = await axiosAPI.post<Invite>(`/api/accounts/${account}/invites/${id}`, null, {
      headers: {
        ...authHeader(),
      }
    });

    return res.data;
  }

  static async fetchUnclaimedInvites() {
    return await axiosPG.get<Invite[]>('/invites', {
      headers: {
        ...authHeader(),
      },
      params: {
        select: SELECT_STATEMET,
        order: 'created_at.desc',
        claimed_at: 'is.null'
      }
    });
  }

  static async fetchClaimedInvites() {
    return await axiosPG.get<Invite[]>('/invites', {
      headers: {
        ...authHeader(),
      },
      params: {
        select: SELECT_STATEMET,
        order: 'claimed_at.desc',
        claimed_at: 'not.is.null'
      }
    });
  }

  static async postInvite(payload: Partial<Invite>): Promise<Invite> {
    const res = await axiosPG.post<Invite[]>('/invites', payload, {
      headers: {
        ...authHeader(),
        ...preferHeader({ return: 'representation' })
      }
    });

    return res.data[0];
  }

  static async patchInvite(id: Invite['id'], payload: Partial<Invite>): Promise<Invite | undefined> {
    const res = await axiosPG.patch<Invite[]>('/invites', payload, {
      headers: {
        ...authHeader(),
        ...preferHeader({ return: 'representation' })
      },
      params: {
        id: 'eq.' + id
      }
    });

    return res.data[0];
  }

  static async deleteInvite(id: Invite['id']): Promise<Invite | undefined> {
    const res = await axiosPG.delete('/invites', {
      headers: {
        ...authHeader(),
        ...preferHeader({ return: 'representation' })
      },
      params: {
        id: 'eq.' + id
      }
    });

    return res.data[0];
  }

}
