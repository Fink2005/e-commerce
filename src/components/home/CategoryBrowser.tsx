'use client';
import { Combine, Package, Smartphone, SquareStack } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '../ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';
import SectionBadge from './SectionBadge';

const CategoryBrowser = () => {
  const categories = [
    {
      id: 'all',
      name: 'All Products',
      icon: SquareStack,
    },
    {
      id: 'phone',
      name: 'Phone',
      icon: Smartphone,
    },
    {
      id: 'package',
      name: 'Package',
      icon: Package,
    },
    {
      id: 'bundle',
      name: 'Bundle',
      icon: Combine,
    }
  ];

  const router = useRouter();
  const params = useSearchParams();
  const activeCategory = params.get('productType') || params.get('deviceType') || 'all';

  const handleCardClick = (id: string) => {
    const productQueries = new URLSearchParams();
    productQueries.set(id === 'tablet' ? 'deviceType' : 'productType', id);
    router.push(`?${productQueries.toString()}`);
  };

  return (
    <div>
      <SectionBadge name="Categories" />
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <div className="flex justify-between items-center mt-1">
          <h2 className="text-lg font-bold text-gray-900">Browse By Category</h2>
          <div className="flex items-center gap-4">
            <CarouselPrevious className="static translate-y-0 cursor-pointer size-7" iconClassName="size-4" strokeWidth={3} variant="secondary" />
            <CarouselNext className="static translate-y-0 cursor-pointer size-7" iconClassName="size-4" strokeWidth={3} variant="secondary" />
          </div>
        </div>
        <CarouselContent className="mt-2">
          {categories.map((category) => {
            const IconComponent = category.icon;

            return (
              <CarouselItem key={category.id} className="basis-1/2">
                <Card
                  className={`
                    cursor-pointer transition-all duration-200 border-1 shadow-none
                    ${activeCategory === category.id
                ? 'bg-red-500 border-red-600 text-white'
                : 'bg-white border-gray-400'
              }
                  `}
                  onClick={() => handleCardClick(category.id)}
                >
                  <CardContent className="p-5">
                    <div className="flex flex-col items-center gap-4">
                      <div className={`p-3 rounded-lg ${activeCategory === category.id ? 'bg-red-600' : 'bg-gray-100'}`}>
                        <IconComponent className={`size-8 ${activeCategory === category.id ? 'text-white' : 'text-gray-700'}`} />
                      </div>
                      <span className="font-medium text-sm">{category.name}</span>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default CategoryBrowser;
