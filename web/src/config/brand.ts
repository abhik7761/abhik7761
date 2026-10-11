// Single place to rename the brand / retheme. TODO: replace placeholders.
export const brand = {
  name: 'BRAND_NAME',
  tagline: 'Authorized onsite installation, setup & repair',
  supportPhone: '(800) 555-0142',
  supportPhoneTel: '+18005550142',
  colors: { primary: '11 61 145', accent: '0 180 216', cta: '255 122 26' },
  chatScriptId: import.meta.env.VITE_CHAT_SCRIPT_ID ?? '',
  gtmId: import.meta.env.VITE_GTM_ID ?? '',
  tcpaText:
    'I agree to receive calls and texts from BRAND_NAME about my request, including automated messages. Consent is not a condition of purchase. Msg & data rates may apply.',
};

export function applyTheme() {
  const r = document.documentElement.style;
  r.setProperty('--c-primary', brand.colors.primary);
  r.setProperty('--c-accent', brand.colors.accent);
  r.setProperty('--c-cta', brand.colors.cta);
}
