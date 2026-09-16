'use client';

import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

export default function UITranslateBtn() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();

  const changeLanguage = (value: string) => {
    const pathWithoutLocale = pathname.replace(/^\/(en|ar)(\/|$)/, '/');

    const newPath = `/${value}${pathWithoutLocale === '/' ? '' : pathWithoutLocale
      }`;

    startTransition(() => {
      router.replace(newPath);
    });

    setOpen(false);
  };

  return (
    <button
      onClick={() => changeLanguage(locale === 'en' ? 'ar' : 'en')}
      className="flex items-center gap-2 h-9 px-4 rounded-full bg-white/5 backdrop-blur-md transition-all duration-300 hover:bg-primary/10 font-medium text-sm text-white"
    >
      <Globe className="h-4 w-4 text-primary" />
      {locale === 'en' ? 'العربية' : 'English'}
    </button>
  );
}