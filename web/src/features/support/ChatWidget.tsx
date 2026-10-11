import { useEffect } from 'react';
import { brand } from '@/config/brand';

/** Loads the vendor embed once at app root, after first interaction or 3s idle. Renders nothing if no ID. */
export function ChatWidget() {
  useEffect(() => {
    if (!brand.chatScriptId) return;
    let loaded = false;
    const load = () => {
      if (loaded) return;
      loaded = true;
      const s = document.createElement('script');
      s.async = true;
      s.src = `https://chat.example-vendor.com/embed.js?id=${encodeURIComponent(brand.chatScriptId)}`; // TODO: vendor embed URL
      document.body.appendChild(s);
    };
    const evs = ['pointerdown', 'keydown', 'scroll'] as const;
    evs.forEach((e) => window.addEventListener(e, load, { once: true, passive: true }));
    const t = setTimeout(load, 3000);
    return () => {
      clearTimeout(t);
      evs.forEach((e) => window.removeEventListener(e, load));
    };
  }, []);
  return null;
}
