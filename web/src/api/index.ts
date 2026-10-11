import { api } from './client';
import type {
  Attribution,
  Booking,
  Brand,
  Category,
  Lead,
  Order,
  Paged,
  Product,
  Review,
  Service,
  Slot,
  User,
} from '@/types';

const unwrap = <T>(p: Promise<{ data: { data: T } }>) => p.then((r) => r.data.data);

export const services = {
  list: () => unwrap<Service[]>(api.get('/services')),
  get: (slug: string) => unwrap<Service>(api.get(`/services/${slug}`)),
};
export const products = {
  list: (params: Record<string, string | number | undefined>) =>
    api.get<Paged<Product>>('/products', { params }).then((r) => r.data),
  get: (slug: string) => unwrap<Product>(api.get(`/products/${slug}`)),
};
export const catalog = {
  categories: () => unwrap<Category[]>(api.get('/categories')),
  brands: () => unwrap<Brand[]>(api.get('/brands')),
  reviews: () => unwrap<Review[]>(api.get('/reviews')),
};
export const bookings = {
  checkZip: (zip: string) =>
    unwrap<{ covered: boolean }>(api.get('/service-areas/check', { params: { zip } })),
  slots: (serviceId: string, date: string) =>
    unwrap<Slot[]>(api.get('/slots', { params: { serviceId, date } })),
  create: (b: Partial<Booking>) => unwrap<Booking>(api.post('/bookings', b)),
  update: (id: string, patch: Partial<Booking>) => unwrap<Booking>(api.patch(`/bookings/${id}`, patch)),
  mine: () => unwrap<Booking[]>(api.get('/me/bookings')),
};
export const leads = {
  create: (l: Partial<Lead>) => unwrap<Lead>(api.post('/leads', l)),
};
export const orders = {
  quote: (b: { subtotal: number; items: { kind: string; refId: string; qty: number }[]; state?: string }) =>
    unwrap<{ tax: number; shipping: number }>(api.post('/cart/quote', b)),
  paymentIntent: (amount: number) =>
    unwrap<{ clientSecret: string }>(api.post('/checkout/payment-intent', { amount })),
  create: (o: Partial<Order>) => unwrap<Order>(api.post('/orders', o)),
  get: (id: string) => unwrap<Order>(api.get(`/orders/${id}`)),
  mine: () => unwrap<Order[]>(api.get('/me/orders')),
};
export const auth = {
  login: (b: { email: string; password: string }) =>
    unwrap<{ token: string; user: User }>(api.post('/auth/login', b)),
  signup: (b: { name: string; email: string; password: string }) =>
    unwrap<{ token: string; user: User }>(api.post('/auth/signup', b)),
  forgot: (email: string) => unwrap<{ ok: boolean }>(api.post('/auth/forgot-password', { email })),
};
export const admin = {
  leads: (page = 1) =>
    api.get<Paged<Lead>>('/admin/leads', { params: { page, pageSize: 50 } }).then((r) => r.data),
  updateLead: (id: string, patch: Partial<Lead>) => unwrap<Lead>(api.patch(`/admin/leads/${id}`, patch)),
  bookings: () =>
    api.get<Paged<Booking>>('/admin/bookings', { params: { pageSize: 50 } }).then((r) => r.data),
  orders: () => api.get<Paged<Order>>('/admin/orders', { params: { pageSize: 50 } }).then((r) => r.data),
};
export type { Attribution };
