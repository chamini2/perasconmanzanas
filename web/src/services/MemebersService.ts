import { axiosPG } from './Request';
import { authHeader } from './Auth';
import { User } from './UsersService';

export default class MembersService {

  static async fetchMembersUserIds(account_id: Account['id']): Promise<User['id'][]> {
    const res = await axiosPG.get<any[]>('/accounts', {
      headers: authHeader(),
      params: {
        select: 'owner:users(id),members(user_id)',
        id: `eq.${account_id}`
      }
    });

    if (!res.data[0]) {
      return [];
    }

    const { owner, members } = res.data[0];
    return [owner.id, ...members.map((o: any) => o.user_id)];
  }

  static async removeMember(userId: User['id'], accountId: Account['id']) {
    return await axiosPG.delete('/members', {
      headers: {
        ...authHeader(),
      },
      params: {
        user_id: `eq.${userId}`,
        account_id: `eq.${accountId}`
      }
    });
  }

}
