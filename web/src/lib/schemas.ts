import { z } from 'zod';
export const phoneSchema = z
  .string()
  .refine((v) => v.replace(/\D/g, '').length === 10, 'Enter a 10-digit US phone');
export const zipSchema = z.string().regex(/^\d{5}(-\d{4})?$/, 'Enter a 5-digit ZIP');
export const US_STATES =
  'AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY'.split(
    ' ',
  );
export const US_ZONES = [
  ['America/New_York', 'Eastern'],
  ['America/Chicago', 'Central'],
  ['America/Denver', 'Mountain'],
  ['America/Los_Angeles', 'Pacific'],
  ['America/Anchorage', 'Alaska'],
  ['Pacific/Honolulu', 'Hawaii'],
] as const;
