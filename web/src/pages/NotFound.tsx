import { Link } from 'react-router-dom';
import { Seo } from '@/components/ui/Seo';
export default function NotFound() {
  return (
    <div className="container-x section text-center">
      <Seo title="Page not found" noindex />
      <h1 className="text-5xl font-bold">404</h1>
      <p className="mt-2">We couldn&apos;t find that page.</p>
      <form action="/services" className="mx-auto mt-6 flex max-w-sm gap-2">
        <input name="q" className="input" placeholder="Search services" aria-label="Search" />
        <button className="btn-primary">Search</button>
      </form>
      <Link to="/services" className="mt-6 inline-block font-semibold text-primary">
        Browse services →
      </Link>
    </div>
  );
}
