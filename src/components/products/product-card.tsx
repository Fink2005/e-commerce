/* eslint-disable react/no-array-index-key */
/* eslint-disable @next/next/no-img-element */
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCartStore } from '@/lib/store/cartStore';
import { convertTitleToSlug } from '@/libs/utils';
import type { AnimatingItem, ProductResponse } from '@/types/product';
import { ShoppingCart, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import FlyingCartItem from '../home/FlyingCartItem';

interface ProductCardProps {
  product: ProductResponse;
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const addItem = useCartStore(state => state.addItem);
  const [animatingItems, setAnimatingItems] = useState<AnimatingItem[]>([]);

  const handleAddToCart = (e: React.MouseEvent, product: ProductResponse) => {
    e.stopPropagation();

    // Get button position
    const button = e.currentTarget as HTMLButtonElement;
    const buttonRect = button.getBoundingClientRect();

    // Get cart icon position (approximate - you might need to adjust this)
    const cartIcon = document.querySelector('[aria-label="Shopping cart"]');
    const cartRect = cartIcon?.getBoundingClientRect();

    if (cartRect) {
      // Create animation item
      const animationId = `${product.type}-${product.id}-${Date.now()}`;
      const newAnimatingItem: AnimatingItem = {
        id: animationId,
        x: buttonRect.left + buttonRect.width / 2,
        y: buttonRect.top + buttonRect.height / 2,
        product
      };

      setAnimatingItems(prev => [...prev, newAnimatingItem]);

      // Add item to cart
      addItem(product);

      // Remove animation after completion
      setTimeout(() => {
        setAnimatingItems(prev => prev.filter(item => item.id !== animationId));
      }, 800);
    } else {
      // Fallback if cart icon not found
      addItem(product);
    }
  };

  const renderStars = (rating: number | null) => {
    if (!rating) {
      return null;
    }

    return (
      <div className="flex items-center space-x-1">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={`${product.id}-star-${i}`} // Make key unique per product
            className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
        {product.reviewCount && (
          <span className="text-sm text-gray-600 ml-1">
            (
            {product.reviewCount}
            )
          </span>
        )}
      </div>
    );
  };

  const getProductTypeBadge = () => {
    const typeColors = {
      PHONE: 'bg-blue-100 text-blue-800',
      PACKAGE: 'bg-green-100 text-green-800',
      BUNDLE: 'bg-purple-100 text-purple-800',
      ALL: 'bg-gray-100 text-gray-800'
    };

    return (
      <Badge className={`${typeColors[product.type]} text-xs`}>
        {product.type}
      </Badge>
    );
  };

  return (
    <>
      <Card
        className="overflow-hidden hover:shadow-lg transition-shadow duration-200 p-0"
        onClick={() => router.push(`/product-details/${convertTitleToSlug(`${product.name}-${product.type}-${product.id}`)}`)}
      >
        <CardContent className="p-0">
          {/* Product Image */}
          <div className="relative h-60 bg-gray-100">
            <img
              src={product.imgUrl || '/placeholder.svg'}
              alt={product.name}
              className="object-cover w-full h-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.svg';
              }}
            />
            <div className="absolute top-3 left-3">
              {getProductTypeBadge()}
            </div>
            {!product.isActive && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <Badge variant="destructive">Unavailable</Badge>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="p-4 space-y-3">
            <div>
              <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
              {product.description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {product.description}
                </p>
              )}
            </div>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center">
                {renderStars(product.rating)}
              </div>
            )}

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-2">Available Colors:</p>
                <div className="flex space-x-2">
                  {product.colors.slice(0, 5).map((color, index) => (
                    <div
                      key={index}
                      className="w-6 h-6 rounded-full border border-gray-300"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                  {product.colors.length > 5 && (
                    <div className="w-6 h-6 rounded-full border border-gray-300 bg-gray-100 flex items-center justify-center">
                      <span className="text-xs text-gray-600">
                        +
                        {product.colors.length - 5}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Price and Action */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex">
                <span className="text-2xl font-bold text-red-600">
                  $
                  {product.price.toFixed(2)}
                </span>
                {product.type === 'PACKAGE' && (
                  <span className="text-xs text-gray-500 mt-2">/month</span>
                )}
              </div>

              <Button
                onClick={e => handleAddToCart(e, product)}
                disabled={!product.isActive}
                className="bg-red-500 hover:bg-red-600 text-white disabled:bg-gray-300"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {product.type === 'PACKAGE' ? 'Select Plan' : 'Add to Cart'}
              </Button>
            </div>

            {/* Created/Updated Date */}
            <div className="text-xs text-gray-400 pt-2 border-t">
              Added:
              {' '}
              {new Date(product.createdAt).toLocaleDateString()}
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Flying Animation Items */}
      {animatingItems.map(item => (
        <FlyingCartItem
          key={item.id}
          item={item}
        />
      ))}
    </>
  );
}
