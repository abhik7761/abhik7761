import { brand } from '@/config/brand';
import { Seo } from '@/components/ui/Seo';
import { QuoteForm } from '@/features/leads/QuoteForm';
import { SupportStatus, supportHoursLocal } from '@/features/support/SupportStatus';
import { useSupportOnline } from '@/features/support/SupportStatus';

export default function Contact() {
  const online = useSupportOnline();
  return (
    <div className="container-x section grid gap-10 lg:grid-cols-2">
      <Seo title="Contact" />
      <div>
        <h1 className="text-4xl font-bold">Contact us</h1>
        <p className="mt-4 text-lg">
          Call{' '}
          <a className="font-semibold text-primary" href={`tel:${brand.supportPhoneTel}`}>
            {brand.supportPhone}
          </a>
        </p>
        <p className="mt-2 text-slate-600">Support hours: {supportHoursLocal()}</p>
        <div className="mt-3">
          <SupportStatus showHours={false} />
        </div>
        {online && (
          <p className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm">
            Use the chat bubble at the bottom right to talk with us now.
          </p>
        )}
      </div>
      <div id="quote">
        <QuoteForm type={online ? 'quote' : 'callback'} />
      </div>
    </div>
  );
}
