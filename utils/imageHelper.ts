/**
 * Centralized Image URL Resolver & Fallback Helper
 */

export const DEFAULT_IMAGES = {
  banner: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200',
  partner: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?q=80&w=400',
  product: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800',
  category: 'https://images.unsplash.com/photo-1550985616-10810253b84d?q=80&w=800',
  service: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=600',
  logo: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=400',
};

export function resolveImageUrl(
  rawUrl?: string | null,
  fallbackType: keyof typeof DEFAULT_IMAGES = 'product'
): string {
  if (!rawUrl || typeof rawUrl !== 'string' || rawUrl.trim() === '') {
    return DEFAULT_IMAGES[fallbackType];
  }

  const clean = rawUrl.trim();

  // If already absolute URL
  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    return clean;
  }

  // If starts with /
  if (clean.startsWith('/')) {
    return `https://anlatech.mazoom.online${clean}`;
  }

  // Relative storage path
  return `https://anlatech.mazoom.online/storage/${clean}`;
}
