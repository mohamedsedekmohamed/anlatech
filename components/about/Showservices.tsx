'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { useApiGet } from '@/hooks/useApi';
import { aboutUser } from '@/services/userAbout';
import SectionHeader from '@/components/ui/SectionHeader';

interface Service {
  id: number;
  name: string;
  description: string;
  icon: string;
}

const Showservices = () => {
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const { data: servicesResponse, isLoading: servicesLoading } = useApiGet(aboutUser.getServices, locale);
  const services: Service[] = servicesResponse?.data || [];

  const [hoveredService, setHoveredService] = useState<number | null>(null);

  if (servicesLoading) {
    return (
      <div className="container my-3">
        <div className="pt-16 border-t border-white/10 space-y-0">
          <div className="h-16 w-56 bg-white/5 rounded-xl mb-10 animate-pulse" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="py-8 border-b border-white/8 flex items-center gap-8 animate-pulse">
              <div className="w-5 h-4 bg-white/10 rounded" />
              <div className="w-14 h-14 bg-white/8 rounded-2xl shrink-0" />
              <div className="h-6 w-40 bg-white/10 rounded-lg" />
              <div className="flex-1 h-4 bg-white/5 rounded-full hidden lg:block" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!services.length) return null;

  return (
    <div className="container my-3">
      <section className="pt-16 border-t border-white/10">
        {/* Header */}
        <SectionHeader
          title={isRtl ? 'خدمات نتميز بصناعتها.' : 'Services we excel at.'}
          subtitle={
            isRtl
              ? 'نهج فريد يدمج الفن بالتكنولوجيا لخلق تجارب رقمية لا تُنسى.'
              : 'A bespoke approach mixing high-end design with next-generation development.'
          }
        />

        {/* Rows */}
        <div className="divide-y divide-white/8 mt-2" dir={isRtl ? 'rtl' : 'ltr'}>
          {services.map((service, index) => {
            const isHovered = hoveredService === service.id;

            return (
              <div
                key={service.id}
                onMouseEnter={() => setHoveredService(service.id)}
                onMouseLeave={() => setHoveredService(null)}
                className="group relative py-5 sm:py-9 overflow-hidden"
              >
                {/* Sliding background fill */}
                <motion.div
                  className={`absolute inset-0 bg-white/2.5 ${isRtl ? 'origin-right' : 'origin-left'}`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                />

                {/* Left accent bar */}
                <motion.div
                  className={`absolute top-0 bottom-0 w-[2px] bg-primary ${isRtl ? 'right-0' : 'left-0'}`}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                />

                <div className="relative z-10 flex flex-row lg:grid lg:grid-cols-12 gap-4 lg:gap-5 items-start lg:items-center px-4 sm:px-8">

                  {/* Number */}
                  <div className="lg:col-span-1 hidden lg:flex items-center">
                    <span className="font-mono text-xs tabular-nums text-white/20 group-hover:text-primary/60 transition-colors duration-300">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
<div className="lg:col-span-1 shrink-0 flex items-center pt-1 lg:pt-0">
  <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-2xl border border-white/8 bg-white/3 flex items-center justify-center group-hover:bg-primary group-hover:border-primary/50 transition-all duration-500 overflow-hidden shrink-0">
    <Image
      src={service.icon}
      alt={service.name}
      width={48}
      height={48}
      className="object-contain transition-all duration-500 group-hover:scale-110 group-hover:brightness-0 group-hover:invert"
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).style.display = 'none';
      }}
    />
  </div>
</div>

                  {/* Text Wrapper */}
                  <div className="flex flex-col gap-1 lg:contents">
                    {/* Title */}
                    <div className="lg:col-span-3">
                      <h4 className="text-base sm:text-xl font-bold text-white/90 group-hover:text-white transition-colors duration-300">
                        {service.name}
                      </h4>
                    </div>

                    {/* Description */}
                    <div className="lg:col-span-7">
                      <p className="text-white/40 text-sm leading-relaxed group-hover:text-white/60 transition-colors duration-300">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    
    </div>
  );
};

export default Showservices;
