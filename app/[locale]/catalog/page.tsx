'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AllProductsGrid from "@/components/products/AllProductsGrid";
import PageHero from "@/components/ui/PageHero";
import ProductsCarousel from "@/components/ui/ProductsCarousel";
export default function ProductsPage() {
  const locale = useLocale();
  const isRtl = locale === 'ar';

  return (
    <main className="min-h-screen bg-card text-foreground flex flex-col selection:bg-primary/40">
      <Navbar />

      <PageHero
        title={isRtl ? 'الكتالوج' : 'Catalog'}
        subtitle={
          isRtl
            ? 'اكتشف مجموعتنا الواسعة من المنتجات المتنوعة واستمتع بتجربة تسوق فاخرة لا مثيل لها ضمن الكتالوج.'
            : 'Discover our wide range of diverse products and enjoy an unparalleled premium shopping experience in our catalog.'
        }
      />

      {/* Products Grid Section */}
      <div className="grow container py-16 md:py-20">
        <ProductsCarousel />
      </div>

      <Footer />
    </main>
  );
}
