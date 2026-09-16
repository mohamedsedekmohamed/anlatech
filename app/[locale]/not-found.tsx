'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { Home, ArrowRight, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const router = useRouter();

  return (
    <main className="min-h-screen bg-card text-foreground flex flex-col relative overflow-x-hidden selection:bg-primary/40 selection:text-white">
      <Navbar />

      {/* Cinematic Lighting */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-b from-primary/15 to-transparent rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none z-0" />

      <div className="flex-grow relative z-10 flex flex-col items-center justify-center py-20 px-4 container mx-auto text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl mx-auto flex flex-col items-center"
        >
          {/* 404 Visual */}
          <div className="relative mb-8 flex justify-center items-center">
            <h1 className="text-[10rem] md:text-[14rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-white/90 to-white/10 tracking-tighter leading-none select-none drop-shadow-2xl">
              404
            </h1>
            <div className="absolute flex items-center justify-center inset-0 bg-primary/10 mix-blend-overlay blur-md" />
          </div>

          <h2 className={`text-3xl md:text-5xl font-bold text-white mb-6 ${isRtl ? 'tracking-normal' : 'tracking-tight'}`}>
            {isRtl ? 'الصفحة غير موجودة' : 'Page Not Found'}
          </h2>
          
          <p className="text-lg md:text-xl text-neutral-400 mb-10 max-w-lg leading-relaxed">
            {isRtl 
              ? 'عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها. قد يكون تم إزالتها أو أن الرابط غير صحيح.' 
              : "Sorry, we couldn't find the page you're looking for. It might have been removed or the link is incorrect."}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button 
              onClick={() => router.push(`/${locale}`)}
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary text-white font-semibold rounded-full overflow-hidden transition-all duration-300 hover:bg-primary/90 hover:scale-105 shadow-xl shadow-primary/20"
            >
              <Home className="w-5 h-5" />
              <span className="tracking-wide uppercase text-sm">{isRtl ? 'الرئيسية' : 'Back to Home'}</span>
            </button>
            
            <button 
              onClick={() => router.back()}
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-neutral-900 text-white font-semibold rounded-full border border-white/10 transition-all duration-300 hover:bg-white/5 hover:border-white/20"
            >
              {isRtl ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
              <span className="tracking-wide uppercase text-sm">{isRtl ? 'رجوع للخلف' : 'Go Back'}</span>
            </button>
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
