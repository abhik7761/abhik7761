import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { applyTheme } from './config/brand';
import { captureAttribution } from './lib/attribution';
import { getConsent, loadGtm } from './lib/consent';
import { inlineMocks, useMocks } from './api/client';
import './styles/index.css';

applyTheme();
captureAttribution();
if (getConsent() === 'accepted') loadGtm();
const qc = new QueryClient({ defaultOptions: { queries: { staleTime: 60_000, retry: 1 } } });

async function boot() {
  if (useMocks && !inlineMocks) {
    const { worker } = await import('./mocks/browser');
    await worker.start({ onUnhandledRequest: 'bypass', serviceWorker: { url: '/mockServiceWorker.js' } });
  }
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <HelmetProvider>
        <QueryClientProvider client={qc}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </HelmetProvider>
    </React.StrictMode>,
  );
}
void boot();
