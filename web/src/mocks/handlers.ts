import { http, HttpResponse, delay } from 'msw';
import * as d from './data';
import type { Lead, Booking, Order, Paged } from '@/types';

const BASE = (import.meta.env.VITE_API_URL ?? '/api/v1').replace(/\/$/, '');
const p = (path: string) => `${BASE}${path}`;
const lat = () => delay(200 + Math.random() * 300);
const page = <T>(rows: T[], url: URL): Paged<T> => {
  const pg = Number(url.searchParams.get('page') ?? 1),
    size = Number(url.searchParams.get('pageSize') ?? 12);
  return { data: rows.slice((pg - 1) * size, pg * size), page: pg, pageSize: size, total: rows.length };
};
const err = (status: number, code: string, message: string) =>
  HttpResponse.json({ error: { code, message } }, { status });

const leads = [...d.leads];
const bookings = [...d.bookings];
const orders: Order[] = [];
let seq = 1000;

export const handlers = [
  http.get(p('/services'), async () => {
    await lat();
    return HttpResponse.json({ data: d.services });
  }),
  http.get(p('/services/:slug'), async ({ params }) => {
    await lat();
    const s = d.services.find((x) => x.slug === params.slug);
    return s ? HttpResponse.json({ data: s }) : err(404, 'not_found', 'Service not found');
  }),
  http.get(p('/products'), async ({ request }) => {
    await lat();
    const u = new URL(request.url);
    const q = u.searchParams;
    let rows = d.products.filter((x) => x.active);
    if (q.get('category')) rows = rows.filter((x) => x.categoryId === q.get('category'));
    if (q.get('brand')) rows = rows.filter((x) => x.brandId === q.get('brand'));
    if (q.get('inStock') === '1') rows = rows.filter((x) => x.stock > 0);
    if (q.get('minRating')) rows = rows.filter((x) => x.rating >= Number(q.get('minRating')));
    if (q.get('maxPrice')) rows = rows.filter((x) => x.price <= Number(q.get('maxPrice')));
    const sort = q.get('sort');
    if (sort === 'price_asc') rows = [...rows].sort((a, b) => a.price - b.price);
    if (sort === 'price_desc') rows = [...rows].sort((a, b) => b.price - a.price);
    return HttpResponse.json(page(rows, u));
  }),
  http.get(p('/products/:slug'), async ({ params }) => {
    await lat();
    const x = d.products.find((y) => y.slug === params.slug);
    return x ? HttpResponse.json({ data: x }) : err(404, 'not_found', 'Product not found');
  }),
  http.get(p('/categories'), async () => {
    await lat();
    return HttpResponse.json({ data: d.categories });
  }),
  http.get(p('/brands'), async () => {
    await lat();
    return HttpResponse.json({ data: d.brands });
  }),
  http.get(p('/reviews'), async () => {
    await lat();
    return HttpResponse.json({ data: d.reviews });
  }),
  http.get(p('/service-areas/check'), async ({ request }) => {
    await lat();
    const zip = new URL(request.url).searchParams.get('zip') ?? '';
    if (!/^\d{5}$/.test(zip)) return err(400, 'invalid_zip', 'Enter a 5-digit ZIP');
    return HttpResponse.json({
      data: { covered: d.serviceAreaZipPrefixes.some((pre) => zip.startsWith(pre)) },
    });
  }),
  http.get(p('/slots'), async ({ request }) => {
    await lat();
    const q = new URL(request.url).searchParams;
    const serviceId = q.get('serviceId') ?? 's1';
    const date = q.get('date') ?? new Date().toISOString().slice(0, 10);
    const slots = [13, 15, 17, 19, 21].map((h, i) => {
      const start = new Date(`${date}T${String(h).padStart(2, '0')}:00:00Z`);
      return {
        id: `${serviceId}-${date}-${h}`,
        serviceId,
        startUtc: start.toISOString(),
        endUtc: new Date(+start + 36e5 * 2).toISOString(),
        available: (i + date.length) % 4 !== 0,
      };
    });
    return HttpResponse.json({ data: slots });
  }),
  http.post(p('/leads'), async ({ request }) => {
    await lat();
    const b = (await request.json()) as Partial<Lead>;
    if (!b.type) return err(400, 'validation', 'type required');
    const lead = { status: 'New', createdAt: new Date().toISOString(), ...b, id: `l${++seq}` } as Lead;
    leads.unshift(lead);
    return HttpResponse.json({ data: lead }, { status: 201 });
  }),
  http.post(p('/bookings'), async ({ request }) => {
    await lat();
    const b = (await request.json()) as Partial<Booking>;
    const bk = { ...b, id: `bk${++seq}`, status: 'Pending' } as Booking;
    bookings.unshift(bk);
    return HttpResponse.json({ data: bk }, { status: 201 });
  }),
  http.patch(p('/bookings/:id'), async ({ params, request }) => {
    await lat();
    const bk = bookings.find((x) => x.id === params.id);
    if (!bk) return err(404, 'not_found', 'Booking not found');
    Object.assign(bk, await request.json());
    return HttpResponse.json({ data: bk });
  }),
  http.post(p('/cart/quote'), async ({ request }) => {
    await lat();
    const b = (await request.json()) as {
      subtotal: number;
      items: { kind: string; refId: string; qty: number }[];
      state?: string;
    };
    const weightLb = b.items
      .filter((i) => i.kind === 'product')
      .reduce((w, i) => w + (d.products.find((x) => x.id === i.refId)?.weightLb ?? 50) * i.qty, 0);
    const shipping = weightLb === 0 ? 0 : weightLb > 150 ? 14900 : 4900;
    const tax = Math.round(b.subtotal * 0.07);
    return HttpResponse.json({ data: { tax, shipping } });
  }),
  http.post(p('/checkout/payment-intent'), async () => {
    await lat();
    return HttpResponse.json({ data: { clientSecret: 'mock_secret' } });
  }),
  http.post(p('/orders'), async ({ request }) => {
    await lat();
    const o = {
      ...((await request.json()) as object),
      id: `ord${++seq}`,
      status: 'Paid',
      createdAt: new Date().toISOString(),
    } as Order;
    orders.unshift(o);
    return HttpResponse.json({ data: o }, { status: 201 });
  }),
  http.get(p('/orders/:id'), async ({ params }) => {
    await lat();
    const o = orders.find((x) => x.id === params.id);
    return o ? HttpResponse.json({ data: o }) : err(404, 'not_found', 'Order not found');
  }),
  http.post(p('/auth/login'), async ({ request }) => {
    await lat();
    const b = (await request.json()) as { email: string; password: string };
    if (!b.password || b.password.length < 6)
      return err(401, 'invalid_credentials', 'Invalid email or password');
    const role = b.email.startsWith('admin') ? 'admin' : 'customer';
    return HttpResponse.json({
      data: { token: 'mock', user: { id: 'u1', name: b.email.split('@')[0], email: b.email, role } },
    });
  }),
  http.post(p('/auth/signup'), async ({ request }) => {
    await lat();
    const b = (await request.json()) as { name: string; email: string };
    return HttpResponse.json(
      { data: { token: 'mock', user: { id: 'u2', name: b.name, email: b.email, role: 'customer' } } },
      { status: 201 },
    );
  }),
  http.post(p('/auth/forgot-password'), async () => {
    await lat();
    return HttpResponse.json({ data: { ok: true } });
  }),
  http.post(p('/auth/logout'), async () => HttpResponse.json({ data: { ok: true } })),
  http.get(p('/me/bookings'), async () => {
    await lat();
    return HttpResponse.json({ data: bookings.slice(0, 5) });
  }),
  http.get(p('/me/orders'), async () => {
    await lat();
    return HttpResponse.json({ data: orders });
  }),
  http.get(p('/admin/leads'), async ({ request }) => {
    await lat();
    return HttpResponse.json(page(leads, new URL(request.url)));
  }),
  http.get(p('/admin/bookings'), async ({ request }) => {
    await lat();
    return HttpResponse.json(page(bookings, new URL(request.url)));
  }),
  http.get(p('/admin/orders'), async ({ request }) => {
    await lat();
    return HttpResponse.json(page(orders, new URL(request.url)));
  }),
  http.patch(p('/admin/leads/:id'), async ({ params, request }) => {
    const l = leads.find((x) => x.id === params.id);
    if (!l) return err(404, 'not_found', 'Lead not found');
    Object.assign(l, await request.json());
    return HttpResponse.json({ data: l });
  }),
];
