/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Product } from '@/lib/products';
import { useCartStore } from '@/lib/store/cartStore';
import { ShoppingCart, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SectionBadge from './SectionBadge';

interface ProductListProps {
  products: Product[];
}

const ProductList = ({ products }: ProductListProps) => {
  const router = useRouter();
  const addItem = useCartStore(state => state.addItem);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${i <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-300 text-gray-300'}`}
        />,
      );
    }
    return stars;
  };

  return (
    <div className="mt-4">
      <SectionBadge name="Our Products" />
      <h2 className="text-lg font-bold text-gray-900 mt-1 mb-3">Explore Our Products</h2>

      <div className="grid grid-cols-2 gap-4">
        {products.map(product => (
          <Card
            key={product.id}
            className="rounded-lg border py-0 border-gray-200 bg-white shadow-sm overflow-hidden cursor-pointer gap-0"
            onClick={() => router.push(`/product-details/${product.id}`)}
          >
            <div className="relative bg-gray-200 h-48 flex items-center justify-center">
              <img className="w-3/4 h-3/4 bg-gray-300 rounded-md"></img>
            </div>

            <CardContent className="p-4 grid gap-1">
              <h3 className="text-base font-medium text-gray-900">{product.name}</h3>
              <div className="flex items-center gap-1 mb-2">
                <div className="flex">{renderStars(product.rating)}</div>
                <span className="text-gray-500 text-sm">
                  (
                  {product.reviewCount}
                  )
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-gray-900">
                  $
                  {product.price}
                </span>
                {product.oldPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    $
                    {product.oldPrice}
                  </span>
                )}
              </div>
              <Button
                className="w-full bg-red-500 text-white hover:bg-red-600 mt-4"
                onClick={(e) => {
                  e.stopPropagation();
                  addItem(product);
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
