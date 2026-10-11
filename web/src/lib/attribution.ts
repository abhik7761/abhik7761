import type { Attribution } from '@/types';

const KEY = 'attr_v1';
const DAYS = 90;
const FIELDS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'fbclid',
] as const;

const readCookie = () => {
  const m = document.cookie.split('; ').find((c) => c.startsWith(`${KEY}=`));
  if (!m) return null;
  try {
    return JSON.parse(decodeURIComponent(m.slice(KEY.length + 1))) as Attribution;
  } catch {
    return null;
  }
};

/** Capture first-touch attribution once; stored in a 90-day first-party cookie. */
export function captureAttribution(): Attribution {
  const existing = readCookie();
  if (existing) return existing;
  const q = new URLSearchParams(location.search);
  const g = (k: string) => q.get(k) ?? undefined;
  const a: Attribution = {
    utmSource: g('utm_source'),
    utmMedium: g('utm_medium'),
    utmCampaign: g('utm_campaign'),
    utmTerm: g('utm_term'),
    utmContent: g('utm_content'),
    gclid: g('gclid'),
    fbclid: g('fbclid'),
    landingPage: location.pathname + location.search,
    referrer: document.referrer,
    firstSeenAt: new Date().toISOString(),
  };
  document.cookie = `${KEY}=${encodeURIComponent(JSON.stringify(a))}; max-age=${DAYS * 86400}; path=/; SameSite=Lax`;
  return a;
}
export const getAttribution = () => readCookie() ?? captureAttribution();
export const hasTrackingParams = () => FIELDS.some((f) => new URLSearchParams(location.search).has(f));
