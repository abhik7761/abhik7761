import { Link } from 'react-router-dom';
import type { Service } from '@/types';
import { money } from '@/lib/format';
import { ResponsiveImage } from './ResponsiveImage';

export function ServiceCard({ s }: { s: Service }) {
  return (
    <Link to={`/services/${s.slug}`} className="card block overflow-hidden !p-0">
      <ResponsiveImage
        src={s.images[0]}
        alt=""
        width={640}
        height={360}
        sizes="(min-width:1024px) 33vw, 100vw"
        className="aspect-video w-full object-cover"
      />
      <div className="p-5">
        <h3 className="text-lg font-bold">{s.name}</h3>
        <p className="mt-1 text-sm text-slate-600">{s.shortDesc}</p>
        <p className="mt-3 font-semibold text-primary">Starting at {money(s.priceFrom)}</p>
      </div>
    </Link>
  );
}
