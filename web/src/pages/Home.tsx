import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { catalog, products, services } from '@/api';
import { brand } from '@/config/brand';
import { HeroVideo } from '@/components/ui/HeroVideo';
import { Seo } from '@/components/ui/Seo';
import { Reveal } from '@/components/ui/Reveal';
import { Counter } from '@/components/ui/Counter';
import { ServiceCard } from '@/components/ui/ServiceCard';
import { ProductCard } from '@/components/ui/ProductCard';
import { BrandsStrip } from '@/components/ui/BrandsStrip';
import { Reviews } from '@/components/ui/Reviews';
import { Faq } from '@/components/ui/Faq';
import { QuoteForm } from '@/features/leads/QuoteForm';
import { SupportStatus } from '@/features/support/SupportStatus';

const stats = [
  { label: 'Jobs completed', to: 12000, suffix: '+' },
  { label: 'Average rating', to: 4.9, decimals: 1 },
  { label: 'Years in business', to: 10 },
]; // placeholder: true
const steps = [
  ['1', 'Book online', 'Pick a service and a time that suits you.'],
  ['2', 'We come to you', 'A certified technician arrives on schedule.'],
  ['3', 'Job done right', 'Tested, explained and backed by our guarantee.'],
];
export const homeFaq = [
  {
    q: 'Which brands do you service?',
    a: 'We are an authorized provider for brands such as Garmin and Lowrance, plus major home appliance brands.',
  },
  {
    q: 'How fast can I get an appointment?',
    a: 'Most areas have availability within the week. Pick a slot online.',
  },
  { q: 'Do you offer a guarantee?', a: 'Yes. Every job is backed by our satisfaction guarantee.' },
];

export default function Home() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, reduce ? 0 : 120]);
  const { data: svcs = [] } = useQuery({ queryKey: ['services'], queryFn: services.list });
  const { data: cats = [] } = useQuery({ queryKey: ['categories'], queryFn: catalog.categories });
  const { data: prods } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => products.list({ pageSize: 4 }),
  });
  return (
    <>
      <Seo
        title="Authorized installation, setup & repair"
        description={brand.tagline}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: brand.name,
          telephone: brand.supportPhone,
          areaServed: 'US',
        }}
      />
      <section className="relative isolate flex min-h-[88vh] items-center overflow-hidden text-white">
        <HeroVideo />
        <div className="container-x relative z-10 grid items-center gap-10 py-16 lg:grid-cols-[1.2fr_1fr]">
          <motion.div style={{ y }}>
            <h1 className="font-display text-4xl font-extrabold leading-tight text-white sm:text-6xl">
              {'Expert onsite install & repair.'.split(' ').map((w, i) => (
                <motion.span
                  key={i}
                  className="mr-3 inline-block"
                  initial={reduce ? false : { opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.12 }}
                >
                  {w}
                </motion.span>
              ))}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-slate-200">
              Authorized technicians for marine electronics and home appliances, at your door.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/book" className="btn-cta">
                Book Now
              </Link>
              <Link to="/contact#quote" className="btn-ghost !bg-transparent !text-white">
                Get a Free Quote
              </Link>
            </div>
            <div className="mt-6 text-slate-200">
              <SupportStatus />
            </div>
          </motion.div>
          <div id="quote">
            <QuoteForm compact />
          </div>
        </div>
      </section>
      <section className="section container-x">
        <Reveal>
          <h2 className="text-3xl font-bold">What do you need help with?</h2>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {cats
            .filter((c) => c.type === 'service')
            .map((c, i) => (
              <Reveal key={c.id} delay={i * 0.05}>
                <Link to={`/services?category=${c.id}`} className="card block text-center font-semibold">
                  {c.name}
                </Link>
              </Reveal>
            ))}
        </div>
      </section>
      <section className="bg-slate-50 section">
        <div className="container-x">
          <Reveal>
            <h2 className="text-3xl font-bold">How it works</h2>
          </Reveal>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {steps.map(([n, t, d], i) => (
              <Reveal key={n} delay={i * 0.1}>
                <div className="card">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-primary font-bold text-white">
                    {n}
                  </span>
                  <h3 className="mt-3 text-xl font-bold">{t}</h3>
                  <p className="mt-1 text-slate-600">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="section container-x">
        <BrandsStrip />
      </section>
      <section className="section container-x">
        <div className="flex items-end justify-between">
          <h2 className="text-3xl font-bold">Featured services</h2>
          <Link to="/services" className="font-semibold text-primary">
            View all →
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {svcs.slice(0, 6).map((s) => (
            <Reveal key={s.id}>
              <ServiceCard s={s} />
            </Reveal>
          ))}
        </div>
      </section>
      <section className="bg-slate-50 section">
        <div className="container-x">
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-bold">Featured appliances</h2>
            <Link to="/shop" className="font-semibold text-primary">
              Shop all →
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {prods?.data.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </div>
      </section>
      <section className="bg-primary py-14 text-white">
        <div className="container-x grid gap-6 text-center sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-display text-5xl font-extrabold">
                <Counter to={s.to} decimals={s.decimals} suffix={s.suffix} />
              </p>
              <p className="mt-1 text-slate-200">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-slate-300">
          Placeholder figures — replace in config before launch.
        </p>
      </section>
      <section className="section container-x">
        <h2 className="mb-6 text-3xl font-bold">What customers say</h2>
        <Reviews />
      </section>
      <section className="bg-slate-50 section">
        <div className="container-x max-w-3xl">
          <h2 className="mb-6 text-3xl font-bold">Frequently asked questions</h2>
          <Faq items={homeFaq} />
        </div>
      </section>
      <section className="bg-cta py-14 text-center text-white">
        <h2 className="text-3xl font-bold !text-white">Ready when you are.</h2>
        <Link to="/book" className="btn mt-5 bg-white text-ink">
          Book Now
        </Link>
      </section>
    </>
  );
}
