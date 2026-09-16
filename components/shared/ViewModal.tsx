'use client';

import { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useScrollLock } from '@/hooks/useScrollLock';
import Image from 'next/image';
// ─── Types ───────────────────────────────────────────────────────────────────

export interface ViewField {
  label: string;
  value: string | number | null | undefined;
  /** optional badge style override */
  badge?: 'success' | 'danger' | 'info' | 'neutral';
  /** icon component */
  icon?: React.ReactNode;
}

export interface ViewModalConfig {
  title: string;
  /** Avatar shown at the top — url or first-letter fallback */
  avatar?: { src?: string | null; fallback: string };
  /** Optional subtitle / badge under the avatar */
  subtitle?: { label: string; badge?: boolean };
  /** List of fields to display */
  fields: ViewField[];
  /** Optional array of images to display at the bottom */
  gallery?: { id: string | number; image_url: string }[];
}

interface ViewModalProps {
  /** Async fn that returns the config — runs when modal opens */
  fetchConfig: () => Promise<ViewModalConfig>;
  onClose: () => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const badgeClass = {
  success: 'bg-emerald-50 text-primary',
  danger:  'bg-red-50 text-red-500',
  info:    'bg-primary/10 text-primary-700',
  neutral: 'bg-muted text-muted-foreground',
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function ViewModal({ fetchConfig, onClose }: ViewModalProps) {
  useScrollLock(true);

  const [config,  setConfig]  = useState<ViewModalConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const cfg = await fetchConfig();
        setConfig(cfg);
      } finally {
        setLoading(false);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-card rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-base font-bold text-foreground">
            {loading ? '...' : config?.title}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : config ? (
          <>
            {/* Avatar section */}
            {config.avatar && (
              <div className="sticky top-0 z-10 flex flex-col items-center gap-2 pt-6 pb-4 px-6 bg-muted/30 border-b border-border">
                <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center overflow-hidden shrink-0">
                {config.avatar.src ? (
  <Image
    src={config.avatar.src}
    alt="Avatar"
    width={96}  // يمكنك تعديل الرقم حسب مقاس الـ div عندك
    height={96}
    className="w-full h-full object-cover"
  />
) : (
  <span className="text-primary text-2xl font-bold">
    {config.avatar.fallback}
  </span>
)}
                </div>
                {config.subtitle && (
                  <div className="text-center space-y-1">
                    {config.subtitle.badge ? (
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${badgeClass.info}`}>
                        {config.subtitle.label}
                      </span>
                    ) : (
                      <p className="text-sm text-muted-foreground">{config.subtitle.label}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Fields */}
            <div className="p-5 space-y-0 overflow-y-auto max-h-[60vh]">
              {config.fields.map((field, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 py-2.5 border-b border-border last:border-0"
                >
                  {field.icon && (
                    <span className="text-muted-foreground shrink-0">{field.icon}</span>
                  )}
                  <span className="text-xs text-muted-foreground w-32 shrink-0">{field.label}</span>
                  {field.badge ? (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${badgeClass[field.badge]}`}>
                      {field.value ?? '—'}
                    </span>
                  ) : (
                    <span className="text-sm font-medium text-foreground flex-1 wrap-break-word">
                      {field.value !== null && field.value !== undefined && field.value !== ''
                        ? String(field.value)
                        : '—'}
                    </span>
                  )}
                </div>
              ))}

              {/* Gallery */}
              {config.gallery && config.gallery.length > 0 && (
                <div className="pt-4 mt-2 border-t border-border">
                  <h3 className="text-xs font-semibold text-muted-foreground mb-3">Product Gallery</h3>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {config.gallery.map((img) => (
                  <div key={img.id} className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-border relative">
  <Image
    src={img.image_url}
    alt="Gallery Image"
    width={64}
    height={64}
    className="w-full h-full object-cover"
  />
</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="py-12 text-center text-muted-foreground text-sm">No data found.</div>
        )}
      </div>
    </div>
  );
}
