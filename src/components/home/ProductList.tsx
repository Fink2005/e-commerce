/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks-extra/no-direct-set-state-in-use-effect */
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { convertTitleToSlug } from '@/libs/utils';
import type { ProductResponse, UnifiedProduct } from '@/types/product';
import { ShoppingCart, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SectionBadge from './SectionBadge';

interface ProductListProps {
  products: ProductResponse | null;
}

const ProductList = ({ products }: ProductListProps) => {
  const router = useRouter();
  const [unifiedProducts, setUnifiedProducts] = useState<UnifiedProduct[]>([]);

  useEffect(() => {
    if (!products) {
      setUnifiedProducts([]);
      return;
    }

    const { phones, packages, bundles = [] } = products;

    const all: UnifiedProduct[] = [
      ...phones.map(phone => ({ ...phone, type: 'phone' as const })),
      ...packages.map(pkg => ({ ...pkg, type: 'package' as const })),
      ...bundles.map(bundle => ({ ...bundle, type: 'bundle' as const })),
    ];

    setUnifiedProducts(all);
  }, [products]);

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

  return (
    <div className="mt-4">
      <SectionBadge name="Our Products" />
      <h2 className="text-lg font-bold text-gray-900 mt-1 mb-3">Explore Our Products</h2>

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-4">
        {unifiedProducts.map(product => (
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

            {/* Product Info Section */}
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
                className="w-full bg-red-500 text-white hover:bg-red-600 mt-4"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click from triggering
                  // Add to cart logic here
                }}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add To Cart
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
