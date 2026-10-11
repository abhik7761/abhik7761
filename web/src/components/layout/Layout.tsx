import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileCtaBar } from './MobileCtaBar';
import { CookieBanner } from '@/features/leads/CookieBanner';
import { ExitIntent } from '@/features/leads/ExitIntent';

export function Layout() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-3"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <MobileCtaBar />
      <CookieBanner />
      <ExitIntent />
      <ScrollRestoration />
    </>
  );
}
