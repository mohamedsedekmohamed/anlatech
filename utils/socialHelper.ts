/**
 * Normalizes social link fields which can be arrays (e.g. from new API)
 * or strings (legacy) into a clean array of string URLs.
 */
export function normalizeSocialLinks(val: any): string[] {
  if (!val) return [];
  if (Array.isArray(val)) {
    return val
      .map((item) => (typeof item === 'string' ? item.trim() : ''))
      .filter((url): url is string => url !== '');
  }
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed
            .map((item) => (typeof item === 'string' ? item.trim() : ''))
            .filter((url): url is string => url !== '');
        }
      } catch {
        // fallback
      }
    }
    return [trimmed];
  }
  return [];
}

/**
 * Returns a link at a specific index from a social link value (array or string).
 */
export function getSocialLinkAtIndex(val: any, index: number): string {
  const links = normalizeSocialLinks(val);
  return links[index] ?? '';
}

/**
 * Ensures the URL is properly formatted for an external link
 * (e.g. prepends https:// if missing protocol so the browser doesn't treat it as a relative path).
 */
export function formatSocialUrl(url: string): string {
  if (!url || typeof url !== 'string') return '#';
  const clean = url.trim();
  if (!clean) return '#';
  if (/^(https?:\/\/|mailto:|tel:|wa\.me)/i.test(clean)) {
    return clean;
  }
  if (clean.startsWith('//')) {
    return `https:${clean}`;
  }
  return `https://${clean}`;
}


