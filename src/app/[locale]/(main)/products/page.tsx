'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Filter, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Filters } from '@/components/products/filters';
import { PackageModal } from '@/components/products/package-modal';
import { ProductCard } from '@/components/products/product-card';
import { ProductModal } from '@/components/products/product-modal';
import { deviceTypes, products } from '@/data/products';
import type { Product } from '@/types/product';

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeviceTypes, setSelectedDeviceTypes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2500]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showPackageModal, setShowPackageModal] = useState(false);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
        if (selectedDeviceTypes.length > 0 && !selectedDeviceTypes.includes(product.deviceType)) {
          return false;
        }
        if (priceRange && (product.price < priceRange[0] || product.price > priceRange[1])) {
          return false;
        }
        if (product.rating < minRating) {
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
            return b.rating - a.rating;
          case 'name':
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });
  }, [searchQuery, selectedDeviceTypes, priceRange, minRating, sortBy]);

  const handleDeviceTypeChange = (deviceType: string, checked: boolean) => {
    if (checked) {
      setSelectedDeviceTypes([...selectedDeviceTypes, deviceType]);
    } else {
      setSelectedDeviceTypes(selectedDeviceTypes.filter(type => type !== deviceType));
    }
  };

  // Updated function name to match ProductCard prop
  const handleAddToCartAction = (product: Product) => {
    setSelectedProduct(product);
    if (product.type === 'package') {
      setShowPackageModal(true);
    } else {
      setShowProductModal(true);
    }
  };

  const handleCloseModals = () => {
    setShowProductModal(false);
    setShowPackageModal(false);
    setSelectedProduct(null);
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
                  placeholder="Search products and packages..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
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
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>Refine your search results</SheetDescription>
                  </SheetHeader>
                  <div className="mt-6">
                    <Filters
                      deviceTypes={deviceTypes}
                      selectedDeviceTypes={selectedDeviceTypes}
                      onDeviceTypeChangeAction={handleDeviceTypeChange}
                      priceRange={priceRange}
                      onPriceRangeChangeAction={setPriceRange}
                      minRating={minRating}
                      onMinRatingChangeAction={setMinRating}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Desktop Filters Sidebar */}
          <div className="hidden w-64 flex-shrink-0">
            <Card>
              <CardContent className="p-6">
                <h2 className="font-semibold text-lg mb-4">Filters</h2>
                <Filters
                  deviceTypes={deviceTypes}
                  selectedDeviceTypes={selectedDeviceTypes}
                  onDeviceTypeChangeAction={handleDeviceTypeChange}
                  priceRange={priceRange}
                  onPriceRangeChangeAction={setPriceRange}
                  minRating={minRating}
                  onMinRatingChangeAction={setMinRating}
                />
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">Products & Packages</h1>
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
            </div>

            <div className="grid grid-cols-1 gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCartAction={handleAddToCartAction}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No items found matching your criteria.</p>
                <Button
                  variant="outline"
                  className="mt-4 bg-transparent"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedDeviceTypes([]);
                    setPriceRange([0, 2500]);
                    setMinRating(0);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedProduct && (
        <>
          <ProductModal
            product={selectedProduct}
            isOpen={showProductModal}
            onCloseAction={handleCloseModals}
          />
          <PackageModal
            product={selectedProduct}
            isOpen={showPackageModal}
            onCloseAction={handleCloseModals}
          />
        </>
      )}
    </div>
  );
}
