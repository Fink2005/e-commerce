import apiRequest from '@/app/apis/apiRequest';
import type { ProductResponse } from '@/types/product';
import { ProductType } from '@/types/product';

export const productRequests = {
  async getProductsByType(type: ProductType = ProductType.ALL): Promise<ProductResponse[] | null> {
    return await apiRequest<ProductResponse[] | null>(`products?productType=${type}`, 'GET');
  },
  async getProductById(productId: number): Promise<ProductResponse | null> {
    return await apiRequest<ProductResponse>(`products/${productId}`, 'GET');
  }
};
