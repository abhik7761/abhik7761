import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { catalog, services } from '@/api';
import { Seo } from '@/components/ui/Seo';
import { ServiceCard } from '@/components/ui/ServiceCard';

export default function Services() {
  const [sp, setSp] = useSearchParams();
  const cat = sp.get('category') ?? '';
  const { data: list = [], isLoading } = useQuery({ queryKey: ['services'], queryFn: services.list });
  const { data: cats = [] } = useQuery({ queryKey: ['categories'], queryFn: catalog.categories });
  const shown = list.filter((s) => !cat || s.categoryId === cat);
  return (
    <div className="container-x section">
      <Seo title="Services" description="Installation, repair and setup by authorized technicians." />
      <h1 className="text-4xl font-bold">Our services</h1>
      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        {[{ id: '', name: 'All' }, ...cats.filter((c) => c.type === 'service')].map((c) => (
          <button
            key={c.id}
            onClick={() => setSp(c.id ? { category: c.id } : {})}
            aria-pressed={cat === c.id}
            className={`rounded-full border px-4 py-2 text-sm font-medium ${cat === c.id ? 'border-primary bg-primary text-white' : 'border-slate-300'}`}
          >
            {c.name}
          </button>
        ))}
      </div>
      {isLoading ? (
        <p className="mt-8">Loading…</p>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((s) => (
            <ServiceCard key={s.id} s={s} />
          ))}
        </div>
      )}
    </div>
  );
}
