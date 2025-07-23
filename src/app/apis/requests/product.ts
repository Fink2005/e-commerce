import apiRequest from '@/app/apis/apiRequest';
import type { ProductResponse, ProductType } from '@/types/product';

export const productRequests = {
  async getProductsByType(type: ProductType): Promise<ProductResponse[]> {
    try {
      const result = await apiRequest<ProductResponse[]>(`products?productType=${type}`, 'GET');
      return result ?? [];
    } catch (error) {
      console.error('Get products request failed:', error);
      throw error;
    }
  },
  async getProductById(productType: string, productId: number): Promise<ProductResponse | null> {
    try {
      return await apiRequest<ProductResponse>(`products/${productType}/${productId}`, 'GET');
    } catch (error) {
      console.error(`Get product by ID request failed for ${productType}/${productId}:`, error);
      throw error;
    }
  }
};
