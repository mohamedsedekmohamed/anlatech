'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { authService } from '@/services/auth';
import { useApiAction, useApiGet } from '@/hooks/useApi';
import { userHome } from '@/services/userHome';
import ROUTES from '@/core/manager/route.manager';
import LoginForm from '@/components/auth/LoginForm';
import UITranslateBtn from '@/components/ui/UITranslateBtn';
import Image from 'next/image';
import { useState } from 'react';

export default function LoginPage() {
  const t = useTranslations('login');
  const locale = useLocale();
  const router = useRouter();
  
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { execute, isLoading } = useApiAction(authService.login, {
    showSuccessToast: true,
    showErrorToast: false, // Hide the default toast error
  });

  const { data: footerResponse } = useApiGet(userHome.getFooter, locale);
  const settings = footerResponse?.data;
  const brandName = settings?.brand_name || 'Deluxe Relax';
  const logoUrl = settings?.logo_url;
  const logoUrl1 = settings?.logo_url1;

  const handleSubmit = async (email: string, password: string) => {
    setErrorMessage(null); // Clear previous errors
    const result = await execute({ email, password });

    console.log('Login result:', result); // Debug log

    if (result.success && result.data?.token) {
      const { token, user } = result.data;
      console.log('User role:', user?.role); // Debug log
      
      authService.saveSession(token, user?.role ?? 'user');
      
      console.log('Token saved, redirecting...'); // Debug log

      // Use window.location for immediate redirect
      if (user?.role === 'admin') {
        const redirectUrl = `/${locale}/dashboard/admin`;
        console.log('Redirecting to:', redirectUrl); // Debug log
        window.location.href = redirectUrl;
      } else {
        const redirectUrl = `/${locale}`;
        console.log('Redirecting to:', redirectUrl); // Debug log
        window.location.href = redirectUrl;
      }
    } else {
      console.log('Login failed:', result); // Debug log
      // Show explicit, clear localized error message for login failures
      let errorMsg = result.message;
      // If the backend returns generic 'Invalid credentials', override it with our localized clear text
      if (!errorMsg || errorMsg.toLowerCase().includes('invalid') || errorMsg.toLowerCase().includes('credentials')) {
        errorMsg = locale === 'ar' 
          ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة، يرجى المحاولة مرة أخرى.' 
          : 'Incorrect email or password. Please try again.';
      }
      setErrorMessage(errorMsg);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Top Bar for Translation Button */}
      <div className="absolute top-4 right-4 z-20 rtl:right-auto rtl:left-4">
        <UITranslateBtn />
      </div>

      {/* Top Bar for Back Button */}
      <div className="absolute top-4 left-4 z-20 rtl:left-auto rtl:right-4">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 h-9 px-4 rounded-full border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-300 hover:border-primary hover:bg-primary/10 font-medium text-sm text-foreground hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          {locale === 'en' ? 'Back to Home' : 'العودة للرئيسية'}
        </Link>
      </div>

      {/* Background blobs for a premium look */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-black/5 blur-3xl" />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        {/* Card */}
        <div className="w-full max-w-md bg-card border border-border rounded-[24px] p-8 sm:p-10 shadow-xl shadow-black/5">
          {/* Header */}
      <div className="flex flex-col items-center mb-8">
  {(logoUrl || logoUrl1) && (
    <div className="flex items-center justify-center mb-6 bg-primary/5 border border-primary/10 p-3 md:p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-center gap-3 h-12 md:h-16">
        {logoUrl && (
          <Image
            src={logoUrl}
            alt={brandName || "Logo 1"}
            width={160} // عرض تقريبي مناسب للوجوهات
            height={64} // يوازي أقصى ارتفاع للحاوية (md:h-16 = 64px)
            className="max-h-full w-auto object-contain drop-shadow-md"
          />
        )}
        
        {logoUrl && logoUrl1 && (
          <div className="w-px h-8 md:h-10 bg-border mx-2" />
        )}
        
        {logoUrl1 && (
          <Image
            src={logoUrl1}
            alt={brandName || "Logo 2"}
            width={160} // عرض تقريبي
            height={64} // أقصى ارتفاع
            className="max-h-full w-auto object-contain drop-shadow-md"
          />
        )}
      </div>
    </div>
  )}
  <h1 className="text-2xl font-bold text-foreground tracking-tight">{t('title')}</h1>
  <p className="text-muted-foreground text-sm mt-2 text-center">{t('subtitle')}</p>
</div>

          {/* Form Component */}
          <LoginForm onSubmit={handleSubmit} isLoading={isLoading} error={errorMessage} />
        </div>
      </div>
    </div>
  );
}
