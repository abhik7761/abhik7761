import { useQuery } from '@tanstack/react-query';
import { orders } from '@/api';
import type { OrderLine } from '@/types';

/** Tax + shipping come from the API (Stripe Tax / zone rates on the real backend). */
export function useCartQuote(taxable: number, lines: OrderLine[], state?: string) {
  const items = lines.map((l) => ({ kind: l.kind, refId: l.refId, qty: l.qty }));
  return useQuery({
    queryKey: ['cartQuote', taxable, items, state],
    queryFn: () => orders.quote({ subtotal: taxable, items, state }),
    placeholderData: (p) => p,
  }).data;
}
