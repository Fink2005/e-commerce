// @/app/apis/requests/order.ts

import apiRequest from '@/app/apis/apiRequest';
import type { Order } from '@/types/order';

// Define the Order type to match the structure used in CRMDashboard
export interface Order {
  id: string;
  customer: string;
  package: string;
  amount: number;
  status: 'processing' | 'completed' | 'pending';
  date: string;
}

const orderRequests = {
  async getOrders(): Promise<Order[] | null> {
    return await apiRequest<Order[] | null>('/orders', 'GET');
  },
};

export default orderRequests;