import axios from 'axios';

// Switching to the real backend = change VITE_API_URL / VITE_USE_MOCKS in .env only.
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL ?? '/api/v1' });
export const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';
