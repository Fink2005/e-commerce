import { Headphones, Monitor, Smartphone, Tablet } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';

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
      <div className="flex items-center gap-2">
        <div className="w-2 h-6 bg-red-500 rounded-full">&nbsp;</div>
        <p className="text-red-500 text-sm font-medium">Categories</p>
      </div>
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Browse By Category</h2>
          <div className="flex items-center gap-2">
            <CarouselPrevious className="static translate-y-0 h-8 w-8 cursor-pointer" variant="ghost" />
            <CarouselNext className="static translate-y-0 h-8 w-8 cursor-pointer" variant="ghost" />
          </div>
        </div>
        <CarouselContent className="-ml-2 md:-ml-4 mt-3">
          {categories.map((category) => {
            const IconComponent = category.icon;

            return (
              <CarouselItem key={category.id} className="pl-2 md:pl-4 basis-1/2">
                <Card
                  className={`
                    cursor-pointer transition-all duration-200 border-2
                    ${category.isActive
                ? 'bg-red-500 border-red-500 text-white hover:bg-red-600'
                : 'bg-white border-gray-200 hover:border-gray-300'
              }
                  `}
                >
                  <CardContent className="p-6">
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
