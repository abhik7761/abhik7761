import { bookingAmounts, canModify } from './pricing';
import type { Service } from '@/types';
const base = { priceFrom: 10000 } as Service;
describe('pricing', () => {
  it('percent deposit', () =>
    expect(
      bookingAmounts({ ...base, depositType: 'percent', depositValue: 25 } as Service, 'deposit').dueNow,
    ).toBe(2500));
  it('full', () =>
    expect(
      bookingAmounts({ ...base, depositType: 'percent', depositValue: 25 } as Service, 'full').dueNow,
    ).toBe(10000));
  it('no deposit means pay full', () =>
    expect(
      bookingAmounts({ ...base, depositType: 'none', depositValue: 0 } as Service, 'deposit').dueNow,
    ).toBe(10000));
  it('24h rule', () => {
    const now = Date.now();
    expect(canModify(new Date(now + 25 * 36e5).toISOString(), now)).toBe(true);
    expect(canModify(new Date(now + 23 * 36e5).toISOString(), now)).toBe(false);
  });
});
