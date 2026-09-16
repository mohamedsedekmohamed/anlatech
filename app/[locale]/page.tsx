import Navbar from "@/components/layout/Navbar";
import AllCategoriesGrid from "@/components/home/AllCategoriesGrid";
import SectionHeader from "@/components/ui/SectionHeader";
import Footer from "@/components/layout/Footer";
import HeroSlider from "@/components/layout/HeroSlider";
import Showservices from '@/components/about/Showservices';
import HomePartners from '@/components/home/HomePartners';

async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isRtl = locale === 'ar';

  return (
    <main className="min-h-screen bg-card flex flex-col">
      <Navbar />
      <HeroSlider/>
      
      <section className="py-10 md:py-16 lg:py-24 relative overflow-hidden">
        {/* Section header stays centered */}
        <div className="container">
          <SectionHeader 
            title={isRtl ? 'مجموعة شركاتنا' : 'Our Companies'}
            subtitle={isRtl ? 'اكتشف أحدث الحلول الذكية وأرقى التصاميم العصرية لمنزلك' : 'Discover the latest smart solutions and the finest modern designs for your home'}
            actionLabel={isRtl ? 'عرض الكل' : 'View All'}
            actionHref={`/${locale}/companies`}
            locale={locale}
          />
        </div>
        {/* Grid spans full width with generous side padding */}
        <div className="container">
          <AllCategoriesGrid />
        </div>
      </section>
      <Showservices />
      
      <HomePartners />

      <Footer />
    </main>
  );
}

export default Home;
