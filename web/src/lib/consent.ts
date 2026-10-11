import { brand } from '@/config/brand';
const KEY = 'consent_v1';
export type Consent = 'accepted' | 'rejected' | null;
export const getConsent = (): Consent => {
  try {
    return localStorage.getItem(KEY) as Consent;
  } catch {
    return null;
  }
};

/** Loads GTM only after consent is accepted. Marketing tags live inside GTM (Consent Mode v2 configured there). */
export function setConsent(v: 'accepted' | 'rejected') {
  try {
    localStorage.setItem(KEY, v);
  } catch {
    /* ignore */
  }
  window.dataLayer ??= [];
  const gtag = (...a: unknown[]) => window.dataLayer!.push(a as unknown as Record<string, unknown>);
  gtag('consent', 'update', {
    ad_storage: v === 'accepted' ? 'granted' : 'denied',
    analytics_storage: v === 'accepted' ? 'granted' : 'denied',
    ad_user_data: v === 'accepted' ? 'granted' : 'denied',
    ad_personalization: v === 'accepted' ? 'granted' : 'denied',
  });
  if (v === 'accepted') loadGtm();
}
export function loadGtm() {
  if (!brand.gtmId || document.getElementById('gtm-script')) return;
  window.dataLayer ??= [];
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
  const s = document.createElement('script');
  s.id = 'gtm-script';
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtm.js?id=${brand.gtmId}`;
  document.head.appendChild(s);
}
