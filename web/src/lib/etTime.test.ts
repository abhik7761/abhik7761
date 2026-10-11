import { etWallToDate } from './etTime';
it('10:30 ET in summer is 14:30Z', () =>
  expect(etWallToDate('10:30', new Date('2026-06-01T12:00:00Z')).toISOString()).toBe(
    '2026-06-01T14:30:00.000Z',
  ));
it('10:30 ET in winter is 15:30Z', () =>
  expect(etWallToDate('10:30', new Date('2026-01-05T12:00:00Z')).toISOString()).toBe(
    '2026-01-05T15:30:00.000Z',
  ));
