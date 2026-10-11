import { Navigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bookings, orders, services } from '@/api';
import { fmtDateTime, money } from '@/lib/format';
import { useAuth } from '@/store/auth';
import { Seo } from '@/components/ui/Seo';
import { canModify } from '@/features/booking/pricing';

export default function Account() {
  const { user, setUser } = useAuth();
  const qc = useQueryClient();
  const { data: bks = [] } = useQuery({ queryKey: ['myBookings'], queryFn: bookings.mine, enabled: !!user });
  const { data: ords = [] } = useQuery({ queryKey: ['myOrders'], queryFn: orders.mine, enabled: !!user });
  const { data: svcs = [] } = useQuery({ queryKey: ['services'], queryFn: services.list });
  const cancel = useMutation({
    mutationFn: (id: string) => bookings.update(id, { status: 'Cancelled' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['myBookings'] }),
  });
  if (!user) return <Navigate to="/login" replace />;
  return (
    <div className="container-x section">
      <Seo title="My account" noindex />
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Hi, {user.name}</h1>
        <button className="btn-ghost" onClick={() => setUser(null)}>
          Log out
        </button>
      </div>
      <h2 className="mt-8 text-xl font-bold">Bookings</h2>
      <div className="mt-3 space-y-3">
        {bks.map((b) => (
          <div key={b.id} className="card !hover:translate-y-0 flex flex-wrap items-center gap-3">
            <div className="flex-1">
              <b>{svcs.find((s) => s.id === b.serviceId)?.name ?? b.serviceId}</b>
              <br />
              <span className="text-sm text-slate-600">{fmtDateTime(b.slotStartUtc, b.timezone)}</span>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">{b.status}</span>
            {b.status !== 'Cancelled' &&
              b.status !== 'Completed' &&
              (canModify(b.slotStartUtc) ? (
                <button className="text-sm text-red-600 underline" onClick={() => cancel.mutate(b.id)}>
                  Cancel
                </button>
              ) : (
                <span className="text-xs text-slate-500">Changes locked within 24h</span>
              ))}
          </div>
        ))}
        {!bks.length && <p>No bookings yet.</p>}
      </div>
      <h2 className="mt-8 text-xl font-bold">Orders</h2>
      <div className="mt-3 space-y-3">
        {ords.map((o) => (
          <div key={o.id} className="card !hover:translate-y-0">
            {o.id} · {money(o.total)} · {o.status}
          </div>
        ))}
        {!ords.length && <p>No orders yet.</p>}
      </div>
      <h2 className="mt-8 text-xl font-bold">Profile</h2>
      <p className="mt-2">{user.email}</p>
    </div>
  );
}
