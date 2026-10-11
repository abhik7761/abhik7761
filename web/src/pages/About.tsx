import { Seo } from '@/components/ui/Seo';
export default function About() {
  return (
    <div className="container-x section max-w-3xl">
      <Seo title="About" />
      <h1 className="text-4xl font-bold">About us</h1>
      <p className="mt-4">
        We are an authorized onsite tech service company. Our certified, insured and background-checked
        technicians install, set up and repair marine electronics and home appliances.{' '}
        {/* TODO: real story + team photos */}
      </p>
      <h2 className="mt-8 text-2xl font-bold">Authorizations</h2>
      <p className="mt-2">Authorized service provider for brands such as Garmin and Lowrance.</p>
    </div>
  );
}
