import { Link } from 'react-router-dom';
import { useState } from 'react';
import { brand } from '@/config/brand';
import { SupportStatus } from '@/features/support/SupportStatus';

export function Footer() {
  const [ok, setOk] = useState(false);
  return (
    <footer className="bg-slate-950 pb-24 pt-14 text-slate-300 lg:pb-14">
      <div className="container-x grid gap-10 md:grid-cols-4">
        <div>
          <p className="font-display text-xl font-bold text-white">{brand.name}</p>
          <p className="mt-2 text-sm">{brand.tagline}</p>
          <a className="mt-3 block font-semibold text-white" href={`tel:${brand.supportPhoneTel}`}>
            {brand.supportPhone}
          </a>
          <div className="mt-2">
            <SupportStatus />
          </div>
        </div>
        <div>
          <p className="mb-2 font-semibold text-white">Company</p>
          {[
            ['/about', 'About'],
            ['/service-areas', 'Service areas'],
            ['/faq', 'FAQ'],
            ['/contact', 'Contact'],
          ].map(([t, l]) => (
            <Link key={t} className="block py-1 text-sm hover:text-white" to={t}>
              {l}
            </Link>
          ))}
        </div>
        <div>
          <p className="mb-2 font-semibold text-white">Shop &amp; Services</p>
          {[
            ['/services', 'Services'],
            ['/shop', 'Appliances'],
            ['/book', 'Book online'],
            ['/brands/garmin', 'Garmin'],
            ['/brands/lowrance', 'Lowrance'],
          ].map(([t, l]) => (
            <Link key={t} className="block py-1 text-sm hover:text-white" to={t}>
              {l}
            </Link>
          ))}
        </div>
        <div>
          <p className="mb-2 font-semibold text-white">Newsletter</p>
          {ok ? (
            <p className="text-sm">Subscribed (mock).</p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setOk(true);
              }}
              className="flex gap-2"
            >
              <input
                required
                type="email"
                aria-label="Email"
                className="input !py-2 text-ink"
                placeholder="you@email.com"
              />
              <button className="btn-cta !px-4 !py-2">Join</button>
            </form>
          )}
        </div>
      </div>
      <div className="container-x mt-10 flex flex-wrap gap-x-5 gap-y-1 border-t border-slate-800 pt-6 text-xs">
        {[
          ['/privacy', 'Privacy'],
          ['/terms', 'Terms'],
          ['/cookies', 'Cookies'],
          ['/ccpa', 'Do Not Sell or Share My Personal Information'],
          ['/refunds', 'Refunds & Cancellation'],
          ['/warranty', 'Service Warranty'],
          ['/accessibility', 'Accessibility'],
        ].map(([t, l]) => (
          <Link key={t} to={t} className="hover:text-white">
            {l}
          </Link>
        ))}
        <span className="ml-auto">
          © {new Date().getFullYear()} {brand.name}
        </span>
      </div>
    </footer>
  );
}
