import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Swiper, type SwiperProps, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { cn } from '@/lib/utils.ts';
import 'swiper/css';
import 'swiper/css/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const carouselVariants = cva('w-full h-[300px]');

export type CarouselProps = SwiperProps &
  VariantProps<typeof carouselVariants> & {
    children: React.ReactNode[];
  };

export default function Carousel({ children, className, ...props }: CarouselProps) {
  return (
    <div className="relative mx-auto w-full max-w-[1100px]">
      <Swiper
        modules={[Navigation]}
        spaceBetween={25}
        slidesPerView={4}
        navigation={{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }}
        loop={true}
        loopAdditionalSlides={4}
        className={cn(carouselVariants(), className)}
        {...props}
      >
        {children.map((node, index) => (
          <SwiperSlide key={index} className="rounded-lg">
            {node}
          </SwiperSlide>
        ))}
      </Swiper>

      <button className="swiper-button-prev-custom bg-destructive absolute top-1/2 -left-[60px] z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full p-2 shadow-lg transition-all">
        <ChevronLeft className="h-24 w-24 cursor-pointer text-white" />
      </button>
      <button className="swiper-button-next-custom bg-destructive absolute top-1/2 -right-[60px] z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full p-2 shadow-lg transition-all">
        <ChevronRight className="cursor-pointer text-white" />
      </button>
    </div>
  );
}
