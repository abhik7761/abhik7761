import type { Service } from '@/types';
export function bookingAmounts(s: Service, mode: 'deposit' | 'full') {
  const deposit =
    s.depositType === 'none'
      ? 0
      : s.depositType === 'fixed'
        ? s.depositValue
        : Math.round((s.priceFrom * s.depositValue) / 100);
  return { total: s.priceFrom, deposit, dueNow: mode === 'deposit' && deposit > 0 ? deposit : s.priceFrom };
}
/** Reschedule/cancel allowed until this many hours before the slot (configurable). */
export const CANCEL_WINDOW_HOURS = 24;
export const canModify = (slotStartUtc: string, now = Date.now()) =>
  new Date(slotStartUtc).getTime() - now >= CANCEL_WINDOW_HOURS * 36e5;
