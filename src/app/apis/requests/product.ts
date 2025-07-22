import apiRequest from '@/app/apis/apiRequest';
import type { BaseProduct, ProductResponse } from '@/types/product';

export const productRequests = {
  async getProducts(): Promise<ProductResponse | null> {
    try {
      return await apiRequest<ProductResponse>('products', 'GET');
    } catch (error) {
      console.error('Get products request failed:', error);
      throw error;
    }
  },
  async getProductById(productType: string, productId: number): Promise<BaseProduct | null> {
    try {
      return await apiRequest<BaseProduct>(`products/${productType}/${productId}`, 'GET');
    } catch (error) {
      console.error(`Get product by ID request failed for ${productType}/${productId}:`, error);
      throw error;
    }
  }
};
