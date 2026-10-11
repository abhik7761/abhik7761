import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { catalog, services } from '@/api';
import { Seo } from '@/components/ui/Seo';
import { ServiceCard } from '@/components/ui/ServiceCard';
import NotFound from './NotFound';

export default function Brand() {
  const { slug } = useParams();
  const { data: brands = [], isLoading } = useQuery({ queryKey: ['brands'], queryFn: catalog.brands });
  const { data: list = [] } = useQuery({ queryKey: ['services'], queryFn: services.list });
  const b = brands.find((x) => x.slug === slug);
  if (isLoading) return <p className="container-x section">Loading…</p>;
  if (!b) return <NotFound />;
  return (
    <div className="container-x section">
      <Seo title={`${b.name} service`} />
      <h1 className="text-4xl font-bold">{b.name} installation &amp; repair</h1>
      <p className="mt-2 text-slate-600">Authorized service provider. Services we offer for {b.name}:</p>
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {list
          .filter((s) => s.brandIds.includes(b.id))
          .map((s) => (
            <ServiceCard key={s.id} s={s} />
          ))}
      </div>
    </div>
  );
}
