import { Headphones, Monitor, Smartphone, Tablet } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';
import SectionBadge from './SectionBadge';

const CategoryBrowser = () => {
  const categories = [
    {
      id: 'phone',
      name: 'Phone',
      icon: Smartphone,
      isActive: false
    },
    {
      id: 'computers',
      name: 'Computers',
      icon: Monitor,
      isActive: true
    },
    {
      id: 'tablets',
      name: 'Tablets',
      icon: Tablet,
      isActive: false
    },
    {
      id: 'audio',
      name: 'Audio',
      icon: Headphones,
      isActive: false
    }
  ];

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
            <CarouselPrevious className="static translate-y-0 cursor-pointer h-7 w-7" variant="secondary" />
            <CarouselNext className="static translate-y-0 cursor-pointer h-7 w-7" variant="secondary" />
          </div>
        </div>
        <CarouselContent className="-ml-2 md:-ml-4 mt-3">
          {categories.map((category) => {
            const IconComponent = category.icon;

            return (
              <CarouselItem key={category.id} className="basis-1/2">
                <Card
                  className={`
                    cursor-pointer transition-all duration-200 border-1 shadow-none
                    ${category.isActive
                ? 'bg-red-500 border-red-600 text-white'
                : 'bg-white border-gray-400'
              }
                  `}
                >
                  <CardContent className="p-5">
                    <div className="flex flex-col items-center gap-4">
                      <div className={`p-3 rounded-lg ${category.isActive ? 'bg-red-600' : 'bg-gray-100'}`}>
                        <IconComponent className={`h-8 w-8 ${category.isActive ? 'text-white' : 'text-gray-700'}`} />
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
