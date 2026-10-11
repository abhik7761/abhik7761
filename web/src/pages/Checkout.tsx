import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { orders } from '@/api';
import { getAttribution } from '@/lib/attribution';
import { formatPhone, money } from '@/lib/format';
import { US_STATES, phoneSchema, zipSchema } from '@/lib/schemas';
import { track } from '@/lib/track';
import { useCart } from '@/store/cart';
import { Seo } from '@/components/ui/Seo';
import { Field } from '@/components/ui/Field';
import { discount, subtotal } from '@/features/cart/totals';
import { useCartQuote } from '@/features/cart/useCartQuote';
import { z } from 'zod';
import type { Address } from '@/types';

function AddrFields({ v, set }: { v: Address; set: (a: Address) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Field label="Street">
          <input className="input" value={v.street} onChange={(e) => set({ ...v, street: e.target.value })} />
        </Field>
      </div>
      <Field label="Apt / Suite">
        <input className="input" value={v.unit} onChange={(e) => set({ ...v, unit: e.target.value })} />
      </Field>
      <Field label="City">
        <input className="input" value={v.city} onChange={(e) => set({ ...v, city: e.target.value })} />
      </Field>
      <Field label="State">
        <select className="input" value={v.state} onChange={(e) => set({ ...v, state: e.target.value })}>
          <option value="">—</option>
          {US_STATES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </Field>
      <Field label="ZIP">
        <input
          className="input"
          inputMode="numeric"
          value={v.zip}
          onChange={(e) => set({ ...v, zip: e.target.value })}
        />
      </Field>
    </div>
  );
}

const blank: Address = { street: '', unit: '', city: '', state: '', zip: '' };
export default function Checkout() {
  const { lines, promo, clear } = useCart();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [ship, setShip] = useState<Address>(blank);
  const [svcAddr, setSvcAddr] = useState<Address>(blank);
  const [same, setSame] = useState(true);
  const [card, setCard] = useState({ n: '', exp: '', cvc: '' });
  const [err, setErr] = useState('');
  const hasProducts = lines.some((l) => l.kind === 'product'),
    hasServices = lines.some((l) => l.kind === 'service');
  const sub = subtotal(lines),
    disc = discount(sub, promo);
  const q = useCartQuote(sub - disc, lines, ship.state);
  const total = sub - disc + (q?.shipping ?? 0) + (q?.tax ?? 0);
  const tracked = useRef(false);
  useEffect(() => {
    if (!tracked.current) {
      tracked.current = true;
      track('begin_checkout', { value: sub / 100, currency: 'USD' });
    }
  }, [sub]);
  const pay = useMutation({
    mutationFn: async () => {
      await orders.paymentIntent(total); // mock Stripe: real build confirms the Payment Element with this client secret
      return orders.create({
        customerEmail: email,
        items: lines,
        subtotal: sub,
        discount: disc,
        tax: q?.tax ?? 0,
        shipping: q?.shipping ?? 0,
        total,
        currency: 'USD',
        shippingAddress: hasProducts ? ship : svcAddr,
        attribution: getAttribution(),
      });
    },
    onSuccess: (o) => {
      track('purchase', { value: total / 100, currency: 'USD', transaction_id: o.id });
      clear();
      nav(`/order/confirmation/${o.id}`);
    },
  });
  if (!lines.length)
    return (
      <div className="container-x section text-center">
        <Link to="/shop" className="btn-cta">
          Your cart is empty — shop appliances
        </Link>
      </div>
    );
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    if (!z.string().email().safeParse(email).success || !phoneSchema.safeParse(phone).success)
      return setErr('Enter a valid email and 10-digit phone.');
    const a = hasProducts ? ship : svcAddr;
    if (!a.street || !a.city || !a.state || !zipSchema.safeParse(a.zip).success)
      return setErr('Complete the address with a valid ZIP.');
    if (hasServices && lines.some((l) => l.kind === 'service' && !l.slotStartUtc))
      return setErr('Pick a time for each service in your cart.');
    if (card.n.replace(/\s/g, '').length < 13 || card.cvc.length < 3)
      return setErr('Enter test card details.');
    pay.mutate();
  };
  return (
    <form onSubmit={submit} className="container-x section grid gap-10 lg:grid-cols-[1fr_340px]" noValidate>
      <Seo title="Checkout" noindex />
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <section className="space-y-3">
          <h2 className="text-xl font-bold">Contact</h2>
          <Field label="Email">
            <input
              className="input"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field label="Phone">
            <input
              className="input"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
            />
          </Field>
        </section>
        {hasProducts && (
          <section>
            <h2 className="mb-3 text-xl font-bold">Shipping address</h2>
            <AddrFields v={ship} set={setShip} />
          </section>
        )}
        {hasServices && (
          <section>
            <h2 className="mb-3 text-xl font-bold">Service address</h2>
            {hasProducts && (
              <label className="mb-3 block text-sm">
                <input type="checkbox" checked={same} onChange={(e) => setSame(e.target.checked)} /> Same as
                shipping address
              </label>
            )}
            {(!hasProducts || !same) && <AddrFields v={svcAddr} set={setSvcAddr} />}
            <ul className="mt-3 text-sm text-slate-600">
              {lines
                .filter((l) => l.kind === 'service')
                .map((l) => (
                  <li key={l.refId}>
                    {l.name}:{' '}
                    {l.slotStartUtc ? (
                      new Date(l.slotStartUtc).toLocaleString('en-US')
                    ) : (
                      <Link className="text-red-600 underline" to="/cart">
                        pick a slot
                      </Link>
                    )}
                  </li>
                ))}
            </ul>
          </section>
        )}
        <section className="space-y-3">
          <h2 className="text-xl font-bold">Payment</h2>
          <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
            Mock checkout. The Stripe Payment Element replaces these fields when VITE_STRIPE_PUBLISHABLE_KEY
            is set (Phase 2). Never enter a real card.
          </p>
          <Field label="Card number">
            <input
              className="input"
              inputMode="numeric"
              placeholder="4242 4242 4242 4242"
              value={card.n}
              onChange={(e) => setCard({ ...card, n: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Expiry">
              <input
                className="input"
                placeholder="MM/YY"
                value={card.exp}
                onChange={(e) => setCard({ ...card, exp: e.target.value })}
              />
            </Field>
            <Field label="CVC">
              <input
                className="input"
                value={card.cvc}
                onChange={(e) => setCard({ ...card, cvc: e.target.value })}
              />
            </Field>
          </div>
        </section>
      </div>
      <aside className="card !hover:translate-y-0 h-fit space-y-2">
        <h2 className="text-xl font-bold">Order summary</h2>
        {lines.map((l) => (
          <div key={l.kind + l.refId} className="flex justify-between text-sm">
            <span>
              {l.name} × {l.qty}
            </span>
            <span>{money(l.unitPrice * l.qty)}</span>
          </div>
        ))}
        <hr />
        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span>{q ? money(q.shipping) : '…'}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Tax</span>
          <span>{q ? money(q.tax) : '…'}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>{money(total)}</span>
        </div>
        {err && (
          <p role="alert" className="text-sm text-red-600">
            {err}
          </p>
        )}
        {pay.isError && (
          <p role="alert" className="text-sm text-red-600">
            Payment failed. Try again.
          </p>
        )}
        <button className="btn-cta w-full" disabled={pay.isPending}>
          {pay.isPending ? 'Processing…' : `Pay ${money(total)}`}
        </button>
      </aside>
    </form>
  );
}
