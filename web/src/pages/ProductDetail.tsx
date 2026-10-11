import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { products, services } from '@/api';
import { money } from '@/lib/format';
import { track } from '@/lib/track';
import { useCart } from '@/store/cart';
import { Seo } from '@/components/ui/Seo';
import { Stars } from '@/components/ui/Stars';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
import { Reviews } from '@/components/ui/Reviews';
import NotFound from './NotFound';

export default function ProductDetail() {
  const { slug = '' } = useParams();
  const add = useCart((s) => s.add);
  const [install, setInstall] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [zip, setZip] = useState('');
  const [eta, setEta] = useState('');
  const [added, setAdded] = useState(false);
  const {
    data: p,
    isLoading,
    isError,
  } = useQuery({ queryKey: ['product', slug], queryFn: () => products.get(slug) });
  const { data: svcs = [] } = useQuery({ queryKey: ['services'], queryFn: services.list });
  if (isLoading) return <p className="container-x section">Loading…</p>;
  if (isError || !p) return <NotFound />;
  const svc = svcs.find((s) => s.id === p.installServiceId);
  const addToCart = () => {
    add({ kind: 'product', refId: p.id, name: p.name, qty: 1, unitPrice: p.price });
    if (install && svc)
      add({
        kind: 'service',
        refId: svc.id,
        name: `${svc.name} (for ${p.name})`,
        qty: 1,
        unitPrice: svc.priceFrom,
      });
    track('add_to_cart', { value: p.price / 100, currency: 'USD', item: p.name });
    setAdded(true);
  };
  return (
    <div className="container-x section grid gap-10 lg:grid-cols-2">
      <Seo
        title={p.name}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: p.name,
          sku: p.sku,
          offers: {
            '@type': 'Offer',
            priceCurrency: 'USD',
            price: (p.price / 100).toFixed(2),
            availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          },
        }}
      />
      <button
        onClick={() => setZoom(!zoom)}
        aria-label="Toggle zoom"
        className="overflow-hidden rounded-xl2 border"
      >
        <ResponsiveImage
          src={p.images[0]}
          alt={p.name}
          width={1280}
          height={960}
          eager
          sizes="(min-width:1024px) 50vw, 100vw"
          className={`w-full object-cover transition-transform duration-300 ${zoom ? 'scale-150' : ''}`}
        />
      </button>
      <div>
        <h1 className="text-3xl font-bold">{p.name}</h1>
        <p className="mt-1">
          <Stars rating={p.rating} />{' '}
          <span className="text-sm text-slate-500">({p.reviewCount} reviews)</span>
        </p>
        <p className="mt-3 text-3xl font-bold text-primary">
          {money(p.price)}{' '}
          {p.compareAtPrice && (
            <s className="text-lg font-normal text-slate-400">{money(p.compareAtPrice)}</s>
          )}
        </p>
        <p className={`mt-1 text-sm ${p.stock > 0 ? 'text-emerald-700' : 'text-red-600'}`}>
          {p.stock > 0 ? `In stock (${p.stock})` : 'Out of stock'}
        </p>
        {svc && (
          <label className="card mt-5 block cursor-pointer">
            <input type="checkbox" checked={install} onChange={(e) => setInstall(e.target.checked)} />{' '}
            <b>Add professional installation</b> — {svc.name}, {money(svc.priceFrom)}
            <span className="block text-sm text-slate-600">
              You&apos;ll pick an install time at checkout.
            </span>
          </label>
        )}
        <button className="btn-cta mt-5 w-full" disabled={p.stock === 0} onClick={addToCart}>
          Add to cart
        </button>
        {added && (
          <p role="status" className="mt-2 text-emerald-700">
            Added.{' '}
            <a className="underline" href="/cart">
              View cart
            </a>
          </p>
        )}
        <div className="mt-5">
          <label className="label" htmlFor="zip">
            Delivery estimate
          </label>
          <input
            id="zip"
            className="input max-w-[160px]"
            inputMode="numeric"
            maxLength={5}
            placeholder="ZIP"
            value={zip}
            onChange={(e) => {
              const z = e.target.value.replace(/\D/g, '');
              setZip(z);
              setEta(z.length >= 5 ? new Date(Date.now() + 5 * 864e5).toLocaleDateString('en-US') : '');
            }}
          />
          {eta && <p className="mt-1 text-sm">Estimated delivery by {eta}</p>}
        </div>
        <h2 className="mt-8 text-xl font-bold">Specs</h2>
        <table className="mt-2 w-full text-sm">
          <tbody>
            {Object.entries(p.specs).map(([k, v]) => (
              <tr key={k} className="border-b">
                <th className="py-2 pr-4 text-left font-medium">{k}</th>
                <td>{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <section className="lg:col-span-2">
        <h2 className="mb-4 text-2xl font-bold">Reviews</h2>
        <Reviews />
      </section>
    </div>
  );
}
