'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Cookies from 'js-cookie';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Tag,
  MapPin,
  Map,
  CreditCard,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  Flag,
  X,
  LogOut,
  Settings,
  ShoppingBag,
  LucideIcon,
  Info,
  MessageSquare,
  Replace,
  Briefcase,
  Handshake,
  Globe
} from 'lucide-react';
import { useTransition } from 'react';
import { useState } from 'react';
import ROUTES from '@/core/manager/route.manager';
import { useApiGet } from '@/hooks/useApi';
import { userHome } from '@/services/userHome';
import Image from 'next/image';
const mainNav = [
  { labelKey: 'admins', icon: ShieldCheck, href: ROUTES.dashboard.admin },
  { labelKey: 'banners', icon: Flag, href: ROUTES.dashboard.banners },
  { labelKey: 'Partners', icon: Handshake, href: ROUTES.dashboard.Partners },
];

const catalogNav = [
  { labelKey: 'products', icon: ShoppingBag, href: ROUTES.dashboard.products },
  { labelKey: 'categories', icon: Tag, href: ROUTES.dashboard.categories },
  { labelKey: 'subCategories', icon: Replace, href: ROUTES.dashboard.subcategories },
];

const WebSettings = [
  { labelKey: 'services', icon: Briefcase, href: ROUTES.dashboard.Service },
  // { labelKey: 'aboutUs', icon: Info, href: ROUTES.dashboard.About },
  { labelKey: 'contactUs', icon: MessageSquare, href: ROUTES.dashboard.Contact },
];

// ─── 1️⃣ المكونات الفرعية المستقلة (خارج الـ Render تماماً) ──────────────────────

interface NavLinkProps {
  label: string;
  icon: LucideIcon;
  href: string;
  locale: string;
  pathname: string;
  collapsed: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}


