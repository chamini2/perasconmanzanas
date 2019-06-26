import { axiosPG, preferHeader } from './Request';
import { authHeader } from './Auth';
import { Account } from './AccountsService';
import { Timestamp } from '../types';

export interface Product {
  sku: string;
  description: string;
  created_at: Timestamp;
  account_id: Account['id'];
}

export interface ProductView extends Product {
  stock: number;
}

export default class ProductsService {

  static async fetchAllProducts() {
    const res = await axiosPG.get<ProductView[]>('/products_view', {
      headers: {
        ...authHeader(),
      },
      params: {
        order: 'created_at.desc'
      }
    });

    return res.data;
  }

  static async fetchProduct(sku: Product['sku']) {
    const res = await axiosPG.get<ProductView[]>('/products_view', {
      headers: {
        ...authHeader(),
      },
      params: {
        sku: 'eq.' + sku
      }
    });

    return res.data[0];
  }

  static async postProduct(payload: Partial<Product>) {
    const res = await axiosPG.post<Product[]>('/products', payload, {
      headers: {
        ...authHeader(),
        ...preferHeader({ return: 'representation' })
      }
    });

    return res.data[0];
  }

}
