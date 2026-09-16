'use client';

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import { categoriesUser } from '@/services/categories';
import { useApiGet } from '@/hooks/useApi';
import SectionHeader from '@/components/ui/SectionHeader';
import CategoryCard from '@/components/ui/CategoryCard';

interface SubCategory {
  id: number;
  name: string;
  description: string;
  image: string;
}

interface SubCategoriesGridProps {
  categoryId: number;
}

export default function SubCategoriesGrid({ categoryId }: SubCategoriesGridProps) {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useApiGet(categoriesUser.getSubCategories, locale, categoryId, page);

  const responseData = data as any;
  const subCategories: SubCategory[] = responseData?.data || [];
  const totalPages = responseData?.last_page || 1;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="h-6 w-40 bg-neutral-900 rounded-full"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-[80px] bg-neutral-900/50 border border-white/2 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || subCategories.length === 0) return null;

  return (
    <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SectionHeader 
        title={isRtl ? 'تصفح الأقسام' : 'Browse Categories'}
        subtitle={isRtl ? `${subCategories.length} قسم فرعي متاح` : `${subCategories.length} sub-categories available`}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {subCategories.map((sub) => (
          <CategoryCard
            key={sub.id}
            category={sub}
            locale={locale}
            variant="sub"
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-8 h-8 rounded-lg flex items-center justify-center border border-primary/20 bg-primary/5 text-primary hover:bg-primary hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {isRtl ? '›' : '‹'}
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm transition-all duration-300 ${page === i + 1
                  ? 'bg-primary text-white shadow-md shadow-primary/25 scale-105'
                  : 'bg-primary/5 text-primary hover:bg-primary/20 border border-primary/10'
                }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="w-8 h-8 rounded-lg flex items-center justify-center border border-primary/20 bg-primary/5 text-primary hover:bg-primary hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {isRtl ? '‹' : '›'}
          </button>
        </div>
      )}
    </div>
  );
}
