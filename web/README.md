# Home Services & Appliance E-commerce — Phase 1 (frontend + mock API)

React 18 + Vite + TypeScript + Tailwind. All data goes through `src/api/*`; with `VITE_USE_MOCKS=true` MSW serves mock data.

```bash
cp .env.example .env
npm install
npm run dev      # http://localhost:5173
npm run build && npm test && npm run lint
```

- Switch to a real backend: set `VITE_USE_MOCKS=false` and `VITE_API_URL` in `.env`.
- Rename brand / colors / phone / TCPA text: `src/config/brand.ts`. Support hours: `src/config/support.ts`. Landing pages: `src/config/landingPages.ts`. Media paths: `src/assets/media.config.ts`.
- Placeholders to replace before launch: brand logos (`public/brands`), hero video/images (`public/media`), stats and reviews (flagged `placeholder`), legal text (TODO: legal review), `YOUR_DOMAIN` in `public/sitemap.xml` and `robots.txt`.
- Mock login: any password of 6+ chars; emails starting with `admin` get the admin role (`/admin`).

## Status vs. the Phase 1 plan
Done: setup, UI kit/layout, home, services/brands, booking wizard, shop/product/upsell, cart/checkout (mock Stripe)/confirmation, lead system (QuoteForm, landing pages, attribution, dataLayer, cookie banner, exit intent), chat widget + support status + callback, auth + account, admin (dashboard, leads with CSV export, bookings, orders, services/products/categories tables, settings read-only), legal pages, 404, sitemap/robots, JSON-LD.
Not yet: admin CRUD editors and the availability/service-areas/technicians/reviews modules, image resize pipeline, Playwright flow tests, Lighthouse tuning, real media.
