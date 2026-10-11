import { useState } from 'react';
import { Link } from 'react-router-dom';
import { fmtDateTime, money } from '@/lib/format';
import { useCart } from '@/store/cart';
import { Seo } from '@/components/ui/Seo';
import { SlotPicker } from '@/features/booking/SlotPicker';
import { discount, subtotal } from '@/features/cart/totals';
import { useCartQuote } from '@/features/cart/useCartQuote';

export default function Cart() {
  const { lines, promo, setQty, remove, setPromo, setSlot } = useCart();
  const [code, setCode] = useState(promo);
  const [editing, setEditing] = useState('');
  const sub = subtotal(lines);
  const disc = discount(sub, promo);
  const q = useCartQuote(sub - disc, lines);
  const prods = lines.filter((l) => l.kind === 'product'),
    svcs = lines.filter((l) => l.kind === 'service');
  if (!lines.length)
    return (
      <div className="container-x section text-center">
        <Seo title="Cart" noindex />
        <h1 className="text-3xl font-bold">Your cart is empty</h1>
        <Link to="/shop" className="btn-cta mt-6">
          Shop appliances
        </Link>
      </div>
    );
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return (
    <div className="container-x section grid gap-10 lg:grid-cols-[1fr_340px]">
      <Seo title="Cart" noindex />
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Cart</h1>
        {prods.length > 0 && (
          <section>
            <h2 className="mb-2 text-xl font-bold">Products</h2>
            {prods.map((l) => (
              <div key={l.refId} className="flex items-center gap-4 border-b py-3">
                <span className="flex-1 font-medium">{l.name}</span>
                <input
                  aria-label="Quantity"
                  type="number"
                  min={1}
                  className="input !w-20"
                  value={l.qty}
                  onChange={(e) => setQty(l.refId, 'product', Number(e.target.value))}
                />
                <span className="w-24 text-right">{money(l.unitPrice * l.qty)}</span>
                <button className="text-sm text-red-600" onClick={() => remove(l.refId, 'product')}>
                  Remove
                </button>
              </div>
            ))}
          </section>
        )}
        {svcs.length > 0 && (
          <section>
            <h2 className="mb-2 text-xl font-bold">Services</h2>
            {svcs.map((l) => (
              <div key={l.refId} className="border-b py-3">
                <div className="flex items-center gap-4">
                  <span className="flex-1 font-medium">
                    {l.name}
                    <span className="block text-sm text-slate-500">
                      {l.slotStartUtc ? fmtDateTime(l.slotStartUtc, tz) : 'Pick a time before checkout'}
                    </span>
                  </span>
                  <span className="w-24 text-right">{money(l.unitPrice)}</span>
                  <button
                    className="text-sm text-primary"
                    onClick={() => setEditing(editing === l.refId ? '' : l.refId)}
                  >
                    Change slot
                  </button>
                  <button className="text-sm text-red-600" onClick={() => remove(l.refId, 'service')}>
                    Remove
                  </button>
                </div>
                {editing === l.refId && (
                  <div className="mt-3">
                    <SlotPicker
                      serviceId={l.refId}
                      tz={tz}
                      value={l.slotStartUtc}
                      onChange={(u) => setSlot(l.refId, u)}
                    />
                  </div>
                )}
              </div>
            ))}
          </section>
        )}
      </div>
      <aside className="card !hover:translate-y-0 h-fit space-y-2">
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setPromo(code);
          }}
        >
          <input
            className="input"
            placeholder="Promo code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            aria-label="Promo code"
          />
          <button className="btn-ghost !px-3">Apply</button>
        </form>
        {promo && disc === 0 && <p className="text-sm text-red-600">Invalid code.</p>}
        <Row k="Subtotal" v={money(sub)} />
        {disc > 0 && <Row k="Discount" v={`-${money(disc)}`} />}
        <Row k="Shipping" v={q ? money(q.shipping) : '…'} />
        <Row k="Estimated tax" v={q ? money(q.tax) : '…'} />
        <Row k={<b>Total</b>} v={<b>{money(sub - disc + (q?.shipping ?? 0) + (q?.tax ?? 0))}</b>} />
        <Link to="/checkout" className="btn-cta mt-3 w-full">
          Checkout
        </Link>
      </aside>
    </div>
  );
}
const Row = ({ k, v }: { k: React.ReactNode; v: React.ReactNode }) => (
  <div className="flex justify-between text-sm">
    <span>{k}</span>
    <span>{v}</span>
  </div>
);
