'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCartStore } from '@/lib/store/cartStore';
import { ArrowLeft, CreditCard, MapPin, Package, Truck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Checkout = () => {
  const {
    items: cartItems,
    getTotalPrice,
    getTotalItems,
    clearCart
  } = useCartStore();

  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [formData, setFormData] = useState({
    // Shipping Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',

    // Payment Information
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',

    // Delivery Options
    deliveryOption: 'standard',

    // Special Instructions
    specialInstructions: ''
  });

  // Ensure component only renders after hydration
  useEffect(() => {
    const timer = setTimeout(() => setIsHydrated(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Redirect to cart if empty
  useEffect(() => {
    if (isHydrated && cartItems.length === 0) {
      router.push('/cart');
    }
  }, [isHydrated, cartItems.length, router]);

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.08; // 8% tax
  const deliveryFee = formData.deliveryOption === 'express' ? 15.99 : 0;
  const total = subtotal + tax + deliveryFee;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Here you would typically:
    // 1. Validate form data
    // 2. Process payment
    // 3. Create order
    // 4. Clear cart
    // 5. Redirect to success page

    try {
      // Clear cart after successful order
      clearCart();

      // Redirect to success page
      router.push('/order-success');
    } catch (error) {
      console.error('Order processing failed:', error);
    }
  };

  // Show loading state until hydrated
  if (!isHydrated) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="bg-white border-b">
          <div className="max-w-md mx-auto px-4 py-3">
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Cart</span>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">Checkout</span>
            </div>
          </div>
        </div>
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="text-center">Loading checkout...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="p-0 h-auto"
              >
                <ArrowLeft className="size-5" />
              </Button>
              <span className="text-gray-900 font-medium">Checkout</span>
            </div>
            <div className="text-sm text-gray-600">
              {getTotalItems()}
              {' '}
              {getTotalItems() === 1 ? 'item' : 'items'}
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Order Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-base">
              <Package className="size-4" />
              <span>Order Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                  <div className="text-xs text-gray-500">
                    Qty:
                    {item.quantity}
                  </div>
                </div>
                <div className="text-sm font-medium">
                  $
                  {(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}

            <hr className="my-3" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span>
                  $
                  {subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax:</span>
                <span>
                  $
                  {tax.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery:</span>
                <span>{deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}</span>
              </div>
              <hr />
              <div className="flex justify-between font-semibold text-base">
                <span>Total:</span>
                <span>
                  $
                  {total.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Options */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-base">
              <Truck className="size-4" />
              <span>Delivery Options</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button
                type="button"
                className={`w-full border rounded-lg p-3 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                  formData.deliveryOption === 'standard' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleInputChange('deliveryOption', 'standard')}
                aria-pressed={formData.deliveryOption === 'standard'}
              >
                <div className="flex justify-between">
                  <div>
                    <div className="font-medium text-sm">Standard Delivery</div>
                    <div className="text-xs text-gray-500">5-7 business days</div>
                  </div>
                  <div className="text-sm font-medium text-green-600">Free</div>
                </div>
              </button>

              <button
                type="button"
                className={`w-full border rounded-lg p-3 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                  formData.deliveryOption === 'express' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleInputChange('deliveryOption', 'express')}
                aria-pressed={formData.deliveryOption === 'express'}
              >
                <div className="flex justify-between">
                  <div>
                    <div className="font-medium text-sm">Express Delivery</div>
                    <div className="text-xs text-gray-500">1-2 business days</div>
                  </div>
                  <div className="text-sm font-medium">$15.99</div>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-base">
              <MapPin className="size-4" />
              <span>Shipping Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="firstName" className="text-sm">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={e => handleInputChange('firstName', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-sm">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={e => handleInputChange('lastName', e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-sm">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={e => handleInputChange('email', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={e => handleInputChange('phone', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="address" className="text-sm">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={e => handleInputChange('address', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="city" className="text-sm">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={e => handleInputChange('city', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="zipCode" className="text-sm">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={e => handleInputChange('zipCode', e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="state" className="text-sm">State</Label>
              <Select
                value={formData.state}
                onValueChange={value => handleInputChange('state', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AL">Alabama</SelectItem>
                  <SelectItem value="CA">California</SelectItem>
                  <SelectItem value="FL">Florida</SelectItem>
                  <SelectItem value="NY">New York</SelectItem>
                  <SelectItem value="TX">Texas</SelectItem>
                  {/* Add more states as needed */}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-base">
              <CreditCard className="size-4" />
              <span>Payment Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="nameOnCard" className="text-sm">Name on Card</Label>
              <Input
                id="nameOnCard"
                value={formData.nameOnCard}
                onChange={e => handleInputChange('nameOnCard', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="cardNumber" className="text-sm">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={e => handleInputChange('cardNumber', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="expiryDate" className="text-sm">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={e => handleInputChange('expiryDate', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cvv" className="text-sm">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={formData.cvv}
                  onChange={e => handleInputChange('cvv', e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Special Instructions */}
        <Card>
          <CardContent className="pt-6">
            <Label htmlFor="specialInstructions" className="text-sm">Special Instructions (Optional)</Label>
            <textarea
              id="specialInstructions"
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg text-sm resize-none"
              rows={3}
              placeholder="Any special delivery instructions..."
              value={formData.specialInstructions}
              onChange={e => handleInputChange('specialInstructions', e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Place Order Button */}
        <Button
          type="submit"
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 text-base font-medium"
        >
          Place Order - $
          {total.toFixed(2)}
        </Button>
      </form>
    </div>
  );
};

export default Checkout;
