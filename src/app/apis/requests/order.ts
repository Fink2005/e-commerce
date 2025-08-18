import apiRequest from '@/app/apis/apiRequest';
import type { Order } from '@/types/order';

export interface Order2 {
  id: string;
  customer: string;
  package: string;
  totalAmount: number;
  status: 'processing' | 'completed' | 'pending';
  createdAt: string;
}

export const orderRequest = {
  createOrder: async (data: Order): Promise<{ success: boolean } | null> => {
    return await apiRequest<{ success: boolean } | null>('/orders', 'POST', {
      ...data
    });
  },
  async getOrders(): Promise<Order2[] | null> {
    return await apiRequest<Order2[] | null>('/orders', 'GET');
  },
  async getMyOrders(): Promise<Order[] | null> {
    return await apiRequest<Order[] | null>('/orders/my-orders', 'GET');
  },
};
