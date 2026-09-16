'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { useApiGet } from '@/hooks/useApi';
import { userHome } from '@/services/userHome';
import Image from 'next/image';
export default function Footer() {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const t = useTranslations('home');

  const { data: response, isLoading } = useApiGet(userHome.getFooter, locale);
  const footerData = response?.data;

  // Render a high-end dark skeleton during loading for a premium experience
  if (isLoading) {
    return (
      <footer className="bg-background border-t border-white/10 pt-16 pb-8 mt-auto">
        <div className="container animate-pulse">
          <div className="h-48 bg-neutral-900/50 rounded-3xl border border-white/5"></div>
        </div>
      </footer>
    );
  }

  // Fallback defaults in case data is missing
  const rawBrandName = footerData?.brand_name;
  let brandName = 'Codixia';
  if (rawBrandName) {
    if (typeof rawBrandName === 'string') {
      brandName = rawBrandName;
    } else if (typeof rawBrandName === 'object' && !Array.isArray(rawBrandName)) {
      brandName = rawBrandName[locale] || rawBrandName['en'] || 'Codixia';
    }
  }

  const logoUrl = footerData?.logo_url;
  const description = isRtl
    ? 'نستعرض أفضل المنتجات والخدمات المميزة بأعلى معايير الجودة لتلبية كافة احتياجاتك.'
    : 'Showcasing the best premium products and services with the highest quality standards to meet all your needs.';

  return (
    <footer className="bg-background border-t border-white/10 pt-16 pb-8 mt-auto relative overflow-hidden">

      {/* Subtle Bottom Crimson Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-primary/5 rounded-full blur-[160px] opacity-40 pointer-events-none z-0" />

      <div className="container relative z-10" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">

          {/* Brand Info */}
          <div className="flex flex-col gap-6 items-center md:items-start">
            <Link href={`/${locale}`}>
              <div className="flex items-center justify-center md:justify-start gap-3 md:gap-6 flex-nowrap">

                {/* Logo 1 */}
                {logoUrl && (
                  <div className="group flex flex-col items-center">
                    <div className="w-28 h-24 md:w-36 md:h-32 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-lg flex items-center justify-center transition-all duration-300 hover:border-primary hover:-translate-y-1 hover:shadow-primary/20">
                      <Image
                        src={logoUrl}
                        alt={brandName || "Logo"}
                        width={110}
                        height={90}
                        className="object-contain max-h-20 transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    <p className="mt-3 text-center font-bold text-primary text-lg">
                      {isRtl ? footerData?.name_1?.ar : footerData?.name_1?.en}
                    </p>
                  </div>
                )}

                {/* Logo 2 */}
                {footerData?.logo_url1 && (
                  <div className="group flex flex-col items-center">
                    <div className="w-28 h-24 md:w-36 md:h-32 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-lg flex items-center justify-center transition-all duration-300 hover:border-primary hover:-translate-y-1 hover:shadow-primary/20">
                      <Image
                        src={footerData.logo_url1}
                        alt="Logo 2"
                        width={110}
                        height={90}
                        className="object-contain max-h-20 transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    <p className="mt-3 text-center font-bold text-primary text-lg">
                      {isRtl ? footerData?.name_2?.ar : footerData?.name_2?.en}
                    </p>
                  </div>
                )}

              </div>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-6 md:col-span-2">
            {/* Quick Links */}
            <div className="flex flex-col items-center md:items-start text-center md:text-start">
              <h3 className="text-base md:text-lg font-bold text-primary tracking-wide mb-6 uppercase">
                {isRtl ? 'روابط سريعة' : 'Quick Links'}
              </h3>
              <ul className="flex flex-col gap-4 items-start inline-flex md:flex">
                {[
                  { href: '', labelAr: 'الرئيسية', labelEn: 'Home' },
                  { href: '/catalog', labelAr: 'الكتالوج', labelEn: 'Catalog' },
                  { href: '/companies', labelAr: 'الشركات', labelEn: 'Companies' },
                  { href: '/about', labelAr: 'من نحن', labelEn: 'About Us' },
                  { href: '/contact', labelAr: 'اتصل بنا', labelEn: 'Contact Us' }
                ].map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={`/${locale}${link.href}`}
                      className="text-neutral-400 hover:text-primary transition-colors duration-300 text-sm flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-primary/40 group-hover:bg-primary group-hover:scale-125 transition-all duration-300" />
                      {isRtl ? link.labelAr : link.labelEn}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col items-center md:items-start text-center md:text-start">
              <h3 className="text-base md:text-lg font-bold text-primary tracking-wide mb-6 uppercase">
                {isRtl ? 'معلومات التواصل' : 'Contact Info'}
              </h3>
              <ul className="flex flex-col gap-5 items-start inline-flex md:flex">
                <li className="flex items-start gap-3 group">
                  <MapPin className="w-5 h-5 text-primary shrink-0 group-hover:scale-110 transition-transform duration-300" />
                  {footerData?.map ? (
                    <a href={footerData.map} target="_blank" rel="noopener noreferrer" className="text-neutral-400 text-sm leading-relaxed hover:text-primary transition-colors duration-300">
                      {footerData?.address}
                    </a>
                  ) : (
                    <span className="text-neutral-400 text-sm leading-relaxed">
                      {footerData?.address}
                    </span>
                  )}
                </li>
                <li className="flex items-center gap-3 group">
                  <Phone className="w-5 h-5 text-primary shrink-0 group-hover:scale-110 transition-transform duration-300" />
                  {footerData?.phone ? (
                    <a href={`tel:${footerData.phone}`} className="text-neutral-400 text-sm font-medium hover:text-primary transition-colors duration-300" dir="ltr">
                      {footerData.phone}
                    </a>
                  ) : (
                    <span className="text-neutral-400 text-sm font-medium" dir="ltr">
                      +966 50 123 4567
                    </span>
                  )}
                </li>
                <li className="flex items-center gap-3 group">
                  <Mail className="w-5 h-5 text-primary shrink-0 group-hover:scale-110 transition-transform duration-300" />
                  <a href={`mailto:${footerData?.email || 'support@codixia.com'}`} className="text-neutral-400 text-sm hover:text-primary transition-colors duration-300 break-all">
                    {footerData?.email || 'support@codixia.com'}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright & Social Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <p className="text-neutral-500 text-sm text-center lg:text-start font-light tracking-wide order-3 lg:order-1">
            © {new Date().getFullYear()} <span className="text-neutral-300 font-medium">Beup</span>. {isRtl ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </p>

          {/* Social Links Centered */}
          <div className="flex justify-center items-center gap-3 order-1 lg:order-2">
            {footerData?.wattsapp && (
              <a
                href={`https://wa.me/${footerData.wattsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-card/5 border border-[#25D366]/50 flex items-center justify-center text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-[#25D366]/10"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              </a>
            )}
            {footerData?.facebook && (
              <a
                href={footerData.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-card/5 border border-[#1877F2]/50 flex items-center justify-center text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-[#1877F2]/10"
              >
                <Facebook className="w-4 h-4" />
              </a>
            )}
            {footerData?.insta && (
              <a
                href={footerData.insta}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-card/5 border border-[#E4405F]/50 flex items-center justify-center text-[#E4405F] hover:border-transparent hover:text-white hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-[#E4405F]/10"
              >
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {footerData?.tiktok && (
              <a
                href={footerData.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-10 h-10 rounded-xl bg-card/5 border border-white/20 flex items-center justify-center text-white hover:border-transparent hover:shadow-[0_0_15px_rgba(255,0,80,0.4)] transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-black/20 overflow-hidden"
              >
                {/* Gradient Background that fades in smoothly */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#00f2fe] to-[#ff0050] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <svg className="w-4 h-4 relative z-10" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
              </a>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-neutral-500 font-light order-2 lg:order-3">
            {isRtl ? 'مدعوم بواسطة' : 'Powered by'}
            <a
              href="https://codixiatech.online/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-primary/20 bg-primary/5 text-primary hover:bg-primary hover:text-white hover:border-primary hover:shadow-[0_0_16px_rgba(255,0,0,0.15)] transition-all duration-300 font-semibold tracking-wide text-xs"
            >

              Codixia
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
