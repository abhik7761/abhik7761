import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';
export const useAuth = create<{ user: User | null; setUser: (u: User | null) => void }>()(
  persist((set) => ({ user: null, setUser: (user) => set({ user }) }), { name: 'auth' }),
);
