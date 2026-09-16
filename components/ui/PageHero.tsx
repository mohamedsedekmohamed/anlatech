'use client';

interface PageHeroProps {
  title: string;
  subtitle?: string;
}

export default function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <div className="relative pt-24 pb-8 md:pt-32 md:pb-12 overflow-hidden">
      {/* Cinematic Background Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Grid Pattern Overlay for Texture */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)] pointer-events-none opacity-40" />

      <div className="container relative z-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="flex flex-col items-center text-center gap-4 max-w-3xl mx-auto">
          {/* Subtle Accent Line */}
          <div className="w-10 h-1 rounded-full bg-primary/80 mb-2 shadow-[0_0_15px_rgba(123,37,37,0.5)]" />

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-md">
            {title}
          </h1>

          {subtitle && (
            <p className="text-base md:text-lg text-neutral-400 font-light max-w-2xl leading-relaxed mt-2">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
