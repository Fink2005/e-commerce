type OrderItem = {
  productId: number;
  quantity: number;
  totalPrice: number;
  description: string;
};

export type Order = {
	id: number;
	createdAt: string;
  shippingAddress: string;
  totalAmount: number;
  order_items: OrderItem[];
	status: string;
};
