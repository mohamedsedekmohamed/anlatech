'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { categoriesUser } from '@/services/categories';
import { useApiGet } from '@/hooks/useApi';
import { Layers, ArrowRight, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AOS from 'aos';
import 'aos/dist/aos.css';

interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
  images?: any[];
  instagram?: string;
}

interface CategoryResponse {
  current_page: number;
  data: Category[];
  total: number;
  last_page: number;
}

export default function AllCategoriesGrid() {
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const [page] = useState(1);
  const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({});
  const { data, isLoading, error } = useApiGet(categoriesUser.getParentCategories, locale, page);

  const responseData = data as CategoryResponse | undefined;
  const categories: Category[] = responseData?.data || [];

  const router = useRouter();

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50,
    });
  }, []);

  /* ─── Loading skeleton ─── */
  if (isLoading) {
    return (
      <div className="flex flex-col w-full">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col md:flex-row items-center gap-12 py-8 md:py-16 animate-pulse border-b border-white/5 last:border-b-0">
            <div className="w-full md:w-1/2 aspect-4/3 rounded-2xl bg-white/6 shrink-0" />
            <div className="flex flex-col gap-5 w-full md:w-1/2">
              <div className="h-4 w-16 bg-primary/20 rounded" />
              <div className="h-10 w-3/4 bg-white/10 rounded-xl" />
              <div className="h-4 w-full bg-white/5 rounded-full" />
              <div className="h-4 w-5/6 bg-white/5 rounded-full" />
              <div className="h-4 w-2/3 bg-white/5 rounded-full" />
              <div className="flex gap-3 mt-2">
                <div className="h-11 w-32 bg-white/10 rounded-xl" />
                <div className="h-11 w-36 bg-white/5 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  /* ─── Empty state ─── */
  if (error || categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-5">
          <Layers className="w-9 h-9 text-primary/60" />
        </div>
        <p className="text-foreground font-bold text-lg mb-1">
          {isRtl ? 'لا توجد أقسام متاحة' : 'No categories found'}
        </p>
        <p className="text-muted-foreground text-sm">
          {isRtl ? 'تفقد لاحقاً لمزيد من المنتجات.' : 'Check back later for more products.'}
        </p>
      </div>
    );
  }

  /* ─── Main list ─── */
  return (
    <div className="flex flex-col w-full">
      {categories.map((category, index) => {
        const isEven = index % 2 === 0;

        return (
          <div
            key={category.id}
            className={`group relative w-full flex flex-col md:items-stretch gap-8 md:gap-12 xl:gap-16 py-10 md:py-14 xl:py-16 border-b border-white/6 last:border-b-0 ${
              isEven ? 'md:flex-row' : 'md:flex-row-reverse'
            }`}
          >
            {/* ── Ambient glow behind the whole row ── */}
            <div
              className={`pointer-events-none absolute top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[150px] opacity-0 group-hover:opacity-40 transition-opacity duration-1000 ${
                isEven ? '-start-40' : '-end-40'
              } bg-primary/5`}
            />

            {/* ── Image side (بدون سكرول وبارتفاع طبيعي) ── */}
            <div className="flex flex-col gap-6 md:gap-10 shrink-0 w-[160px] md:w-[45%] xl:w-[40%] md:max-w-[380px] xl:max-w-[440px] mx-auto md:mx-0">
              {/* شلنا overflow-y-auto و aspect-[4/5] عشان ميكونش في سكرول داخلي */}
              <div className="relative w-full h-auto rounded-[32px] flex flex-col gap-4">
                
                {(() => {
                  const allImages = [
                    category.image,
                    ...(category.images?.map((img: any) => img?.image_path || img?.image || img?.url || img) || []),
                  ].filter(Boolean);

                  const firstImage = allImages[0];
                  // أخذ أول 3 صور إضافية فقط كحد أقصى
                  const remainingImages = allImages.slice(1, 4);

                  return (
                    <div className="flex flex-col gap-4 w-full">
                      {/* ── الصورة الأساسية فوق بحجمها الأصلي ── */}
                      {firstImage ? (
                        <div
                          data-aos="fade-up"
                          onClick={() =>
                            router.push(
                              `/${locale}/companies/${category.id}?name=${encodeURIComponent(category.name)}&desc=${encodeURIComponent(category.description || '')}&img=${encodeURIComponent(category.image || '')}`
                            )
                          }
                          className="relative w-full aspect-[4/3] shrink-0 rounded-[32px] overflow-hidden cursor-pointer group/img bg-white/3 border border-white/5"
                        >
                          <div className="absolute inset-0 z-10 bg-linear-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                          <Image
                            src={firstImage}
                            alt={`${category.name} main image`}
                            fill
                            sizes="(max-width: 768px) 100vw, 46vw"
                            className="object-contain p-6 transition-transform duration-700 ease-out group-hover/img:scale-105"
                          />
                        </div>
                      ) : (
                        <div
                          data-aos="fade-up"
                          className="relative w-full aspect-[4/3] shrink-0 rounded-[32px] bg-white/3 border border-white/5 flex items-center justify-center"
                        >
                          <span className="text-8xl font-black text-white/10">{category.name.charAt(0)}</span>
                        </div>
                      )}

                      {/* ── باقي الصور تحتها (أقصى حاجة 3 صور بدون سكرول) ── */}
                      {remainingImages.length > 0 && (
                        <div className="columns-2 gap-3 md:gap-4 space-y-3 md:space-y-4">
                          {remainingImages.map((imgSrc, imgIndex) => {
                            const aspectRatios = [
                              'aspect-[3/4]',
                              'aspect-[4/3]',
                              'aspect-[4/5]',
                              'aspect-[16/9]',
                            ];
                            const selectedAspect = aspectRatios[imgIndex % aspectRatios.length];

                            return (
                              <div
                                key={`${category.id}-img-${imgIndex + 1}`}
                                data-aos="fade-up"
                                data-aos-delay={Math.min((imgIndex + 1) * 100, 300)}
                                onClick={() =>
                                  router.push(
                                    `/${locale}/companies/${category.id}?name=${encodeURIComponent(category.name)}&desc=${encodeURIComponent(category.description || '')}&img=${encodeURIComponent(category.image || '')}`
                                  )
                                }
                                className={`relative w-full break-inside-avoid rounded-[24px] overflow-hidden cursor-pointer group/img  border border-white/5 ${selectedAspect}`}
                              >
                                <div className="absolute inset-0 z-10 bg-black/10 group-hover/img:bg-black/0 transition-colors duration-300 pointer-events-none" />
                                <Image
                                  src={imgSrc}
                                  alt={`${category.name} sub image ${imgIndex + 1}`}
                                  fill
                                  sizes="(max-width: 768px) 50vw, 23vw"
                                  className="object-contain p-4 transition-transform duration-700 ease-out group-hover/img:scale-105"
                                />
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* ── Content side (Flex Column with mt-auto for buttons) ── */}
            <div className="relative z-10 flex flex-col justify-between flex-1 w-full md:sticky md:top-32 md:pb-4 min-h-[320px]">
              
              {/* الجزء العلوي: النصوص والتفاصيل */}
              <div className="flex flex-col items-center md:items-start text-center md:text-start gap-4 md:gap-6">
                {/* Counter */}
                <div className="hidden lg:flex items-center gap-3">
                  <span className="text-primary font-black text-3xl md:text-5xl leading-none tabular-nums opacity-20 select-none">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="h-px flex-1 bg-white/8 max-w-[60px]" />
                </div>

                {/* Title */}
                <h2 className="text-xl md:text-3xl xl:text-4xl font-black text-white leading-tight tracking-tight">
                  {category.name}
                </h2>

                {/* Description */}
                {category.description && (
                  <div className="flex flex-col gap-1 items-center md:items-start">
                    <p
                      className={`text-white/50 text-sm md:text-base leading-relaxed max-w-lg transition-all ${
                        expandedCategories[category.id] || category.description.length <= 150 ? '' : 'line-clamp-3'
                      }`}
                    >
                      {category.description}
                    </p>
                    {category.description.length > 150 && (
                      <button
                        onClick={() =>
                          setExpandedCategories((prev) => ({ ...prev, [category.id]: !prev[category.id] }))
                        }
                        className="text-primary/80 hover:text-primary text-xs font-bold underline-offset-4 hover:underline transition-all mt-1"
                      >
                        {expandedCategories[category.id]
                          ? isRtl
                            ? 'إخفاء التفاصيل'
                            : 'Show Less'
                          : isRtl
                          ? 'عرض التفاصيل'
                          : 'Show Details'}
                      </button>
                    )}
                  </div>
                )}

                {/* Red accent line */}
                <div className="w-10 h-0.5 bg-primary rounded-full" />
              </div>

              {/* الجزء السفلي: الأزرار مع محاذاة متغيرة (يمين/شمال) حسب الصف */}
              <div
                className={`flex flex-row flex-wrap items-center justify-center gap-3 mt-8 md:mt-auto pt-4 border-t border-white/5 md:border-t-0 ${
                  isEven ? 'md:justify-end' : 'md:justify-start'
                }`}
              >
                {/* Read More */}
                <Link
                  href={`/${locale}/companies/${category.id}?name=${encodeURIComponent(category.name)}&desc=${encodeURIComponent(category.description || '')}&img=${encodeURIComponent(category.image || '')}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold text-sm shadow-[0_4px_20px_rgba(255,0,0,0.15)] hover:bg-primary-500 hover:shadow-[0_6px_30px_rgba(255,0,0,0.25)] active:scale-95 transition-all duration-300"
                >
                  {isRtl ? 'اقرأ المزيد' : 'Read More'}
                  {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </Link>

                {/* Instagram */}
                {category.instagram && (
                  <a
                    href={category.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-11 h-11 shrink-0 rounded-xl border border-white/10 text-white/60 hover:bg-linear-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:text-white hover:border-transparent hover:shadow-[0_4px_20px_rgba(220,39,67,0.3)] active:scale-95 transition-all duration-300"
                    title={isRtl ? 'انستجرام' : 'Instagram'}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  </a>
                )}
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
}