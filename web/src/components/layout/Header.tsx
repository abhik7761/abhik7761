import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { catalog } from '@/api';
import { brand } from '@/config/brand';
import { track } from '@/lib/track';
import { useCart } from '@/store/cart';
import { useAuth } from '@/store/auth';
import { SupportStatus } from '@/features/support/SupportStatus';

export function Header() {
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const count = useCart((s) => s.lines.reduce((n, l) => n + l.qty, 0));
  const user = useAuth((s) => s.user);
  const { data: cats = [] } = useQuery({ queryKey: ['categories'], queryFn: catalog.categories });
  const sc = cats.filter((c) => c.type === 'service');
  const link = 'px-3 py-2 text-sm font-medium text-slate-700 hover:text-primary';
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="hidden bg-primary py-1 text-white md:block">
        <div className="container-x flex justify-between text-xs">
          <SupportStatus />
          <span>Authorized service provider</span>
        </div>
      </div>
      <div className="container-x flex h-16 items-center gap-4">
        <Link to="/" className="font-display text-xl font-extrabold text-primary">
          {brand.name}
        </Link>
        <nav className="ml-6 hidden items-center lg:flex" aria-label="Main">
          <div className="relative" onMouseEnter={() => setMega(true)} onMouseLeave={() => setMega(false)}>
            <NavLink to="/services" className={link} onFocus={() => setMega(true)}>
              Services
            </NavLink>
            {mega && (
              <div className="absolute left-0 top-full w-72 rounded-xl2 border border-slate-200 bg-white p-3 shadow-2xl">
                {sc.map((c) => (
                  <Link
                    key={c.id}
                    to={`/services?category=${c.id}`}
                    className="block rounded-lg px-3 py-2 hover:bg-slate-50"
                    onClick={() => setMega(false)}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <NavLink to="/shop" className={link}>
            Shop
          </NavLink>
          <NavLink to="/service-areas" className={link}>
            Service areas
          </NavLink>
          <NavLink to="/about" className={link}>
            About
          </NavLink>
          <NavLink to="/contact" className={link}>
            Contact
          </NavLink>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <a
            href={`tel:${brand.supportPhoneTel}`}
            onClick={() => track('click_to_call')}
            className="hidden font-semibold text-primary sm:block"
          >
            {brand.supportPhone}
          </a>
          <Link to="/book" className="btn-cta hidden !px-4 !py-2 sm:inline-flex">
            Book Now
          </Link>
          <Link to="/cart" aria-label={`Cart, ${count} items`} className="relative p-2">
            🛒
            {count > 0 && (
              <span className="absolute -right-1 -top-1 rounded-full bg-cta px-1.5 text-xs text-white">
                {count}
              </span>
            )}
          </Link>
          <Link to={user ? '/account' : '/login'} className="p-2 text-sm font-medium">
            {user ? 'Account' : 'Log in'}
          </Link>
          <button
            className="p-2 lg:hidden"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            ☰
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-slate-200 bg-white p-4 lg:hidden" aria-label="Mobile">
          {[
            ['/services', 'Services'],
            ['/shop', 'Shop'],
            ['/book', 'Book Now'],
            ['/service-areas', 'Service areas'],
            ['/about', 'About'],
            ['/contact', 'Contact'],
            ['/faq', 'FAQ'],
          ].map(([to, t]) => (
            <Link key={to} to={to} onClick={() => setOpen(false)} className="block py-2 font-medium">
              {t}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
