import { discount, subtotal } from './totals';
it('subtotal', () =>
  expect(
    subtotal([
      { kind: 'product', refId: '1', name: 'a', qty: 2, unitPrice: 500 },
      { kind: 'service', refId: 's', name: 'b', qty: 1, unitPrice: 100 },
    ]),
  ).toBe(1100));
it('percent promo', () => expect(discount(10000, 'welcome10')).toBe(1000));
it('fixed promo capped', () => expect(discount(1000, 'SAVE25')).toBe(1000));
it('bad promo', () => expect(discount(1000, 'nope')).toBe(0));
