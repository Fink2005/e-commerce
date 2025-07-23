/* eslint-disable react/no-array-index-key */
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CheckCircle, Clock, Download, MapPin, Package, Truck } from 'lucide-react';

interface Order {
  id: string;
  status: string;
  // Add other properties of the order object as needed
}

export default function OrderDetails({ order, onBack }: { order: Order; onBack: () => void }) {
  const orderDetails = {
    id: order.id,
    date: 'Jan 15, 2024',
    status: order.status,
    items: [
      {
        name: 'Mobile Plan Upgrade',
        quantity: 1,
        price: '$45.00'
      }
    ],
    subtotal: '$89.99',
    mobileData: 'Free',
    broadband: '$0.00',
    total: '$45.00',
    tracking: {
      number: 'TRK-2024-789456123',
      carrier: 'Track with Carrier',
      timeline: [
        { status: 'Order Placed', date: 'Jan 15, 2024 - 10:30 AM', completed: true },
        { status: 'Payment Confirmed', date: 'Jan 15, 2024 - 10:30 AM', completed: true },
        { status: 'Processing', date: 'Jan 15, 2024 - 10:30 AM', completed: true },
        { status: 'Shipped', date: 'Jan 15, 2024 - 10:30 AM', completed: false },
        { status: 'Delivered', date: 'Jan 15, 2024 - 10:30 AM', completed: false }
      ]
    },
    delivery: {
      address: {
        name: 'John Smith',
        street: '123 Main Street, Apt 4B',
        city: 'New York, NY 10001',
        country: 'United States'
      },
      instructions: 'Leave at front door if no answer',
      estimated: 'Jan 18, 2024 between 2:00 PM - 6:00 PM'
    },
    payment: {
      method: '**** **** **** 1234',
      transactionId: 'TXN-789456123',
      status: 'Paid'
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        <div className="flex items-center p-4 border-b bg-white">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mr-3 p-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Order Details</h1>
        </div>

        <div className="p-4 space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{orderDetails.id}</p>
                  <p className="text-sm text-gray-600">
                    Placed on
                    {orderDetails.date}
                  </p>
                </div>
                <span className={getStatusBadge(orderDetails.status)}>
                  {orderDetails.status}
                </span>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">Mobile Plan Upgrade</span>
                  <span className="font-medium">$45.00</span>
                </div>
                <p className="text-sm text-gray-600">Quantity: 1</p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>$89.99</span>
                </div>
                <div className="flex justify-between">
                  <span>Mobile Data (20 GB)</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Broadband (100 Mbps)</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between font-semibold text-base border-t pt-2">
                  <span>Total</span>
                  <span>$45.00</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tracking Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Tracking Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Tracking Number</span>
                </div>
                <p className="text-sm mb-2">TRK-2024-789456123</p>
                <Button variant="outline" size="sm" className="text-xs">
                  Track with Carrier
                </Button>
              </div>

              <div className="space-y-3">
                {orderDetails.tracking.timeline.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    {item.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <Clock className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    )}
                    <div>
                      <p className="text-sm font-medium">{item.status}</p>
                      <p className="text-xs text-gray-600">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Delivery Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Delivery Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium mb-2">Delivery Address</p>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>{orderDetails.delivery.address.name}</p>
                  <p>{orderDetails.delivery.address.street}</p>
                  <p>{orderDetails.delivery.address.city}</p>
                  <p>{orderDetails.delivery.address.country}</p>
                </div>
              </div>

              <div>
                <p className="font-medium mb-2">Delivery Instructions</p>
                <p className="text-sm text-gray-600">{orderDetails.delivery.instructions}</p>
              </div>

              <div>
                <p className="font-medium mb-2">Estimated Delivery</p>
                <p className="text-sm text-gray-600">{orderDetails.delivery.estimated}</p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Payment Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Payment Method</span>
                  <span>{orderDetails.payment.method}</span>
                </div>
                <div className="flex justify-between">
                  <span>Transaction ID</span>
                  <span>{orderDetails.payment.transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Status</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                    {orderDetails.payment.status}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
              <Download className="h-4 w-4 mr-2" />
              Download Invoice
            </Button>
            <Button variant="outline" className="w-full">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
