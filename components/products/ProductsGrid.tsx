'use client';

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import { productsUser } from '@/services/products';
import { useApiGet } from '@/hooks/useApi';
import { Package, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';

interface ProductsGridProps {
  categoryId: number;
  parent: boolean;
}

export default function ProductsGrid({ categoryId, parent }: ProductsGridProps) {
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const [page, setPage] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);

  const { data, isLoading, error } = useApiGet(
    productsUser.getProducts,
    locale,
    categoryId,
    page,
    parent
  );

  const responseData = data as any;
  const products: any[] = responseData?.data || [];
  const totalPages = responseData?.last_page || 1;

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96 mt-10">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 bg-background rounded-full flex items-center justify-center mb-4">
          <Package className="w-10 h-10 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground text-lg font-medium">
          {isRtl
            ? 'لا توجد عناصر في الكتالوج لهذا القسم حالياً.'
            : 'No items available in the catalog for this category yet.'}
        </p>
      </div>
    );
  }

  // حساب العناصر الثلاثة (السابق، الحالي، التالي)
  const prevIndex = (activeIndex - 1 + products.length) % products.length;
  const nextIndex = (activeIndex + 1) % products.length;

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-8 animate-fade-in-up">
      
      {/* عرض السلايدر التفاعلي المتجاوب مع الموبايل والكمبيوتر */}
      <div className="flex items-center justify-center gap-2 md:gap-6 min-h-[340px] md:min-h-[380px]">
        
        {/* 1. الكارت الجانبي (يسار) - مخفي في الموبايل وبيظهر من أول الشاشات المتوسطة md */}
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
            onClick={isRtl ? handleNext : handlePrev}
            className="p-1 sm:p-2 md:p-3 text-muted-foreground hover:text-foreground transition-colors shrink-0"
            aria-label="Previous"
          >
            <ChevronRight className="w-7 h-7 md:w-8 md:h-8" />
          </button>
        )}

        {/* 3. الكارت الأوسط (الرئيسي والبارز) - واخد مساحة ممتازة في الموبايل */}
        <div className="w-[78%] sm:w-[60%] md:w-[34%] scale-100 opacity-100 transition-all duration-500 ease-out z-10 shadow-lg rounded-2xl">
          <ProductCard product={products[activeIndex]} locale={locale} />
        </div>

        {/* 4. سهم التنقل الأيمن */}
        {products.length > 1 && (
          <button
          onClick={isRtl ? handlePrev : handleNext}
          className="p-1 sm:p-2 md:p-3 text-muted-foreground hover:text-foreground transition-colors shrink-0"
          aria-label="Next"
          >
          <ChevronLeft className="w-7 h-7 md:w-8 md:h-8" />
          </button>
        )}

        {/* 5. الكارت الجانبي (يمين) - مخفي في الموبايل وبيظهر من أول الشاشات المتوسطة md */}
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
                activeIndex === index
                  ? 'w-8 bg-primary'
                  : 'w-2 bg-muted hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8 pt-6 border-t border-border">
          <button
            onClick={() => handlePageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className="w-10 h-10 rounded-xl flex items-center justify-center border border-primary/20 bg-primary/5 text-primary hover:bg-primary hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {isRtl ? '›' : '‹'}
          </button>
          
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                page === i + 1
                  ? 'bg-primary text-white shadow-md shadow-primary/25 scale-105'
                  : 'bg-primary/5 text-primary hover:bg-primary/20 border border-primary/10'
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="w-10 h-10 rounded-xl flex items-center justify-center border border-primary/20 bg-primary/5 text-primary hover:bg-primary hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {isRtl ? '‹' : '›'}
          </button>
        </div>
      )}

    </div>
  );
}