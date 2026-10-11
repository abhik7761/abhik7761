import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Address } from '@/types';

export interface BookingDraft {
  step: number;
  serviceId?: string;
  deviceBrand: string;
  deviceModel: string;
  issue: string;
  photos: string[];
  address: Address;
  timezone: string;
  slotStartUtc?: string;
  name: string;
  email: string;
  phone: string;
  tcpa: boolean;
  payMode: 'deposit' | 'full';
}
const empty: BookingDraft = {
  step: 1,
  deviceBrand: '',
  deviceModel: '',
  issue: '',
  photos: [],
  address: { street: '', city: '', state: '', zip: '' },
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  name: '',
  email: '',
  phone: '',
  tcpa: false,
  payMode: 'deposit',
};
export const useBooking = create<{
  d: BookingDraft;
  patch: (p: Partial<BookingDraft>) => void;
  reset: () => void;
}>()(
  persist(
    (set) => ({
      d: empty,
      patch: (p) => set((s) => ({ d: { ...s.d, ...p } })),
      reset: () => set({ d: empty }),
    }),
    { name: 'booking-draft' },
  ),
);
