'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { useApiGet } from '@/hooks/useApi';
import { aboutUser } from '@/services/userAbout';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Sparkles, ChevronRight } from 'lucide-react';

import Showservices from '@/components/about/Showservices'; 
import HomePartners from '@/components/home/HomePartners';
import { useRouter } from 'next/navigation';

// ─── Reusable High-End Animations ───

function RevealText({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <div ref={ref} className="relative overflow-hidden w-full">
      <motion.div
        initial={{ y: '100%' }}
        animate={isInView ? { y: 0 } : { y: '100%' }}
        transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

function SmoothFade({ children, delay = 0, y = 30 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-5%' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─── Main Page Component ───

export default function AboutPage() {
  const locale = useLocale();
  const isRtl = locale === 'ar';
 const router=  useRouter();
  const { data: aboutResponse, isLoading: aboutLoading } = useApiGet(aboutUser.getAbout, locale);
  const about = aboutResponse?.data;

  const pageRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: pageRef,
    offset: ['start start', 'end end']
  });

  // Parallax effects
  const textBgY = useTransform(scrollYProgress, [0, 0.5], ['0%', '40%']);
  const imageScale = useTransform(scrollYProgress, [0, 0.4], [1, 1.05]);

  return (
    <main ref={pageRef} className="bg-card text-foreground min-h-screen flex flex-col relative selection:bg-primary/40 selection:text-white">
      <Navbar />

      <div className="overflow-x-hidden flex-grow relative z-0">
      {/* Premium Cinematic Crimson Lighting */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-b from-primary/15 to-transparent rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="absolute top-[40%] left-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px] pointer-events-none z-0" />

      <div className="flex-grow relative z-10 pt-12 pb-6 md:pt-16 md:pb-8">
  <div className="container">

    {/* ── Section 1: About (Creative Split-Screen Layout) ── */}
    {/*
    {aboutLoading ? (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center mb-40">
        <div className="lg:col-span-5 h-[550px] bg-neutral-900 rounded-[2rem] animate-pulse lg:order-1" />
        <div className="lg:col-span-7 space-y-6 lg:order-2">
          <div className="h-6 w-24 bg-neutral-900 rounded animate-pulse" />
          <div className="h-16 w-full bg-neutral-900 rounded animate-pulse" />
          <div className="h-32 w-full bg-neutral-900 rounded animate-pulse" />
        </div>
      </div>
    ) : about ? (
      <section 
        className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center mb-12" 
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        ... About content commented out ...
      </section>
    ) : null}
    */}

    {/* ── Section 2: Services ── */}
  </div>
</div>

<Showservices />
<HomePartners />

      </div>
      <Footer />
    </main>
  );
}