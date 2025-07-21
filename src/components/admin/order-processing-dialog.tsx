'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

interface Customer {
  id: string;
  name: string;
}

interface Package {
  id: string;
  name: string;
  price: number;
}

interface OrderProcessingDialogProps {
  customers: Customer[];
  packages: Package[];
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
}

export function OrderProcessingDialog({ customers, packages, open, onOpenChangeAction }: OrderProcessingDialogProps) {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [discount, setDiscount] = useState(0);

  const subtotal = selectedPackage ? selectedPackage.price * quantity : 0;
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Process Customer Order</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customer-select">Customer</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map(customer => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="package-select">Package</Label>
              <Select
                onValueChange={(value) => {
                  const pkg = packages.find(p => p.id === value);
                  setSelectedPackage(pkg || null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select package" />
                </SelectTrigger>
                <SelectContent>
                  {packages.map(pkg => (
                    <SelectItem key={pkg.id} value={pkg.id}>
                      {pkg.name}
                      {' '}
                      - $
                      {pkg.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={e => setQuantity(Number.parseInt(e.target.value) || 1)}
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="discount">Discount (%)</Label>
              <Input
                id="discount"
                type="number"
                value={discount}
                onChange={e => setDiscount(Number.parseInt(e.target.value) || 0)}
                min="0"
                max="100"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="payment-method">Payment Method</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="credit-card">Credit Card</SelectItem>
                <SelectItem value="debit-card">Debit Card</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Order Summary</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>
                  $
                  {subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Discount:</span>
                <span>
                  -$
                  {discountAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>
                  $
                  {total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          <Button className="w-full bg-red-500 hover:bg-red-600 text-white">Process Order & Payment</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
