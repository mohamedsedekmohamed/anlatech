"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import { userHome } from "@/services/userHome";
import { useApiGet } from "@/hooks/useApi";
import { useLocale } from "next-intl";
import { resolveImageUrl } from "@/utils/imageHelper";

export interface BannerItem {
  id: number;
  name?: string;
  title?: string;
  description: string;
  image?: string | null;
  image_url?: string | null;
}

type Props = {
  initialBanners?: BannerItem[]; 
};

export default function HeroSlider({ initialBanners = [] }: Props) {
  const swiperRef = useRef<SwiperType | null>(null);
  const locale = useLocale();
  
  const { data: bannersResponse, isLoading } = useApiGet(
    userHome.getBanners,
    locale
  );

  const slides: BannerItem[] = bannersResponse?.data || bannersResponse || initialBanners;
  const [activeIndex, setActiveIndex] = useState(0);
  const lastIndex = slides.length > 0 ? slides.length - 1 : 0;

  if (isLoading) {
    return (
      <section className="w-full h-[45vh] md:h-[60vh] lg:h-[90vh] flex items-center justify-center bg-muted/30 animate-pulse relative overflow-hidden">
        <div className="z-10 flex flex-col items-center justify-center text-center px-4 w-full max-w-4xl gap-4">
          <div className="w-3/4 md:w-2/3 h-10 md:h-14 bg-muted-foreground/10 rounded-2xl" />
          <div className="w-5/6 md:w-3/4 h-6 md:h-8 bg-muted-foreground/10 rounded-xl" />
          <div className="w-1/2 md:w-1/3 h-6 md:h-8 bg-muted-foreground/10 rounded-xl mt-2" />
          <div className="w-32 md:w-40 h-12 bg-muted-foreground/20 rounded-full mt-6" />
        </div>
      </section>
    );
  }

  if (slides.length === 0) return null;

  return (
    <section className="relative group">
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3500 }}
        modules={[Pagination, Navigation, Autoplay]}
        className="w-full h-[45vh] md:h-[60vh] lg:h-[90vh] hero-swiper"
      >
        {slides.map((slide) => {
          const title = slide.title || slide.name || '';
          const bgImage = resolveImageUrl(slide.image_url || slide.image, 'banner');

          return (
            <SwiperSlide
              key={slide.id}
              style={{ backgroundImage: `url('${bgImage}')` }}
              className="relative w-full h-full flex justify-center items-center flex-col text-center bg-no-repeat bg-cover bg-center"
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/60 pointer-events-none" />

              {/* Content */}
              <div className="relative z-10 w-full h-full flex justify-center items-center flex-col text-white px-8 md:px-12">
                <h1 className="font-bold text-3xl md:text-5xl lg:text-[64px] lg:leading-[1.1] mb-4 max-w-[90%] md:max-w-[80%] leading-tight">
                  {title}
                </h1>

                <p className="font-medium text-sm md:text-xl lg:text-[22px] lg:leading-8 xl:leading-9 mb-6 md:mb-10 text-gray-200 max-w-[90%] md:max-w-[600px] lg:max-w-[680px] xl:max-w-[750px] leading-7">
                  {slide.description}
                </p>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Prev Button */}
      <button
        onClick={() => swiperRef.current?.slidePrev()}
        disabled={activeIndex === 0}
        className="absolute cursor-pointer inset-s-2 md:inset-s-4 top-1/2 -translate-y-1/2 z-20 size-9 md:size-12 flex items-center justify-center rounded-full bg-black/50 md:bg-white/10 hover:bg-primary transition-all active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed text-white"
        aria-label="Previous slide"
      >
        <ChevronLeft className="size-5 md:size-6 rtl:rotate-180" />
      </button>

      {/* Next Button */}
      <button
        onClick={() => swiperRef.current?.slideNext()}
        disabled={activeIndex === lastIndex}
        className="absolute cursor-pointer inset-e-2 md:inset-e-4 top-1/2 -translate-y-1/2 z-20 size-9 md:size-12 flex items-center justify-center rounded-full bg-black/50 md:bg-white/10 hover:bg-primary transition-all active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed text-white"
        aria-label="Next slide"
      >
        <ChevronRight className="size-5 md:size-6 rtl:rotate-180" />
      </button>
    </section>
  );
}
