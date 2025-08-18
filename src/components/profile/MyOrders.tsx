'use client';
import { orderRequest } from '@/app/apis/requests/order';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Order } from '@/types/order';
import { format } from 'date-fns';
import { Package } from 'lucide-react';
import { useEffect, useState } from 'react';
import OrderDetails from './OrderDetails';

export default function MyOrders() {
  const [currentView, setCurrentView] = useState('orders');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders when the component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await orderRequest.getMyOrders();
        if (response) {
          setOrders(response);
        } else {
          setError('No orders found.');
        }
      } catch {
        setError('Failed to fetch orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Adapt the Order type to match the OrderDetails component's expected structure
  const adaptOrderForDetails = (order: Order) => ({
    id: order.id,
    date: order.createdAt,
    description: '', // Use package as description
    amount: `$${order.totalAmount}`, // Format amount as currency
    status: order.status
  });

  const getStatusBadge = (status: string) => {
    const baseClasses = 'text-xs font-medium px-3 py-1 rounded-full';
    switch (status) {
      case 'Completed':
        return `${baseClasses} bg-black text-white`;
      case 'Delivered':
        return `${baseClasses} bg-gray-200 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-200 text-gray-800`;
    }
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(adaptOrderForDetails(order));
    setCurrentView('details');
  };

  const handleBackToOrders = () => {
    setCurrentView('orders');
    setSelectedOrder(null);
  };

  if (currentView === 'details') {
    return selectedOrder ? (
      <OrderDetails order={selectedOrder} onBack={handleBackToOrders} />
    ) : null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading && <p>Loading orders...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && orders.length === 0 && (
              <p>No orders available.</p>
            )}
            {!loading
              && orders.map(order => (
                <div key={order.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex">
                        <p className="font-medium">ORD-</p>
                        <p className="font-medium">
                          {' '}
                          {order.id}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600">{format(new Date(order.createdAt), 'yyyy-MM-dd HH:mm:ss')}</p>
                    </div>
                    <span className={getStatusBadge(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">
                      $
                      {order.totalAmount}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(order)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
