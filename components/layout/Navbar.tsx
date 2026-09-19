'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import UITranslateBtn from '@/components/ui/UITranslateBtn';
import { useApiGet } from '@/hooks/useApi';
import { userHome } from '@/services/userHome';
import Image from 'next/image';
export default function Navbar() {
  const t = useTranslations('navbar');
  const locale = useLocale();
  const pathname = usePathname();
  const isRtl = locale === 'ar';

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: footerResponse, isLoading } = useApiGet(
    userHome.getFooter,
    locale
  );

  const settings = footerResponse?.data;
  const brandName = settings?.brand_name || 'Deluxe Relax';
  const logoUrl = settings?.logo_url;
  const logoUrl1 = settings?.logo_url1;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // نصيحة: يُفضل نقل هذه النصوص الثابتة إلى ملفات الترجمة الخاصة بك لتوحيد الكود
  const navLinks = [
    { name: t('home'), href: `/${locale}` },
    { name: t('catalog'), href: `/${locale}/catalog` },
    { name: t('companies'), href: `/${locale}/companies` },
    // { name: t('about'), href: `/${locale}/about` },
    { name: t('contact'), href: `/${locale}/contact` },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-500
          bg-background/50 backdrop-blur-xl border-b border-primary/20 py-[6px] shadow-lg
      `}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="container">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo 1 (Far Left) */}
          <Link
            href={`/${locale}`}
            className="flex items-center shrink-0"
          >
            {isLoading ? (
              <div className="h-10 w-28 md:h-14 md:w-44 bg-white/10 animate-pulse rounded-xl" />
            ) : (
              logoUrl1 && (
                <div className="flex items-center backdrop-blur-md border-transparent rounded-full px-2.5 py-1.5 md:px-3.5 md:py-2 shadow-sm hover:border-primary/40 transition-all duration-300">
                  <Image
                    src={logoUrl1}
                    alt="Relax Logo"
                    width={40}
                    height={40}
                    className="w-8 h-8 md:w-10 md:h-10 object-contain transition-transform duration-300 hover:scale-105"
                  />
                </div>
              )
            )}
          </Link>

          {/* Desktop Menu (Centered) */}
          <div className="hidden md:flex items-center justify-center gap-6 lg:gap-10">
            {navLinks.map((link) => {
              const normalizedPath = pathname.replace(new RegExp(`^/${locale}`), '') || '/';
              const normalizedHref = link.href.replace(new RegExp(`^/${locale}`), '') || '/';
              
              const isActive = 
                normalizedPath === normalizedHref || 
                (normalizedHref !== '/' && normalizedPath.startsWith(normalizedHref + '/')) ||
                (normalizedHref !== '/' && normalizedPath === normalizedHref);
              
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative group text-sm lg:text-base font-medium transition-colors duration-300 ${
                    isActive ? 'text-primary' : 'text-neutral-300 hover:text-white'
                  }`}
                >
                  {link.name}
                  <span className={`absolute ${isRtl ? 'right-0' : 'left-0'} -bottom-1.5 h-[2px] bg-primary transition-all duration-300 ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </Link>
              );
            })}
            <div className="hidden md:block">
              <UITranslateBtn />
            </div>
          </div>

          {/* Logo 2 (Far Right) & Mobile Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            {logoUrl && (
              <Link href={`/${locale}`} className="flex items-center">
                <div className="flex items-center backdrop-blur-md border-transparent rounded-full px-2.5 py-1.5 md:px-3.5 md:py-2 shadow-sm hover:border-primary/40 transition-all duration-300">
                  <Image
                    src={logoUrl}
                    alt={brandName || "Logo"}
                    width={40}
                    height={40}
                    className="w-8 h-8 md:w-10 md:h-10 object-contain transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </Link>
            )}
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white bg-white/5 border border-white/10 hover:bg-primary/20 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary/50"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 w-full bg-background/95 backdrop-blur-3xl border-b border-primary/20 transition-all duration-300 overflow-hidden ${
          mobileMenuOpen ? 'max-h-[500px] border-b opacity-100' : 'max-h-0 border-transparent opacity-0'
        }`}
      >
        <div className="p-4 sm:p-6 flex flex-col gap-2">
          {navLinks.map((link) => {
            const normalizedPath = pathname.replace(new RegExp(`^/${locale}`), '') || '/';
            const normalizedHref = link.href.replace(new RegExp(`^/${locale}`), '') || '/';
            
            const isActive = 
              normalizedPath === normalizedHref || 
              (normalizedHref !== '/' && normalizedPath.startsWith(normalizedHref + '/')) ||
              (normalizedHref !== '/' && normalizedPath === normalizedHref);
            
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-base sm:text-lg font-medium p-3 rounded-lg transition-all ${
                  isActive ? 'text-primary bg-primary/10' : 'text-neutral-300 hover:text-primary hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          <div className="pt-4 mt-2 border-t  flex items-center justify-between px-3">
           
            <UITranslateBtn />
          </div>
        </div>
      </div>
    </nav>
  );
}
