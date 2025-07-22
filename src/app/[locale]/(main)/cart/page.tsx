'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCartStore } from '@/lib/store/cartStore';
import { Minus, Plus, X } from 'lucide-react';
import { useState } from 'react';

const ShoppingCartPage = () => {
  const {
    items: cartItems,
    updateQuantity,
    removeItem,
    getTotalPrice
  } = useCartStore();

  const [couponCode, setCouponCode] = useState('');

  const subtotal = getTotalPrice();
  const shipping = 0;
  const total = subtotal + shipping;

  const applyCoupon = () => {
    // Add coupon logic here
    console.log('Applying coupon:', couponCode);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">Home</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">Cart</span>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        <div className="space-y-4 mb-6">
          {cartItems.map(item => (
            <Card key={item.id} className="bg-white border border-gray-200 relative">
              <CardContent>
                <div className="flex items-start space-x-4">
                  <div className="size-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="w-12 h-8 bg-gray-400 rounded"></div>
                  </div>

                  <div className="flex justify-between min-w-0 w-full">
                    <div>
                      <h3 className="text-base font-medium text-gray-900 mb-1">
                        {item.name}
                      </h3>
                      <div className="text-lg font-bold text-red-500 mb-3">
                        $
                        {item.price}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center border rounded-lg">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="size-8 p-0"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="px-3 py-1 text-sm font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="size-8 p-0"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <Button
                variant="secondary"
                size="icon"
                className="size-5 rounded-full text-white bg-red-500 absolute -top-1 -right-1"
                onClick={() => removeItem(item.id)}
              >
                <X className="size-4" strokeWidth={4} />
              </Button>
            </Card>
          ))}
        </div>

        <div className="mb-6">
          <div className="flex space-x-2">
            <Input
              placeholder="Coupon Code"
              value={couponCode}
              onChange={e => setCouponCode(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={applyCoupon}
              className="bg-red-500 hover:bg-red-600 text-white px-6"
            >
              Apply Coupon
            </Button>
          </div>
        </div>

        <Card className="border border-gray-200">
          <CardContent>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Cart Total
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">
                  $
                  {subtotal}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-medium text-green-600">Free</span>
              </div>

              <hr className="border-gray-200" />

              <div className="flex justify-between text-base font-semibold">
                <span>Subtotal:</span>
                <span>
                  $
                  {total}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white py-3 text-base font-medium">
          Proceed to checkout
        </Button>
      </div>
    </div>
  );
};

export default ShoppingCartPage;
