'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Product } from '@/types/product';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
  onAddToCartAction: (product: Product) => void;
}

export function ProductCard({ product, onAddToCartAction }: ProductCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
    ));
  };

  const getProductTypeDisplay = () => {
    if (product.type === 'package') {
      switch (product.packageType) {
        case 'MobileOnly':
          return '📱 Mobile device + Minutes + SMS + Data';
        case 'BroadbandOnly':
          return '🌐 Router + High-speed internet';
        case 'TabletOnly':
          return '📱 Tablet + Mobile data';
        case 'DoublePackage':
          return '🎯 Choose any 2 packages + Extra savings';
        case 'TriplePackage':
          return '🎁 All 3 packages + Maximum savings';
        default:
          return '';
      }
    }
    return '';
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="relative mb-4">
          <Image
            src={product.image || '/placeholder.svg'}
            alt={product.name}
            width={200}
            height={200}
            className="w-full h-48 object-cover rounded-lg"
          />
          {product.discount > 0 && (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              -
              {product.discount}
              %
            </Badge>
          )}
          {product.type === 'package' && (
            <Badge className="absolute top-2 right-2 bg-blue-500">{product.packageType?.replace('Package', '')}</Badge>
          )}
          {!product.inStock && <Badge className="absolute top-2 right-2 bg-gray-500">Out of Stock</Badge>}
          <Button
            size="icon"
            variant="outline"
            className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white"
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-base line-clamp-2">{product.name}</h3>

          <div className="flex items-center space-x-1">
            {renderStars(product.rating)}
            <span className="text-sm text-gray-600">
              (
              {product.reviews}
              )
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className={`font-bold text-xl ${product.type === 'package' ? 'text-red-600' : ''}`}>
              $
              {product.price}
            </span>
            {product.type === 'package' && <span className="text-sm text-gray-500">/month</span>}
            {product.originalPrice && (
              <span className="text-gray-500 line-through text-sm">
                $
                {product.originalPrice}
              </span>
            )}
          </div>

          {product.type === 'product' && product.colors && (
            <div className="flex items-center space-x-1">
              {product.colors.map((color, index) => (
                <div
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: color.value }}
                />
              ))}
            </div>
          )}

          {product.type === 'package' && (
            <div className="text-xs text-gray-600">
              <p>{getProductTypeDisplay()}</p>
            </div>
          )}

          <Button
            className="w-full bg-red-500 hover:bg-red-600 text-white"
            disabled={!product.inStock}
            onClick={() => onAddToCartAction(product)}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {product.inStock ? (product.type === 'package' ? 'Customize Package' : 'Add To Cart') : 'Out of Stock'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
