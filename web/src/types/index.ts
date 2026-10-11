import { z } from 'zod';

export const attributionSchema = z.object({
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmTerm: z.string().optional(),
  utmContent: z.string().optional(),
  gclid: z.string().optional(),
  fbclid: z.string().optional(),
  landingPage: z.string(),
  referrer: z.string(),
  firstSeenAt: z.string(),
});
export type Attribution = z.infer<typeof attributionSchema>;

export interface Category {
  id: string;
  slug: string;
  name: string;
  type: 'service' | 'product';
  order: number;
}
export interface Brand {
  id: string;
  slug: string;
  name: string;
  logo: string;
  order: number;
  placeholder?: boolean;
}
export interface Service {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  shortDesc: string;
  description: string;
  images: string[];
  priceFrom: number;
  depositType: 'none' | 'fixed' | 'percent';
  depositValue: number;
  durationMin: number;
  brandIds: string[];
  active: boolean;
}
export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  brandId: string;
  categoryId: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  images: string[];
  specs: Record<string, string>;
  installServiceId?: string;
  rating: number;
  reviewCount: number;
  active: boolean;
  weightLb: number;
}
export interface Slot {
  id: string;
  serviceId: string;
  startUtc: string;
  endUtc: string;
  available: boolean;
}
export type BookingStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Technician assigned'
  | 'On the way'
  | 'Completed'
  | 'Review requested'
  | 'Cancelled';
export interface Booking {
  id: string;
  serviceId: string;
  customerName: string;
  email: string;
  phone: string;
  device: { brand: string; model?: string; issue: string; photos: string[] };
  address: Address;
  slotStartUtc: string;
  timezone: string;
  status: BookingStatus;
  technicianId?: string;
  paymentStatus: 'unpaid' | 'deposit' | 'paid';
  amount: number;
  deposit: number;
  attribution?: Attribution;
}
export type LeadType = 'quote' | 'callback' | 'booking_abandoned' | 'out_of_area' | 'chat';
export interface Lead {
  id: string;
  type: LeadType;
  name: string;
  email: string;
  phone: string;
  serviceId?: string;
  zip?: string;
  message?: string;
  status: 'New' | 'Contacted' | 'Quoted' | 'Booked' | 'Lost';
  tcpaConsent: { text: string; at: string; url: string };
  attribution?: Attribution;
  createdAt: string;
}
export interface Address {
  street: string;
  unit?: string;
  city: string;
  state: string;
  zip: string;
}
export interface OrderLine {
  kind: 'product' | 'service';
  refId: string;
  name: string;
  qty: number;
  unitPrice: number;
  slotStartUtc?: string;
}
export interface Order {
  id: string;
  customerEmail: string;
  items: OrderLine[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: 'USD';
  status: 'Paid' | 'Shipped' | 'Delivered' | 'Refunded';
  shippingAddress?: Address;
  attribution?: Attribution;
  createdAt: string;
  bookingStatus?: BookingStatus;
}
export interface Review {
  id: string;
  author: string;
  rating: number;
  body: string;
  placeholder?: boolean;
}
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'staff' | 'admin';
}
export interface Paged<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
}
