type OrderItem = {
  productId: number;
  quantity: number;
  totalPrice: number;
  description: string;
};

export type Order = {
  shippingAddress: string;
  totalAmount: number;
  order_items: OrderItem[];
};
