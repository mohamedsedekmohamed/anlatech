import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionHref?: string;
  locale?: string;
}

export default function SectionHeader({ title, subtitle, actionLabel, actionHref, locale = 'en' }: SectionHeaderProps) {
  const isRtl = locale === 'ar';

  return (
    <div className="flex flex-col gap-2 mb-6 md:mb-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight">
          {title}
        </h2>
        
        {actionLabel && actionHref && (
          <Link
            href={actionHref}
            className="flex items-center gap-2 text-primary
             hover:text-white font-bold transition-all duration-300 
             text-xs md:text-sm uppercase tracking-widest hover:underline
              underline-offset-8 decoration-2 decoration-primary shrink-0"
          >
            {actionLabel}
            {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </Link>
        )}
      </div>
      
      {subtitle && (
        <p className="text-base md:text-lg text-neutral-400 font-light max-w-2xl mt-1">
          {subtitle}
        </p>
      )}
    </div>
  );
}