const NavLink = ({ label, icon: Icon, href, locale, pathname, collapsed, setMobileOpen }: NavLinkProps) => {
  const isActive = (href: string) => {
    const withLocale = `/${locale}${href}`;
    const withoutLocale = href;

    const matches = (base: string) =>
      pathname === base || pathname.startsWith(base + '/');

    if (href === ROUTES.dashboard.overview) {
      return pathname === withLocale || pathname === withoutLocale || pathname === '/dashboard';
    }

    return matches(withLocale) || matches(withoutLocale);
  };

  const active = isActive(href);

  return (
    <Link
      href={`/${locale}${href}`}
      onClick={() => setMobileOpen(false)}
      title={collapsed ? label : undefined}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group
        ${active
          ? 'bg-primary text-white shadow-sm'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        }
        ${collapsed ? 'justify-center' : ''}
      `}
    >
      <Icon
        className={`w-[18px] h-[18px] shrink-0 ${active ? 'text-white' : 'text-muted-foreground group-hover:text-foreground'}`}
        strokeWidth={1.75}
      />
      {!collapsed && <span className="flex-1 text-start">{label}</span>}
      {!collapsed && active && (
        <ChevronRight className="w-3.5 h-3.5 opacity-60 transition-transform ltr:block rtl:hidden" />
      )}
      {!collapsed && active && (
        <ChevronRight className="w-3.5 h-3.5 opacity-60 transition-transform hidden rtl:block rotate-180" />
      )}
    </Link>
  );
};

const SectionLabel = ({ label, collapsed }: { label: string; collapsed: boolean }) =>
  collapsed ? (
    <div className="mx-3 my-1 h-px bg-[#E7E7E7]" />
  ) : (
    <p className="px-3 pt-4 pb-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest text-start">
      {label}
    </p>
  );

// ─── 2️⃣ مكون محتوى السايدبار الداخلي (مستقل) ───────────────────────────────────

interface SidebarContentProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  locale: string;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  pathname: string;
}

const SidebarContent = ({ collapsed, setCollapsed, locale, setMobileOpen, pathname }: SidebarContentProps) => {
  const router = useRouter();
  const { data: response } = useApiGet(userHome.getFooter, locale);
  const logoUrl = response?.data?.logo_url;
  const logoUrl1 = response?.data?.logo_url1;
  const t = useTranslations('admin.sidebar');
  const [, startTransition] = useTransition();

  const changeLanguage = () => {
    const nextLocale = locale === 'en' ? 'ar' : 'en';
    const pathWithoutLocale = pathname.replace(/^\/(en|ar)(\/|$)/, '/');
    const newPath = `/${nextLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
    
    startTransition(() => {
      router.replace(newPath);
    });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ── Logo + Collapse btn ── */}
      <div className={`flex items-center h-16 px-4 border-b border-border shrink-0 ${collapsed ? 'justify-center' : 'justify-between'}`}>
        <div className="flex items-center gap-2.5 overflow-hidden cursor-pointer" onClick={() => router.push(`/${locale}`)}>
          {(logoUrl || logoUrl1) ? (
         <div className={`flex items-center ${collapsed ? 'flex-col gap-1' : 'gap-2'}`}>
  {logoUrl && (
    <Image 
      src={logoUrl} 
      alt="Logo" 
      width={collapsed ? 24 : 32} // 24px للـ collapsed و 32px للحالة العادية
      height={collapsed ? 24 : 32} 
      className="object-contain shrink-0" 
    />
  )}
  
  {logoUrl && logoUrl1 && !collapsed && (
    <div className="w-px h-6 bg-border mx-1" />
  )}
  
  {logoUrl1 && (
    <Image 
      src={logoUrl1} 
      alt="Logo 2" 
      width={collapsed ? 24 : 32} 
      height={collapsed ? 24 : 32} 
      className="object-contain shrink-0" 
    />
  )}
</div>
          ) : (
            <div className="w-8 h-8 shrink-0 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold uppercase">{response?.data?.brand_name?.charAt(0) || 'C'}</span>
            </div>
          )}
          {!collapsed && !(logoUrl || logoUrl1) && (
            <span className="font-bold text-foreground truncate">
              {response?.data?.brand_name || t('adminPanel')}
            </span>
          )}
        </div>

        <button
          onClick={() => setCollapsed((v) => !v)}
          className="hidden md:flex w-7 h-7 rounded-lg items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0 cursor-pointer"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeftOpen className="w-4 h-4 rtl:rotate-180" /> : <PanelLeftClose className="w-4 h-4 rtl:rotate-180" />}
        </button>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto py-1 px-2 space-y-0.5">
        {mainNav.map((item) => (
          <NavLink key={item.href} label={t(item.labelKey)} icon={item.icon} href={item.href} locale={locale} pathname={pathname} collapsed={collapsed} setMobileOpen={setMobileOpen} />
        ))}

        <SectionLabel label={t('catalog')} collapsed={collapsed} />
        {catalogNav.map((item) => (
          <NavLink key={item.href} label={t(item.labelKey)} icon={item.icon} href={item.href} locale={locale} pathname={pathname} collapsed={collapsed} setMobileOpen={setMobileOpen} />
        ))}

        <SectionLabel label={t('finance')} collapsed={collapsed} />
        {WebSettings.map((item) => (
          <NavLink key={item.href} label={t(item.labelKey)} icon={item.icon} href={item.href} locale={locale} pathname={pathname} collapsed={collapsed} setMobileOpen={setMobileOpen} />
        ))}
      </nav>

      {/* ── Footer ── */}
      <div className="shrink-0 border-t border-border px-2 py-3 space-y-0.5">
        
        <button
          onClick={changeLanguage}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors group cursor-pointer ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? (locale === 'en' ? 'العربية' : 'English') : undefined}
        >
          <Globe className="w-[18px] h-[18px] shrink-0 text-muted-foreground group-hover:text-foreground" strokeWidth={1.75} />
          {!collapsed && <span className="text-start">{locale === 'en' ? 'العربية' : 'English'}</span>}
        </button>

        <Link
          href={`/${locale}/${ROUTES.dashboard.Settings}`}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors group ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? t('settings') : undefined}
        >
          <Settings className="w-[18px] h-[18px] shrink-0 text-muted-foreground group-hover:text-foreground" strokeWidth={1.75} />
           <span className="text-start">{!collapsed && t('settings')}</span>
        </Link>

        <button
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors group cursor-pointer ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? t('logOut') : undefined}
          onClick={() => {
            Cookies.remove('admin_token');
            Cookies.remove('user_token');
            router.push(`/${locale}/auth/login`);
          }}
        >
          <LogOut className="w-[18px] h-[18px] shrink-0" strokeWidth={1.75} />
          {!collapsed && <span className="text-start">{t('logOut')}</span>}
        </button>
      </div>
    </div>
  );
};

// ─── 3️⃣ المكون الأساسي المصدّر (Sidebar) ───────────────────────────────────────

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sharedProps = { collapsed, setCollapsed, locale, setMobileOpen, pathname };

  return (
    <>
      {/* ── Mobile toggle btn ── */}
      <button
        className="md:hidden fixed top-4 start-4 z-50 w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center text-foreground shadow-sm cursor-pointer"
        onClick={() => setMobileOpen((v) => !v)}
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>

      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile sidebar ── */}
      <aside
        className={`md:hidden fixed inset-y-0 start-0 z-40 w-64 bg-card border-r border-border shadow-xl transform transition-transform duration-300 pt-16
          ${mobileOpen ? 'translate-x-0' : 'ltr:-translate-x-full rtl:translate-x-full'}`}
      >
        <SidebarContent {...sharedProps} />
      </aside>

      {/* ── Desktop sidebar ── */}
      <aside
        className={`hidden md:flex flex-col h-screen sticky top-0 bg-card border-e border-border transition-all duration-300 shrink-0
          ${collapsed ? 'w-[68px]' : 'w-60'}`}
      >
        <SidebarContent {...sharedProps} />
      </aside>
    </>
  );
}
