/* eslint-disable @next/next/no-img-element */

'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCartStore } from '@/lib/store/cartStore';
import { convertTitleToSlug } from '@/libs/utils';
import type { AnimatingItem, ProductResponse } from '@/types/product';
import { ShoppingCart, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import FlyingCartItem from './FlyingCartItem';
import SectionBadge from './SectionBadge';

interface ProductListProps {
  products: ProductResponse[] | undefined;
}

const ProductList = ({ products }: ProductListProps) => {
  const router = useRouter();
  const addItem = useCartStore(state => state.addItem);
  const [animatingItems, setAnimatingItems] = useState<AnimatingItem[]>([]);

  const renderStars = (rating: number | null) => {
    const stars = [];
    const validRating = rating ?? 0;
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${i <= validRating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-300 text-gray-300'}`}
        />
      );
    }
    return stars;
  };

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

  return (
    <>
      <div className="mt-4">
        <SectionBadge name="Our Products" />
        <h2 className="text-lg font-bold text-gray-900 mt-1 mb-3">Explore Our Products</h2>

        <div className="grid grid-cols-2 gap-4">
          {products?.map(product => (
            <Card
              key={`${product.type}-${product.id}`}
              className="rounded-lg border py-0 border-gray-200 bg-white shadow-sm overflow-hidden cursor-pointer"
              onClick={() => router.push(`/product-details/${convertTitleToSlug(`${product.name}-${product.type}-${product.id}`)}`)}
            >
              {/* Product Image */}
              <div className="relative bg-gray-200 h-48 flex items-center justify-center">
                {('imgUrl' in product) && (
                  <img
                    src={product.imgUrl}
                    alt={product.name}
                    className="w-3/4 h-3/4 object-contain rounded-md"
                  />
                )}
              </div>

              <CardContent className="p-4 grid gap-1">
                <h3 className="text-base font-medium text-gray-900">{product.name}</h3>
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex">{renderStars(product.rating)}</div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-gray-900">
                    $
                    {product.price}
                  </span>
                </div>
                <Button
                  className="cursor-pointer w-full bg-red-500 text-white hover:bg-red-600 mt-4"
                  onClick={e => handleAddToCart(e, product)}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add To Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      {/* Flying Animation Items */}
      {animatingItems.map(item => (
        <FlyingCartItem
          key={item.id}
          item={item}
        />
      ))}
    </>
  );
};

export default ProductList;
