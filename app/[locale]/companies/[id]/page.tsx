import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CategoryContent from '@/components/categories/CategoryContent';
import Image from 'next/image';

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ name?: string; desc?: string; img?: string }>;
}) {
  const { id, locale } = await params;
  const { name, desc, img } = await searchParams;
  const categoryId = parseInt(id, 10);
  const isRtl = locale === 'ar';

  return (
    <main className="min-h-screen bg-card flex flex-col selection:bg-primary/30">
      <Navbar />

      {/* Hero with optional background image */}
      <div className="relative border-b border-white/5 pt-36 pb-20 overflow-hidden min-h-[40vh] flex items-center">
        {img ? (
          <div className="absolute inset-0 z-0">
            <Image
              src={img}
              alt={name || 'Category'}
              fill
              priority
              className="object-cover opacity-30"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-linear-to-b from-background/40 via-background/80 to-background" />
            <div className="absolute inset-0 bg-linear-to-r from-background via-background/50 to-transparent" />
          </div>
        ) : (
          <>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none z-0" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/3 rounded-full blur-[120px] pointer-events-none z-0" />
          </>
        )}

        <div className="container relative z-10">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-[1.1] mb-5">
              {name ? name : (isRtl ? 'تفاصيل القسم' : 'Category')}
            </h1>

            <p className="text-white/60 text-base md:text-lg font-light leading-relaxed max-w-2xl">
              {desc ? desc : (isRtl ? 'تصفح الأقسام الفرعية والمنتجات المختارة بعناية' : 'Browse our sub-categories and curated products')}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grow container py-16 md:py-20">
        <div className="flex flex-col gap-20">
          <CategoryContent parentCategoryId={categoryId} />
        </div>
      </div>

      <Footer />
    </main>
  );
}
