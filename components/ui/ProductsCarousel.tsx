'use client';

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import { userHome } from '@/services/userHome';
import { useApiGet } from '@/hooks/useApi';
import { Package, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';

export default function ProductsCarousel() {
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const [page, setPage] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);

  const { data, isLoading, error } = useApiGet(userHome.allProducts, locale, page);
  const products: any[] = data?.data || [];
  const lastPage = data?.last_page || 1;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setActiveIndex(0);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  };

  if (isLoading && products.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 bg-card rounded-full flex items-center justify-center mb-4">
          <Package className="w-10 h-10 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground text-lg font-medium">
          {isRtl ? 'لا توجد عناصر في الكتالوج حالياً.' : 'No items available in the catalog at the moment.'}
        </p>
      </div>
    );
  }

  // حساب العناصر الثلاثة (السابق، الحالي، التالي)
  const prevIndex = (activeIndex - 1 + products.length) % products.length;
  const nextIndex = (activeIndex + 1) % products.length;

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-8">
      
      {/* صف السلايدر المتجاوب مع الموبايل والكمبيوتر */}
      <div className="flex items-center justify-center gap-2 md:gap-6 min-h-[340px] md:min-h-[380px]">
        
        {/* 1. الكارت الجانبي (يسار) - مخفي في الموبايل */}
        {products.length > 1 && (
          <div
            onClick={handlePrev}
            className="hidden md:block w-[26%] opacity-40 scale-90 transition-all duration-500 ease-out cursor-pointer hover:opacity-65 select-none"
          >
            <div className="pointer-events-none">
              <ProductCard product={products[prevIndex]} locale={locale} />
            </div>
          </div>
        )}

        {/* 2. سهم التنقل الأيسر */}
        {products.length > 1 && (
          <button
            onClick={handlePrev}
            className="p-1 sm:p-2 md:p-3 text-muted-foreground hover:text-foreground transition-colors shrink-0"
            aria-label="Previous"
          >
            {isRtl ? (
              <ChevronRight className="w-7 h-7 md:w-8 md:h-8" />
            ) : (
              <ChevronLeft className="w-7 h-7 md:w-8 md:h-8" />
            )}
          </button>
        )}

        {/* 3. الكارت الأوسط (الرئيسي والبارز) - واخد مساحة ممتازة في الموبايل */}
        <div className="w-[78%] sm:w-[60%] md:w-[34%] scale-100 opacity-100 transition-all duration-500 ease-out z-10 shadow-lg rounded-2xl">
          <ProductCard product={products[activeIndex]} locale={locale} />
        </div>

        {/* 4. سهم التنقل الأيمن */}
        {products.length > 1 && (
          <button
            onClick={handleNext}
            className="p-1 sm:p-2 md:p-3 text-muted-foreground hover:text-foreground transition-colors shrink-0"
            aria-label="Next"
          >
            {isRtl ? (
              <ChevronLeft className="w-7 h-7 md:w-8 md:h-8" />
            ) : (
              <ChevronRight className="w-7 h-7 md:w-8 md:h-8" />
            )}
          </button>
        )}

        {/* 5. الكارت الجانبي (يمين) - مخفي في الموبايل */}
        {products.length > 1 && (
          <div
            onClick={handleNext}
            className="hidden md:block w-[26%] opacity-40 scale-90 transition-all duration-500 ease-out cursor-pointer hover:opacity-65 select-none"
          >
            <div className="pointer-events-none">
              <ProductCard product={products[nextIndex]} locale={locale} />
            </div>
          </div>
        )}

      </div>

      {/* مؤشرات التقدم (Dots) */}
      {products.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6 md:mt-8">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeIndex === index ? 'w-8 bg-primary' : 'w-2 bg-muted hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>
      )}

      {/* أزرار التنقل بين الصفحات (Pagination) */}
      {lastPage > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-border">
          <button
            onClick={() => handlePageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className="p-2 bg-card border border-border rounded-xl text-muted-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isRtl ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
          
          <div className="flex items-center gap-2">
            {[...Array(lastPage)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                  page === i + 1
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'bg-card border border-border text-muted-foreground hover:bg-muted'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(Math.min(lastPage, page + 1))}
            disabled={page === lastPage}
            className="p-2 bg-card border border-border rounded-xl text-muted-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isRtl ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
      )}

    </div>
  );
}