import { createBrowserRouter, Outlet } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { LandingLayout } from './components/layout/LandingLayout';
import { ChatWidget } from './features/support/ChatWidget';
import { useSmoothScroll } from './lib/useSmoothScroll';

function Root() {
  useSmoothScroll();
  return (
    <>
      <Outlet />
      <ChatWidget />
    </>
  );
}
const page = (loader: () => Promise<{ default: React.ComponentType }>) => ({
  lazy: async () => ({ Component: (await loader()).default }),
});

export const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      {
        element: <Layout />,
        children: [
          { index: true, ...page(() => import('./pages/Home')) },
          { path: 'services', ...page(() => import('./pages/Services')) },
          { path: 'services/:slug', ...page(() => import('./pages/ServiceDetail')) },
          { path: 'brands/:slug', ...page(() => import('./pages/Brand')) },
          { path: 'book', ...page(() => import('./pages/Book')) },
          { path: 'shop', ...page(() => import('./pages/Shop')) },
          { path: 'shop/:slug', ...page(() => import('./pages/ProductDetail')) },
          { path: 'cart', ...page(() => import('./pages/Cart')) },
          { path: 'checkout', ...page(() => import('./pages/Checkout')) },
          { path: 'order/confirmation/:id', ...page(() => import('./pages/Confirmation')) },
          { path: 'login', ...page(() => import('./pages/Auth')) },
          { path: 'signup', ...page(() => import('./pages/Auth')) },
          { path: 'forgot-password', ...page(() => import('./pages/Auth')) },
          { path: 'account', ...page(() => import('./pages/Account')) },
          { path: 'about', ...page(() => import('./pages/About')) },
          { path: 'contact', ...page(() => import('./pages/Contact')) },
          { path: 'service-areas', ...page(() => import('./pages/ServiceAreas')) },
          { path: 'faq', ...page(() => import('./pages/FaqPage')) },
          { path: 'privacy', ...page(() => import('./pages/Legal')) },
          { path: 'terms', ...page(() => import('./pages/Legal')) },
          { path: 'ccpa', ...page(() => import('./pages/Legal')) },
          { path: 'cookies', ...page(() => import('./pages/Legal')) },
          { path: 'refunds', ...page(() => import('./pages/Legal')) },
          { path: 'warranty', ...page(() => import('./pages/Legal')) },
          { path: 'accessibility', ...page(() => import('./pages/Legal')) },
          { path: 'admin/*', ...page(() => import('./pages/admin/Admin')) },
          { path: '*', ...page(() => import('./pages/NotFound')) },
        ],
      },
      {
        element: <LandingLayout />,
        children: [{ path: 'lp/:slug', ...page(() => import('./pages/LandingPage')) }],
      },
    ],
  },
]);
