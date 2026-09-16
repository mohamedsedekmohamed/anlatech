'use client';

import React, { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { categoriesUser } from '@/services/categories';
import { useApiGet } from '@/hooks/useApi';
import ProductsGrid from '@/components/products/ProductsGrid';

interface Category {
  id: number;
  name: string;
  description?: string;
  image?: string;
}

interface CategoryContentProps {
  parentCategoryId: number;
}

export default function CategoryContent({ parentCategoryId }: CategoryContentProps) {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  
  const [activeCategoryId, setActiveCategoryId] = useState<number>(parentCategoryId);
  
  // Fetch subcategories for the given parent category
  const { data, isLoading } = useApiGet(categoriesUser.getSubCategories, locale, parentCategoryId, 1);
  const responseData = data as any;
  const subCategories: Category[] = responseData?.data || [];

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Subcategory Tabs Navigation */}
      {!isLoading && (
        <div className="w-full flex items-center justify-start overflow-x-auto pb-4 hide-scrollbar">
          <div className="flex gap-2 p-1 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 w-max min-w-full sm:min-w-0">
            {/* "All" Tab */}
            <button
              onClick={() => setActiveCategoryId(parentCategoryId)}
              className={`px-6 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-300 ${
                activeCategoryId === parentCategoryId
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {isRtl ? 'الكل' : 'All'}
            </button>
            
            {/* Dynamic Subcategory Tabs */}
            {subCategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setActiveCategoryId(sub.id)}
                className={`px-6 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-300 ${
                  activeCategoryId === sub.id
                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading State for Tabs */}
      {isLoading && (
        <div className="w-full flex gap-2 overflow-x-hidden pb-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 w-24 bg-white/5 rounded-xl animate-pulse shrink-0"></div>
          ))}
        </div>
      )}

      {/* Products Grid for the Active Category/Subcategory */}
      <div className="w-full mt-4">
        {/* We key it by activeCategoryId to force unmount/remount so state (like page) resets */}
        <ProductsGrid key={activeCategoryId} categoryId={activeCategoryId}  parent={activeCategoryId === parentCategoryId}/>
      </div>
    </div>
  );
}
