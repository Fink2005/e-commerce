'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';
import { useState } from 'react';
import OrderDetails from './OrderDetails';

export default function MyOrders() {
  const [currentView, setCurrentView] = useState('orders'); // 'orders' or 'details'
  const [selectedOrder, setSelectedOrder] = useState(null);

  const orders = [
    {
      id: 'ORD-2024-001',
      date: 'Jan 15, 2024',
      description: 'Mobile Plan Upgrade',
      amount: '$45.00',
      status: 'Completed'
    },
    {
      id: 'ORD-2024-002',
      date: 'Jan 15, 2024',
      description: 'Mobile Plan Upgrade',
      amount: '$45.00',
      status: 'Completed'
    },
    {
      id: 'ORD-2024-003',
      date: 'Jan 15, 2024',
      description: 'Mobile Plan Upgrade',
      amount: '$45.00',
      status: 'Delivered'
    }
  ];

  const getStatusBadge = (status) => {
    const baseClasses = "text-xs font-medium px-3 py-1 rounded-full";
    switch (status) {
      case 'Completed':
        return `${baseClasses} bg-black text-white`;
      case 'Delivered':
        return `${baseClasses} bg-gray-200 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-200 text-gray-800`;
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setCurrentView('details');
  };

  const handleBackToOrders = () => {
    setCurrentView('orders');
    setSelectedOrder(null);
  };

  if (currentView === 'details') {
    return <OrderDetails order={selectedOrder} onBack={handleBackToOrders} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Order History */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {orders.map((order, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-gray-600">{order.date}</p>
                  </div>
                  <span className={getStatusBadge(order.status)}>
                    {order.status}
                  </span>
                </div>
                
                <p className="text-sm">{order.description}</p>
                
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{order.amount}</span>
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