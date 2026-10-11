import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { OrderLine } from '@/types';

interface CartState {
  lines: OrderLine[];
  promo: string;
  add: (l: OrderLine) => void;
  setQty: (refId: string, kind: OrderLine['kind'], qty: number) => void;
  setSlot: (refId: string, slot: string) => void;
  remove: (refId: string, kind: OrderLine['kind']) => void;
  setPromo: (c: string) => void;
  clear: () => void;
}
export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      promo: '',
      add: (l) =>
        set((s) => {
          const ex = s.lines.find((x) => x.refId === l.refId && x.kind === l.kind);
          return ex && l.kind === 'product'
            ? { lines: s.lines.map((x) => (x === ex ? { ...x, qty: x.qty + l.qty } : x)) }
            : ex
              ? s
              : { lines: [...s.lines, l] };
        }),
      setQty: (refId, kind, qty) =>
        set((s) => ({
          lines: s.lines.map((x) =>
            x.refId === refId && x.kind === kind ? { ...x, qty: Math.max(1, qty) } : x,
          ),
        })),
      setSlot: (refId, slot) =>
        set((s) => ({
          lines: s.lines.map((x) =>
            x.refId === refId && x.kind === 'service' ? { ...x, slotStartUtc: slot } : x,
          ),
        })),
      remove: (refId, kind) =>
        set((s) => ({ lines: s.lines.filter((x) => !(x.refId === refId && x.kind === kind)) })),
      setPromo: (promo) => set({ promo }),
      clear: () => set({ lines: [], promo: '' }),
    }),
    { name: 'cart' },
  ),
);
