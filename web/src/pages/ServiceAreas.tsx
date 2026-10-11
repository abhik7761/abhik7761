import { useState } from 'react';
import { Seo } from '@/components/ui/Seo';
import { bookings } from '@/api';
import { zipSchema } from '@/lib/schemas';

export default function ServiceAreas() {
  const [zip, setZip] = useState('');
  const [res, setRes] = useState<string>('');
  const check = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!zipSchema.safeParse(zip).success) return setRes('Enter a 5-digit ZIP.');
    try {
      setRes(
        (await bookings.checkZip(zip.slice(0, 5))).covered
          ? 'Good news, we serve your area.'
          : "We're not in your area yet.",
      );
    } catch {
      setRes('Could not check right now.');
    }
  };
  return (
    <div className="container-x section max-w-3xl">
      <Seo title="Service areas" />
      <h1 className="text-4xl font-bold">Service areas</h1>
      <p className="mt-3">We currently cover select US metro areas. Check your ZIP:</p>
      <form onSubmit={check} className="mt-4 flex gap-2">
        <input
          className="input max-w-[200px]"
          inputMode="numeric"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          aria-label="ZIP code"
          placeholder="ZIP"
        />
        <button className="btn-primary">Check</button>
      </form>
      {res && (
        <p role="status" className="mt-4 font-semibold">
          {res}
        </p>
      )}
    </div>
  );
}
