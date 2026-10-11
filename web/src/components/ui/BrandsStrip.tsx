import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { catalog } from '@/api';

export function BrandsStrip() {
  const { data = [] } = useQuery({ queryKey: ['brands'], queryFn: catalog.brands });
  return (
    <div className="text-center">
      <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
        Authorized Service Provider for
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
        {/* Placeholder logos in /public/brands — replace with official files from each brand's partner portal. */}
        {data.map((b) => (
          <Link key={b.id} to={`/brands/${b.slug}`}>
            <img
              src={b.logo}
              alt={b.name}
              width={120}
              height={40}
              loading="lazy"
              className="h-10 w-auto opacity-70 grayscale hover:opacity-100"
              onError={(e) => {
                e.currentTarget.replaceWith(
                  Object.assign(document.createElement('span'), {
                    textContent: b.name,
                    className: 'font-display text-lg font-bold text-slate-500',
                  }),
                );
              }}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
