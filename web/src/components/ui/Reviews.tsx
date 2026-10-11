import { useQuery } from '@tanstack/react-query';
import { catalog } from '@/api';
import { Stars } from './Stars';

export function Reviews() {
  const { data = [] } = useQuery({ queryKey: ['reviews'], queryFn: catalog.reviews });
  const avg = data.length ? data.reduce((s, r) => s + r.rating, 0) / data.length : 0;
  return (
    <div>
      {data.length > 0 && (
        <p className="mb-4 text-slate-600">
          <Stars rating={avg} /> {avg.toFixed(1)} average from {data.length} reviews
        </p>
      )}
      <div className="flex snap-x gap-4 overflow-x-auto pb-3">
        {data.map((r) => (
          <figure key={r.id} className="card min-w-[280px] snap-start">
            <Stars rating={r.rating} />
            <blockquote className="mt-2 text-slate-700">{r.body}</blockquote>
            <figcaption className="mt-3 text-sm font-medium">
              {r.author}
              {r.placeholder && (
                <span className="ml-2 rounded bg-amber-100 px-1.5 text-xs text-amber-800">placeholder</span>
              )}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
