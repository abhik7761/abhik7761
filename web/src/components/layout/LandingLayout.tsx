import { Outlet } from 'react-router-dom';
import { brand } from '@/config/brand';
import { CookieBanner } from '@/features/leads/CookieBanner';

export function LandingLayout() {
  return (
    <>
      <header className="container-x flex h-14 items-center justify-between">
        <span className="font-display font-extrabold text-primary">{brand.name}</span>
        <a href={`tel:${brand.supportPhoneTel}`} className="font-semibold text-primary">
          {brand.supportPhone}
        </a>
      </header>
      <main>
        <Outlet />
      </main>
      <CookieBanner />
    </>
  );
}
