'use client';

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import { userHome } from '@/services/userHome';
import { useApiGet } from '@/hooks/useApi';
import { Package, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';

export default function AllProductsGrid() {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const [page, setPage] = useState(1);
  
  const { data, isLoading, error } = useApiGet(userHome.allProducts, locale, page);

  const products: any[] = data?.data || [];
  const lastPage = data?.last_page || 1;

  if (isLoading && products.length === 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 mt-10">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <div key={i} className="flex flex-col gap-4 animate-pulse">
            <div className="w-full aspect-[4/5] bg-muted rounded-3xl"></div>
            <div className="h-4 w-3/4 bg-muted rounded-full"></div>
            <div className="h-4 w-1/2 bg-muted rounded-full"></div>
          </div>
        ))}
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

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 animate-fade-in-up">
        {products.map(product => (
          <ProductCard key={product.id} product={product} locale={locale} />
        ))}
      </div>

      {/* Pagination */}
      {lastPage > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 bg-card border border-border rounded-xl text-muted-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isRtl ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
          
          <div className="flex items-center gap-2">
            {[...Array(lastPage)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
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
            onClick={() => setPage(p => Math.min(lastPage, p + 1))}
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
