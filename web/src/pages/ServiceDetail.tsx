import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { services } from '@/api';
import { money } from '@/lib/format';
import { useBooking } from '@/store/booking';
import { Seo } from '@/components/ui/Seo';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
import { Reviews } from '@/components/ui/Reviews';
import { Faq } from '@/components/ui/Faq';
import { QuoteForm } from '@/features/leads/QuoteForm';
import NotFound from './NotFound';

export default function ServiceDetail() {
  const { slug = '' } = useParams();
  const patch = useBooking((s) => s.patch);
  const {
    data: s,
    isLoading,
    isError,
  } = useQuery({ queryKey: ['service', slug], queryFn: () => services.get(slug) });
  if (isLoading) return <p className="container-x section">Loading…</p>;
  if (isError || !s) return <NotFound />;
  const tiers = [
    ['Standard', s.priceFrom],
    ['Plus (extra hardware/time)', Math.round(s.priceFrom * 1.5)],
    ['Premium', s.priceFrom * 2],
  ] as const;
  return (
    <div>
      <Seo
        title={s.name}
        description={s.shortDesc}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: s.name,
          description: s.shortDesc,
          areaServed: 'US',
          offers: { '@type': 'Offer', priceCurrency: 'USD', price: (s.priceFrom / 100).toFixed(2) },
        }}
      />
      <section className="relative bg-slate-900 text-white">
        <ResponsiveImage
          src={s.images[0]}
          alt=""
          width={1920}
          height={700}
          eager
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="container-x relative py-20">
          <h1 className="text-4xl font-bold !text-white sm:text-5xl">{s.name}</h1>
          <p className="mt-3 max-w-2xl text-slate-200">{s.description}</p>
          <p className="mt-4 text-xl font-semibold">
            Starting at {money(s.priceFrom)} · about {Math.round((s.durationMin / 60) * 10) / 10} hrs
          </p>
        </div>
      </section>
      <div className="container-x grid gap-10 py-14 lg:grid-cols-[1fr_380px]">
        <div className="min-w-0 space-y-12">
          <section>
            <h2 className="text-2xl font-bold">What&apos;s included</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>Certified, insured technician</li>
              <li>Testing and walkthrough</li>
              <li>Cleanup after the job</li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-bold">Pricing</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {tiers.map(([n, p]) => (
                <div key={n} className="card">
                  <p className="font-semibold">{n}</p>
                  <p className="text-2xl font-bold text-primary">{money(p)}</p>
                </div>
              ))}
            </div>
          </section>
          <section>
            <h2 className="text-2xl font-bold">Process</h2>
            <ol className="mt-3 list-decimal space-y-1 pl-5">
              <li>Book a time</li>
              <li>Technician arrives and inspects</li>
              <li>Work completed and tested</li>
            </ol>
          </section>
          <section>
            <h2 className="mb-3 text-2xl font-bold">FAQ</h2>
            <Faq
              items={[
                { q: 'Can I reschedule?', a: 'Yes, up to 24 hours before your slot.' },
                { q: 'Is a deposit required?', a: 'Depends on the service; shown at checkout.' },
              ]}
            />
          </section>
          <section>
            <h2 className="mb-3 text-2xl font-bold">Reviews</h2>
            <Reviews />
          </section>
        </div>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <QuoteForm compact defaultServiceSlug={s.slug} />
        </aside>
      </div>
      <div className="sticky bottom-14 z-20 border-t bg-white p-3 text-center lg:bottom-0">
        <Link to="/book" onClick={() => patch({ serviceId: s.id, step: 2 })} className="btn-cta">
          Book Now
        </Link>
      </div>
    </div>
  );
}
