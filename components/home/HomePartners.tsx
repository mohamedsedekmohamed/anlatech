'use client';

import { useLocale } from 'next-intl';
import { useApiGet } from '@/hooks/useApi';
import { userHome } from '@/services/userHome';

export default function HomePartners() {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  
  const { data: partnersResponse, isLoading } = useApiGet(userHome.getPartners, locale);
  const partners = partnersResponse?.data?.partners || partnersResponse?.partners || [];

  if (isLoading || partners.length === 0) {
    return null;
  }

  // We duplicate the array multiple times to ensure the marquee track is long enough
  // to loop seamlessly across wide screens
  const duplicatedPartners = [...partners, ...partners, ...partners, ...partners];

  return (
    <section className="py-12 md:py-20 relative overflow-hidden bg-background">
      {/* Dynamic CSS for the marquee animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-250px * ${partners.length})); }
        }
        @keyframes scroll-rtl {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(250px * ${partners.length})); }
        }
        .animate-marquee {
          animation: scroll 10s linear infinite;
        }
        .animate-marquee-rtl {
          animation: scroll-rtl 10s linear infinite;
        }
        .marquee-track:hover .animate-marquee,
        .marquee-track:hover .animate-marquee-rtl {
          animation-play-state: paused;
        }
      `}} />

      <div className="container mb-8 md:mb-12">
        <h2 className="text-2xl md:text-4xl font-black text-white text-center tracking-tight">
          {isRtl ? 'شركاء النجاح' : 'Our Partners'}
        </h2>
        <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full shadow-[0_0_15px_rgba(123,37,37,0.5)]" />
      </div>

      <div className="relative w-full overflow-hidden marquee-track">
        {/* Gradients for smooth fade effect on edges */}
        <div className="absolute start-0 top-0 bottom-0 w-16 md:w-48 bg-gradient-to-r rtl:bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute end-0 top-0 bottom-0 w-16 md:w-48 bg-gradient-to-l rtl:bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        
        <div className={`flex w-[max-content] ${isRtl ? 'animate-marquee-rtl' : 'animate-marquee'}`}>
          {duplicatedPartners.map((partner: any, idx: number) => {
            let imageUrl = partner.image_url;
            if (!imageUrl) {
               imageUrl = partner.image?.startsWith('http') 
                ? partner.image 
                : `https://bcknd.alnatech.de/storage/${partner.image}`;
            }

            return (
              <div 
                key={`${partner.id}-${idx}`} 
                className="w-[180px] md:w-[240px] mx-3 shrink-0 flex flex-col items-center gap-4 group cursor-pointer"
              >
                <div className="w-full h-[140px] md:h-[180px] flex items-center justify-center p-6 md:p-8 rounded-3xl border border-white/5 bg-white/3 hover:bg-white/5 hover:border-primary/30 transition-all duration-300">
                  {imageUrl ? (
                    <img 
                      src={encodeURI(imageUrl)} 
                      alt={partner.name || 'Partner'} 
                      className="max-w-full max-h-full object-contain grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                    />
                  ) : (
                    <span className="text-white/30 font-bold text-lg">{partner.name}</span>
                  )}
                </div>
                {partner.name && imageUrl && (
                  <span className="text-white/60 font-semibold text-sm md:text-base text-center group-hover:text-white transition-colors duration-300">
                    {partner.name}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
