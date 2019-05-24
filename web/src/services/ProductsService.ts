import { axiosPG, preferHeader } from './Request';
import { authHeader } from './Auth';

export interface Product {
  sku: string;
  description: string;
  created_at: string;
  account_id: string;
}

export default class ProductsService {

  static async fetchAllProducts(order: keyof Product = 'created_at') {
    const res = await axiosPG.get<Product[]>('/products', {
      headers: authHeader(),
      params: { order }
    });

    return res.data;
  }

  static async fetchProduct(sku: Product['sku']) {
    const res= await axiosPG.get<Product[]>('/products', {
      headers: authHeader(),
      params: {
        sku: 'eq.' + sku
      }
    });

    return res.data[0];
  }

  static async postProduct(payload: Partial<Product>) {
    const res = await axiosPG.post<Account[]>('/products', payload, {
      headers: {
        ...authHeader(),
        ...preferHeader('representation')
      }
    });

    return res.data[0];
  }

}
