import { useEffect, useState } from 'react';
import { support } from '@/config/support';
import { etWallToDate } from '@/lib/etTime';
import { isSupportOnline } from '@/lib/support';

const fmt = (d: Date) =>
  new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }).format(d);
export const supportHoursLocal = () =>
  `Mon–Fri ${fmt(etWallToDate(support.open))} to ${fmt(etWallToDate(support.close))}`;

export function useSupportOnline() {
  const [on, setOn] = useState(isSupportOnline());
  useEffect(() => {
    const t = setInterval(() => setOn(isSupportOnline()), 60_000);
    return () => clearInterval(t);
  }, []);
  return on;
}

export function SupportStatus({ showHours = true }: { showHours?: boolean }) {
  const on = useSupportOnline();
  return (
    <p className="inline-flex items-center gap-2 text-sm" role="status">
      <span className={`h-2.5 w-2.5 rounded-full ${on ? 'bg-emerald-500' : 'bg-slate-400'}`} aria-hidden />
      {on
        ? 'Our team is online. Chat with us now.'
        : "We're offline. Leave your details and we'll call you back next business day."}
      {showHours && <span className="text-slate-500">({supportHoursLocal()})</span>}
    </p>
  );
}
