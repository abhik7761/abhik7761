import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { orders } from '@/api';
import { money } from '@/lib/format';
import { Seo } from '@/components/ui/Seo';
import { downloadIcs } from '@/features/booking/ics';

export default function Confirmation() {
  const { id = '' } = useParams();
  const [sp] = useSearchParams();
  const isBooking = sp.get('type') === 'booking';
  const { data: o } = useQuery({
    queryKey: ['order', id],
    queryFn: () => orders.get(id),
    enabled: !isBooking,
  });
  return (
    <div className="container-x section max-w-2xl">
      <Seo title="Confirmation" noindex />
      <h1 className="text-3xl font-bold">Thank you!</h1>
      <p className="mt-2">
        Confirmation <b>{id}</b>. A confirmation email has been sent (mock).
      </p>
      {isBooking && (
        <p className="mt-4">
          Track your booking under{' '}
          <Link className="underline" to="/account">
            My Account
          </Link>
          : Pending → Confirmed → Technician assigned → On the way → Completed.
        </p>
      )}
      {o && (
        <div className="card mt-6 !hover:translate-y-0">
          {o.items.map((l) => (
            <div key={l.kind + l.refId} className="flex items-center justify-between py-1 text-sm">
              <span>
                {l.name} × {l.qty}
              </span>
              <span>{money(l.unitPrice * l.qty)}</span>
            </div>
          ))}
          <p className="mt-2 font-bold">Total {money(o.total)}</p>
          <p className="mt-3 text-sm text-slate-600">
            Products: Paid (shipping status in My Account).{' '}
            {o.items.some((l) => l.kind === 'service') ? 'Services: Pending scheduling confirmation.' : ''}
          </p>
          {o.items
            .filter((l) => l.slotStartUtc)
            .map((l) => (
              <button
                key={l.refId}
                className="btn-ghost mt-3"
                onClick={() => downloadIcs(l.name, l.slotStartUtc!, 120)}
              >
                Add to calendar
              </button>
            ))}
        </div>
      )}
      <Link to="/" className="btn-primary mt-8">
        Back to home
      </Link>
    </div>
  );
}
