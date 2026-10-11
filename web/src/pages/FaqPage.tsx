import { Seo } from '@/components/ui/Seo';
import { Faq } from '@/components/ui/Faq';
import { homeFaq } from './Home';
const groups = {
  Booking: [
    { q: 'Can I cancel?', a: 'Yes, up to 24 hours before your slot.' },
    { q: 'How do I reschedule?', a: 'From My Account.' },
  ],
  Services: homeFaq,
  Orders: [{ q: 'When do products ship?', a: 'Estimated delivery is shown on the product page by ZIP.' }],
};
export default function FaqPage() {
  return (
    <div className="container-x section max-w-3xl">
      <Seo title="FAQ" />
      <h1 className="mb-6 text-4xl font-bold">FAQ</h1>
      {Object.entries(groups).map(([g, items]) => (
        <section key={g} className="mb-8">
          <h2 className="mb-3 text-xl font-bold">{g}</h2>
          <Faq items={items} />
        </section>
      ))}
    </div>
  );
}
