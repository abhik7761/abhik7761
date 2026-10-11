import { Link } from 'react-router-dom';
import type { Product } from '@/types';
import { money } from '@/lib/format';
import { ResponsiveImage } from './ResponsiveImage';
import { Stars } from './Stars';

export function ProductCard({ p }: { p: Product }) {
  return (
    <Link to={`/shop/${p.slug}`} className="card block overflow-hidden !p-0">
      <ResponsiveImage
        src={p.images[0]}
        alt=""
        width={640}
        height={480}
        sizes="(min-width:1024px) 25vw, 50vw"
        className="aspect-[4/3] w-full object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold">{p.name}</h3>
        <Stars rating={p.rating} /> <span className="text-xs text-slate-500">({p.reviewCount})</span>
        <p className="mt-1 font-bold text-primary">
          {money(p.price)}{' '}
          {p.compareAtPrice && (
            <s className="ml-1 text-sm font-normal text-slate-400">{money(p.compareAtPrice)}</s>
          )}
        </p>
        {p.stock === 0 && <p className="text-sm text-red-600">Out of stock</p>}
      </div>
    </Link>
  );
}
