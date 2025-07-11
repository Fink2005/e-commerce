'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const VoucherCarousel = () => {
  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  const [emblaApi, setEmblaApi] = useState<any>(null);
  const [selectedIndex, setSelectedIndex] = useState(1);

  const carouselItems = [
    {
      id: 0,
      imageURL: 'https://mir-s3-cdn-cf.behance.net/project_modules/max_3840_webp/34b5bf180145769.6505ae7623131.jpg'
    },
    {
      id: 1,
      imageURL: 'https://mir-s3-cdn-cf.behance.net/project_modules/max_3840_webp/34b5bf180145769.6505ae7623131.jpg'
    },
    {
      id: 2,
      imageURL: 'https://mir-s3-cdn-cf.behance.net/project_modules/max_3840_webp/34b5bf180145769.6505ae7623131.jpg'
    }
  ];

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    const onSelect = () => {
      const selected = emblaApi.selectedScrollSnap();
      setSelectedIndex(selected);
    };

    emblaApi.on('select', onSelect);
    setTimeout(onSelect, 0);
  }, [emblaApi]);

  return (
    <div>
      <Carousel
        plugins={[plugin.current]}
        setApi={setEmblaApi}
        className="w-full cursor-pointer"
        opts={{
          align: 'start',
          loop: true,
        }}
      >
        <CarouselContent>
          {carouselItems.map(item => (
            <CarouselItem key={item.id}>
              <Card className="border-0 shadow-lg py-0 overflow-hidden">
                <CardContent className="p-0">
                  <Image src={item.imageURL} alt={`Voucher ${item.id}`} width={500} height={1200} priority={true} />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 z-10">
          {carouselItems.map(item => (
            <Button
              variant="ghost"
              size="icon"
              key={item.id}
              onClick={() => {
                emblaApi?.scrollTo(item.id);
              }}
              className={`h-2 w-2 transition-colors duration-300 cursor-pointer ${
                selectedIndex === item.id ? 'bg-red-500 border-2 border-solid border-white' : 'bg-gray-400'
              }`}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
};

export default VoucherCarousel;
