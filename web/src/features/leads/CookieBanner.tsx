import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getConsent, setConsent } from '@/lib/consent';

export function CookieBanner() {
  const [c, setC] = useState(getConsent());
  if (c) return null;
  const pick = (v: 'accepted' | 'rejected') => {
    setConsent(v);
    setC(v);
  };
  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-16 left-3 right-3 z-50 max-w-md rounded-xl2 border border-slate-200 bg-white p-4 shadow-2xl lg:bottom-4"
    >
      <p className="text-sm">
        We use cookies for analytics and ads. See our{' '}
        <Link className="underline" to="/cookies">
          Cookie Policy
        </Link>
        .
      </p>
      <div className="mt-3 flex gap-2">
        <button className="btn-primary !px-4 !py-2" onClick={() => pick('accepted')}>
          Accept
        </button>
        <button className="btn-ghost !px-4 !py-2" onClick={() => pick('rejected')}>
          Reject
        </button>
        <Link to="/cookies" className="btn-ghost !px-4 !py-2">
          Preferences
        </Link>
      </div>
    </div>
  );
}
