/* eslint-disable react/no-array-index-key */
'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Filter, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { productRequests } from '@/app/apis/requests/product';
import { ProductCard } from '@/components/products/product-card';
import type { ProductResponse } from '@/types/product';
import { ProductType } from '@/types/product';

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<ProductType>(ProductType.ALL);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);

  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products on component mount and when type changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await productRequests.getProductsByType(selectedType);
        setProducts(result);
      } catch (err) {
        setError('Failed to load products. Please try again.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedType]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
        if (product.price < priceRange[0] || product.price > priceRange[1]) {
          return false;
        }
        if (product.rating && product.rating < minRating) {
          return false;
        }
        if (!product.isActive) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price-low':
            return a.price - b.price;
          case 'price-high':
            return b.price - a.price;
          case 'rating':
            return (b.rating || 0) - (a.rating || 0);
          case 'name':
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });
  }, [products, searchQuery, priceRange, minRating, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedType(ProductType.ALL);
    setPriceRange([0, 1000]);
    setMinRating(0);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b bg-white sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col space-y-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Select value={selectedType} onValueChange={value => setSelectedType(value as ProductType)}>
                <SelectTrigger className="w-auto">
                  <SelectValue placeholder="Product Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ProductType.ALL}>All Products</SelectItem>
                  <SelectItem value={ProductType.PHONE}>Phones</SelectItem>
                  <SelectItem value={ProductType.PACKAGE}>Packages</SelectItem>
                  <SelectItem value={ProductType.BUNDLE}>Bundles</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-auto">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>

              <Sheet open={showFilters} onOpenChange={setShowFilters}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="bg-transparent">
                    <Filter className="w-4 h-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>Refine your search results</SheetDescription>
                  </SheetHeader>
                  <div className="px-4 space-y-6">
                    {/* Price Range Filter */}
                    <div>
                      <label className="text-sm font-medium" htmlFor="price-range">Price Range</label>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            placeholder="Min"
                            value={priceRange[0]}
                            onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
                            className="w-full"
                          />
                          <span>-</span>
                          <Input
                            type="number"
                            placeholder="Max"
                            value={priceRange[1]}
                            onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Minimum Rating Filter */}
                    <div>
                      <label className="text-sm font-medium" htmlFor="minimum-rating">Minimum Rating</label>
                      <Select value={minRating.toString()} onValueChange={value => setMinRating(Number(value))}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">All Ratings</SelectItem>
                          <SelectItem value="1">1+ Stars</SelectItem>
                          <SelectItem value="2">2+ Stars</SelectItem>
                          <SelectItem value="3">3+ Stars</SelectItem>
                          <SelectItem value="4">4+ Stars</SelectItem>
                          <SelectItem value="5">5 Stars</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="w-full bg-transparent"
                    >
                      Clear All Filters
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex-1">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Products</h1>
            {loading ? (
              <p className="text-gray-600">Loading products...</p>
            ) : error ? (
              <p></p>
            ) : (
              <p className="text-gray-600">
                Showing
                {' '}
                {filteredProducts.length}
                {' '}
                of
                {' '}
                {products.length}
                {' '}
                items
              </p>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-6">
              {[...Array.from({ length: 6 })].map((_, i) => (
                <Card key={i} className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="bg-gray-200 h-48 rounded"></div>
                    <div className="space-y-2">
                      <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                      <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 text-lg mb-4">{error}</p>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="bg-transparent"
              >
                Retry
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={index}
                  product={product}
                />
              ))}
            </div>
          )}

          {!loading && !error && filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
              <Button
                variant="outline"
                className="mt-4 bg-transparent"
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
