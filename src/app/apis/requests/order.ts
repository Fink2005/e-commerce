import apiRequest from '@/app/apis/apiRequest';
import type { Order } from '@/types/order';

export const orderRequest = {
  createOrder: async (data: Order): Promise<{ success: boolean } | null> => {
    return await apiRequest<{ success: boolean } | null>('/orders', 'POST', {
      ...data
    });
  }
};
