/* eslint-disable @next/next/no-img-element */
'use client';

import { productRequests } from '@/app/apis/requests/product';
import ProductList from '@/components/home/ProductList';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Product } from '@/lib/products';
import { parseSlug } from '@/libs/utils';
import type { ProductResponse } from '@/types/product';
import { Heart, Minus, Plus, Star } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function GamepadProductPage() {
  const params = useParams();
  const { id, type } = parseSlug(params.productDetailSlug as string);

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState('black');
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [products, setProducts] = useState<ProductResponse>({
    bundles: [],
    phones: [],
    packages: [],
  });

  const colors = [
    { name: 'black', color: 'bg-slate-900', border: 'border-slate-900' },
    { name: 'red', color: 'bg-red-500', border: 'border-red-500' },
  ];
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];

  useEffect(() => {
    if (!id || !type) {
      return;
    }

    const fetchProduct = async () => {
      try {
        const res = await productRequests.getProductById(type.toUpperCase(), id);
        if (res) {
          setProduct({
            ...res,
            image: res.imageUrl || '/placeholder.svg', // Provide a default value if missing
            reviewCount: res.reviewCount || 0, // Provide a default value if missing
            rating: res.rating ?? 0, // Provide a default value if null
          });
        }
        if (res?.colors?.[0]) {
          setSelectedColor(res.colors[0]);
        }
      } catch (err) {
        console.error('❌ Failed to fetch product:', err);
        setProduct(null);
      }
    };

    fetchProduct();
  }, [id, type]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productRequests.getProducts();
        if (res) {
          setProducts(res);
        }
      } catch (err) {
        console.error('❌ Failed to fetch products:', err);
      }
    };

    fetchProducts();
  }, []);

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  const renderStars = (rating: number = 0) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">
        Product not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-10">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 gap-6">
          {/* Product Images */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <CardContent>
                <img
                  src={product.imgUrl || '/placeholder.svg'}
                  alt={product.name}
                  className="w-full h-48 object-contain mx-auto"
                />
              </CardContent>
            </Card>

            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2].map(index => (
                <Card
                  key={index}
                  className={`cursor-pointer transition-all ${selectedImage === index ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <CardContent className="p-2">
                    <img
                      src={product.imgUrl || '/placeholder.svg'}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-16 object-contain mx-auto"
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">{product.name}</h1>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <div className="flex items-center space-x-1">{renderStars(product.rating)}</div>
                <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                  In Stock
                </Badge>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-4">
                $
                {product.price?.toFixed(2) ?? '0.00'}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            <hr className="border-gray-200" />

            {/* Color Selection */}
            {(product.colors ?? [])?.length > 0 && (
              <div>
                <h3 className="text-base font-semibold mb-3">Colours:</h3>
                <div className="flex space-x-3">
                  {(product.colors ?? []).map((colorName) => {
                    const colorOption = colors.find(c => c.name === colorName);
                    if (!colorOption) {
                      return null;
                    }

                    return (
                      <button
                        type="button"
                        key={colorName}
                        onClick={() => setSelectedColor(colorName)}
                        className={`w-7 h-7 rounded-full ${colorOption.color} border-2 ${
                          selectedColor === colorName ? colorOption.border : 'border-gray-300'
                        } transition-all hover:scale-110`}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selection */}
            <div>
              <h3 className="text-base font-semibold mb-3">Size:</h3>
              <div className="flex flex-wrap gap-2">
                {sizes.map(size => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? 'default' : 'outline'}
                    onClick={() => setSelectedSize(size)}
                    className={`w-10 h-10 text-sm ${selectedSize === size ? 'bg-red-500 hover:bg-red-600' : ''}`}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="flex flex-row gap-3 items-center">
              <div className="flex items-center border border-gray-300 rounded-lg w-full">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={decrementQuantity}
                  className="h-10 w-10 hover:bg-gray-100"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 min-w-[3rem] text-center font-medium flex-1">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={incrementQuantity}
                  className="h-10 w-10 hover:bg-gray-100"
                >
                  <Plus className="h-4 w-4 text-white bg-red-500 rounded" />
                </Button>
              </div>
              <Button className="flex-1 bg-red-500 hover:bg-red-600 text-white h-12 text-sm">
                Buy Now
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`h-10 w-10 ${isWishlisted ? 'bg-red-50 border-red-500' : ''}`}
              >
                <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Related Products */}
          {products.bundles.length !== 0 && <ProductList products={products} />}
        </div>
      </div>
    </div>
  );
}
