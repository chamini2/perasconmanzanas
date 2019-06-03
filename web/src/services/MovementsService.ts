import { axiosPG, preferHeader } from './Request';
import { authHeader } from './Auth';
import { Product } from './ProductsService';
import { Account } from './AccountsService';
import { User } from './UsersService';
import { Timestamp } from '../types';

export interface Movement {
  id: string;
  quantity: number;
  description: string;
  created_at: Timestamp;
  product_sku: Product['sku'];
  account_id: Account['id'];
  user_id: User['id'];
  user: User;
  product: Product;
}

const SELECT_STATEMET = '*,product:products(*),user:users(*)'

export default class MovementsService {

  static async fetchAllMovements(limit?: number, order: keyof Movement = 'created_at') {
    const res = await axiosPG.get<Movement[]>('/movements', {
      headers: authHeader(),
      params: {
        order,
        select: SELECT_STATEMET,
        limit
      }
    });

    return res.data;
  }

  static async fetchMovementsForProduct(product_sku: Movement['product_sku'], limit?: number, order: keyof Movement = 'created_at') {
    const res = await axiosPG.get<Movement[]>('/movements', {
      headers: authHeader(),
      params: {
        order,
        select: SELECT_STATEMET,
        product_sku: 'eq.' + product_sku,
        limit
      }
    });

    return res.data;
  }

  static async fetchMovement(id: number) {
    const res= await axiosPG.get<Movement[]>('/movements', {
      headers: authHeader(),
      params: {
        id: 'eq.' + id
      }
    });

    return res.data[0];
  }

  static async postMovement(payload: Partial<Movement>) {
    const res = await axiosPG.post<Account[]>('/movements', payload, {
      headers: {
        ...authHeader(),
        ...preferHeader('representation')
      }
    });

    return res.data[0];
  }

}
