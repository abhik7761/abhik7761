import { isSupportOnline } from './support';

describe('isSupportOnline', () => {
  it('open Monday 11:00 ET (EDT)', () =>
    expect(isSupportOnline(new Date('2026-06-01T15:00:00Z'))).toBe(true));
  it('closed Monday 10:00 ET', () => expect(isSupportOnline(new Date('2026-06-01T14:00:00Z'))).toBe(false));
  it('open in winter Monday 11:00 ET (EST)', () =>
    expect(isSupportOnline(new Date('2026-01-05T16:00:00Z'))).toBe(true));
  it('closed Saturday', () => expect(isSupportOnline(new Date('2026-06-06T16:00:00Z'))).toBe(false));
  it('closed at 6:30 PM ET', () => expect(isSupportOnline(new Date('2026-06-01T22:30:00Z'))).toBe(false));
});
