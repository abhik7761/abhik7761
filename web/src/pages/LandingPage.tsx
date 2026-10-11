import { useParams, useSearchParams } from 'react-router-dom';
import { landingPages } from '@/config/landingPages';
import { Seo } from '@/components/ui/Seo';
import { Faq } from '@/components/ui/Faq';
import { Reviews } from '@/components/ui/Reviews';
import { BrandsStrip } from '@/components/ui/BrandsStrip';
import { QuoteForm } from '@/features/leads/QuoteForm';
import { SupportStatus } from '@/features/support/SupportStatus';
import NotFound from './NotFound';

const sanitize = (h: string | null) => (h && /^[\w\s,.&'-]{1,80}$/.test(h) ? h : null); // whitelisted chars only; React escapes output
export default function LandingPage() {
  const { slug } = useParams();
  const [sp] = useSearchParams();
  const lp = landingPages.find((l) => l.slug === slug);
  if (!lp) return <NotFound />;
  return (
    <div>
      <Seo title={lp.headline} noindex />
      <section className="bg-slate-950 py-12 text-white">
        <div className="container-x grid items-start gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h1 className="text-4xl font-extrabold !text-white sm:text-5xl">
              {sanitize(sp.get('h')) ?? lp.headline}
            </h1>
            <p className="mt-3 text-lg text-slate-200">{lp.subheadline}</p>
            <ul className="mt-6 space-y-2">
              {lp.benefits.map((b) => (
                <li key={b}>✓ {b}</li>
              ))}
            </ul>
            <div className="mt-6 text-slate-300">
              <SupportStatus />
            </div>
          </div>
          <QuoteForm compact defaultServiceSlug={lp.serviceSlug} />
        </div>
      </section>
      <section className="section container-x">
        <BrandsStrip />
      </section>
      <section className="container-x pb-12">
        <Reviews />
      </section>
      <section className="container-x max-w-3xl pb-16">
        <Faq items={lp.faq} />
      </section>
    </div>
  );
}
