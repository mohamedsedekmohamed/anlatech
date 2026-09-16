'use client';

import React, { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { categoriesUser } from '@/services/categories';
import { useApiGet } from '@/hooks/useApi';
import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import CategoryCard from '@/components/ui/CategoryCard';
import SectionHeader from '@/components/ui/SectionHeader';
import Image from 'next/image';
interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
  instagram?: string;
}

interface CategoryResponse {
  current_page: number;
  data: Category[];
  total: number;
  last_page: number;
}

export default function ParentCategories() {
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const router = useRouter();
  const [expandedDesc, setExpandedDesc] = useState<Record<number, boolean>>({});

  const toggleExpand = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setExpandedDesc(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Fetch parent categories (page 1 by default)
  const { data, isLoading, error } = useApiGet(categoriesUser.getParentCategories, locale, 1);

  // Safely extract categories array from paginated response
  const responseData = data as CategoryResponse | undefined;
  const categories: Category[] = responseData?.data || [];



  if (isLoading) {
    return (
      <section className="py-16 relative z-10">
        <div className="container">
          {/* Skeleton Header */}
          <div className="flex flex-col items-center justify-center text-center mb-16 space-y-4">
            <div className="h-4 w-24 bg-white/5 rounded-full animate-pulse"></div>
            <div className="h-10 w-64 md:w-96 bg-white/10 rounded-xl animate-pulse"></div>
          </div>
          
          <div className="flex flex-col gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 md:p-8 rounded-[2rem] border bg-card/50 border-white/5 animate-pulse">
                <div className="w-40 h-40 md:w-56 md:h-56 shrink-0 rounded-2xl bg-white/10"></div>
                <div className="flex flex-col gap-4 w-full pt-2">
                  <div className="h-8 w-1/3 bg-white/10 rounded-lg"></div>
                  <div className="h-4 w-full bg-white/5 rounded-full mt-2"></div>
                  <div className="h-4 w-5/6 bg-white/5 rounded-full"></div>
                  <div className="h-4 w-2/3 bg-white/5 rounded-full"></div>
                  <div className="mt-6 flex gap-3">
                    <div className="h-11 w-32 bg-white/10 rounded-xl"></div>
                    <div className="h-11 w-11 bg-white/10 rounded-xl"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-16 relative">
      <div className="container">
        <SectionHeader 
          title={isRtl ? 'مجموعة شركاتنا' : 'Our Companies'}
          subtitle={isRtl ? 'اكتشف أحدث الحلول الذكية وأرقى التصاميم العصرية لمنزلك' : 'Discover the latest smart solutions and the finest modern designs for your home'}
          actionLabel={isRtl ? 'عرض الكل' : 'View All'}
          actionHref={`/${locale}/categories`}
          locale={locale}
        />

        {categories.length === 2 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10 mb-8 md:mb-12">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => router.push(`/${locale}/categories/${category.id}?name=${encodeURIComponent(category.name)}&desc=${encodeURIComponent(category.description || '')}&img=${encodeURIComponent(category.image || '')}`)}
                className={`group cursor-pointer relative flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 md:p-8 rounded-[2rem] transition-all duration-500 border bg-card/50 border-white/10 hover:bg-card hover:border-white/20 hover:shadow-xl hover:-translate-y-1`}
              >
                {/* Logo Area */}
           <div className="relative w-40 h-40 md:w-56 md:h-56 shrink-0 rounded-2xl overflow-hidden bg-white/5 border border-white/10 p-2 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
  {category.image ? (
    <Image 
      src={category.image} 
      alt={category.name || "Category"} 
      width={224} // نضع أقصى عرض متوقع
      height={224} // نضع أقصى طول متوقع
      className="max-w-full max-h-full object-contain drop-shadow-md"
    />
  ) : (
    <div className="text-4xl text-white/20 font-bold">{category.name.charAt(0)}</div>
  )}
</div>
                
                {/* Content Area */}
                <div className="flex flex-col flex-1 text-center sm:text-start h-full justify-center">
                  <div className="min-h-[3.5rem] md:min-h-[4rem] flex items-center justify-center sm:justify-start mb-3">
                    <h3 className="text-xl md:text-2xl font-bold text-white line-clamp-2 text-center sm:text-start w-full">
                      {category.name}
                    </h3>
                  </div>
                  
                  {category.description && (
                    <div className="relative z-20 mb-6">
                      <p className={`text-white/70 text-sm leading-relaxed transition-all duration-300 ${
                        expandedDesc[category.id] ? '' : 'line-clamp-3'
                      }`}>
                        {category.description}
                      </p>
                      {category.description.length > 120 && (
                        <button 
                          onClick={(e) => toggleExpand(e, category.id)}
                          className="text-primary text-xs font-bold mt-2 hover:underline outline-none"
                        >
                          {expandedDesc[category.id] 
                            ? (isRtl ? 'عرض أقل' : 'Read Less') 
                            : (isRtl ? 'قراءة المزيد' : 'Read More')}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="mt-auto flex flex-row items-center justify-center sm:justify-start gap-3 relative z-20">
                    <Link 
                      href={`/${locale}/categories/${category.id}?name=${encodeURIComponent(category.name)}&desc=${encodeURIComponent(category.description || '')}&img=${encodeURIComponent(category.image || '')}`}
                      onClick={(e) => e.stopPropagation()}
                      className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 border bg-white/5 text-white border-white/10 group-hover:bg-primary group-hover:border-primary group-hover:text-white shrink-0`}
                    >
                      {isRtl ? 'عرض الأقسام' : 'View Categories'}
                      {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                    </Link>

                    {category.instagram && (
                      <a 
                        href={category.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center justify-center w-11 h-11 shrink-0 rounded-xl bg-white/5 text-white border border-white/10 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:border-transparent transition-all duration-300"
                        title={isRtl ? 'انستجرام' : 'Instagram'}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
              {categories.slice(0, 6).map((category) => (
                <div
                  key={category.id}
                  onClick={() => router.push(`/${locale}/categories/${category.id}?name=${encodeURIComponent(category.name)}&desc=${encodeURIComponent(category.description || '')}&img=${encodeURIComponent(category.image || '')}`)}
                  className="group cursor-pointer relative flex flex-col p-6 rounded-[2rem] border bg-card/50 border-white/10 hover:bg-card hover:border-white/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
                >
                 <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/10 p-4 mb-6 flex items-center justify-center transition-transform duration-500 group-hover:scale-[1.02]">
  {category.image ? (
    <Image 
      src={category.image} 
      alt={category.name || "Category"} 
      fill
      className="object-contain p-4 drop-shadow-md transition-transform duration-500 group-hover:scale-110"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  ) : (
    <div className="text-4xl text-white/20 font-bold">{category.name.charAt(0)}</div>
  )}
</div>
                  
                  <div className="flex flex-col flex-1">
                    <div className="min-h-[3.5rem] mb-3">
                      <h3 className="text-xl font-bold text-white line-clamp-2">{category.name}</h3>
                    </div>
                    
                    {category.description && (
                      <div className="relative z-20 mb-6 flex-1">
                        <p className={`text-white/70 text-sm leading-relaxed transition-all duration-300 ${
                          expandedDesc[category.id] ? '' : 'line-clamp-3'
                        }`}>
                          {category.description}
                        </p>
                        {category.description.length > 100 && (
                          <button 
                            onClick={(e) => toggleExpand(e, category.id)}
                            className="text-primary text-xs font-bold mt-2 hover:underline outline-none"
                          >
                            {expandedDesc[category.id] 
                              ? (isRtl ? 'عرض أقل' : 'Read Less') 
                              : (isRtl ? 'قراءة المزيد' : 'Read More')}
                          </button>
                        )}
                      </div>
                    )}
                    
                    <div className="mt-auto flex flex-row items-center gap-3 pt-4 border-t border-white/5 relative z-20">
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 border bg-white/5 text-white border-white/10 group-hover:bg-primary group-hover:border-primary group-hover:text-white shrink-0">
                        {isRtl ? 'عرض الأقسام' : 'View Categories'}
                        {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                      </span>
                      
                      {category.instagram && (
                        <a 
                          href={category.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center justify-center w-10 h-10 shrink-0 rounded-xl bg-white/5 text-white border border-white/10 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:border-transparent transition-all duration-300"
                          title={isRtl ? 'انستجرام' : 'Instagram'}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {(categories.length > 6 || categories.length > 2) && (
              <div className="mt-12 flex justify-center">
                <Link
                  href={`/${locale}/categories`}
                  className="flex items-center gap-2 px-8 py-3 rounded-full bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-white font-bold transition-all text-sm shadow-sm backdrop-blur-sm"
                >
                  {isRtl ? 'عرض كل الشركات' : 'View All Companies'}
                  {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
