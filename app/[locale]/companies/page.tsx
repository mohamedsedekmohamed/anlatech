'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AllCategoriesGrid from '@/components/home/AllCategoriesGrid';
import PageHero from '@/components/ui/PageHero';

export default function CategoriesPage() {
  const locale = useLocale();
  const isRtl = locale === 'ar';

  return (
    <main className="min-h-screen bg-card text-foreground flex flex-col selection:bg-primary/40">
      <Navbar />

      <div className="overflow-x-hidden flex-grow relative z-0">

      <PageHero
        title={isRtl ? 'مجموعة شركاتنا' : 'Our Companies'}
        subtitle={
          isRtl
            ? 'اكتشف أحدث الحلول الذكية وأرقى التصاميم العصرية لمنزلك من خلال مجموعة شركاتنا الرائدة.'
            : 'Discover the latest smart solutions and finest modern designs for your home through our leading group of companies.'
        }
      />

      <div className="flex-grow relative z-10 pb-24 md:pb-36">

        <div className="container">
          <AllCategoriesGrid />
        </div>
      </div>

      </div>

      <Footer />
    </main>
  );
}
