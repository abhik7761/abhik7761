import { useEffect, useState } from 'react';
import { QuoteForm } from './QuoteForm';

/** Desktop only, once per session. */
export function ExitIntent() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches || sessionStorage.getItem('exit_shown')) return;
    const h = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        sessionStorage.setItem('exit_shown', '1');
        setShow(true);
      }
    };
    document.addEventListener('mouseout', h);
    return () => document.removeEventListener('mouseout', h);
  }, []);
  if (!show) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4"
      onClick={() => setShow(false)}
    >
      <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <button className="mb-2 ml-auto block rounded bg-white px-3 py-1" onClick={() => setShow(false)}>
          Close ✕
        </button>
        <QuoteForm compact />
      </div>
    </div>
  );
}
