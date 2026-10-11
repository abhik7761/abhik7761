import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { bookings } from '@/api';

export function SlotPicker({
  serviceId,
  tz,
  value,
  onChange,
}: {
  serviceId: string;
  tz: string;
  value?: string;
  onChange: (utc: string) => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const { data = [], isLoading } = useQuery({
    queryKey: ['slots', serviceId, date],
    queryFn: () => bookings.slots(serviceId, date),
  });
  const t = (iso: string) =>
    new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: tz,
      timeZoneName: 'short',
    }).format(new Date(iso));
  return (
    <div>
      <label className="label" htmlFor="slot-date">
        Date
      </label>
      <input
        id="slot-date"
        type="date"
        min={today}
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="input max-w-[220px]"
      />
      <div
        className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3"
        role="radiogroup"
        aria-label="Available times"
      >
        {isLoading && <p>Loading…</p>}
        {data.map((s) => (
          <button
            type="button"
            key={s.id}
            role="radio"
            aria-checked={value === s.startUtc}
            disabled={!s.available}
            onClick={() => onChange(s.startUtc)}
            className={`rounded-lg border px-3 py-2 text-sm ${value === s.startUtc ? 'border-primary bg-primary text-white' : 'border-slate-300 disabled:text-slate-300 disabled:line-through'}`}
          >
            {t(s.startUtc)}
          </button>
        ))}
      </div>
    </div>
  );
}
