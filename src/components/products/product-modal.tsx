'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import type { Product } from '@/types/product';
import { Minus, Plus, ShoppingCart, Star } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onCloseAction: () => void;
}

export function ProductModal({ product, isOpen, onCloseAction }: ProductModalProps) {
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  if (!product || product.type !== 'product') {
    return null;
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
    ));
  };

  const handleOpen = (open: boolean) => {
    if (!open) {
      onCloseAction();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpen}>
      <SheetContent side="right" className="w-full overflow-y-auto p-4">
        <SheetHeader>
          <SheetTitle>{product.name}</SheetTitle>
          <SheetDescription>Select your preferences</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="flex items-center space-x-4">
            <Image
              src={product.image || '/placeholder.svg'}
              alt={product.name}
              width={80}
              height={80}
              className="rounded-lg"
            />
            <div>
              <h3 className="font-semibold">{product.name}</h3>
              <div className="flex items-center space-x-1 mt-1">
                {renderStars(product.rating)}
                <span className="text-sm text-gray-600">
                  (
                  {product.reviews}
                  )
                </span>
              </div>
            </div>
          </div>

          {/* Color Selection */}
          {product.colors && product.colors.length > 1 && (
            <div>
              <Label className="text-base font-semibold">Color</Label>
              <div className="flex items-center space-x-3 mt-3">
                {product.colors.map(color => (
                  <button
                    type="button"
                    key={color.value}
                    onClick={() => setSelectedColor(color.value)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedColor === color.value ? 'border-red-500' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-2 capitalize">{selectedColor}</p>
            </div>
          )}

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 1 && (
            <div>
              <Label className="text-base font-semibold">Size/Storage</Label>
              <div className="grid grid-cols-2 gap-2 mt-3">
                {product.sizes.map(size => (
                  <button
                    type="button"
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`p-2 border rounded-lg text-sm ${
                      selectedSize === size
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <Label className="text-base font-semibold">Quantity</Label>
            <div className="flex items-center space-x-3 mt-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="bg-transparent"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-12 text-center font-semibold">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
                className="bg-transparent"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-xl font-bold text-red-600">
                $
                {(product.price * quantity).toFixed(2)}
              </span>
            </div>

            <Button
              className="w-full bg-red-500 hover:bg-red-600 text-white"
              onClick={() => {
                onCloseAction();
              }}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add To Cart
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
