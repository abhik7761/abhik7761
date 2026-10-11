import type { OrderLine } from '@/types';
export const PROMOS: Record<string, { type: 'percent' | 'fixed'; value: number }> = {
  WELCOME10: { type: 'percent', value: 10 },
  SAVE25: { type: 'fixed', value: 2500 },
};
export const subtotal = (lines: OrderLine[]) => lines.reduce((s, l) => s + l.unitPrice * l.qty, 0);
export function discount(sub: number, code: string) {
  const p = PROMOS[code.trim().toUpperCase()];
  if (!p) return 0;
  return Math.min(sub, p.type === 'percent' ? Math.round((sub * p.value) / 100) : p.value);
}
