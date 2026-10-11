import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { bookings, catalog, leads, services } from '@/api';
import { brand } from '@/config/brand';
import { getAttribution } from '@/lib/attribution';
import { formatPhone, money } from '@/lib/format';
import { US_STATES, US_ZONES, phoneSchema, zipSchema } from '@/lib/schemas';
import { track } from '@/lib/track';
import { useBooking } from '@/store/booking';
import { Seo } from '@/components/ui/Seo';
import { Field } from '@/components/ui/Field';
import { SlotPicker } from '@/features/booking/SlotPicker';
import { bookingAmounts } from '@/features/booking/pricing';
import { z } from 'zod';

const STEPS = ['Service', 'Device', 'Location', 'Date & time', 'Contact & review'];

export default function Book() {
  const { d, patch, reset } = useBooking();
  const nav = useNavigate();
  const { data: svcs = [] } = useQuery({ queryKey: ['services'], queryFn: services.list });
  const { data: cats = [] } = useQuery({ queryKey: ['categories'], queryFn: catalog.categories });
  const { data: brands = [] } = useQuery({ queryKey: ['brands'], queryFn: catalog.brands });
  const [cat, setCat] = useState('');
  const [err, setErr] = useState<string>('');
  const [outOfArea, setOut] = useState(false);
  const svc = svcs.find((s) => s.id === d.serviceId);
  useEffect(() => {
    track('begin_booking');
  }, []);
  useEffect(() => {
    track('booking_step', { step: d.step });
  }, [d.step]);

  // Abandoned-lead capture (debounced) once step 5 has a valid email or phone.
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    if (d.step !== 5) return;
    const ok = z.string().email().safeParse(d.email).success || phoneSchema.safeParse(d.phone).success;
    if (!ok) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      leads
        .create({
          type: 'booking_abandoned',
          name: d.name,
          email: d.email,
          phone: d.phone,
          serviceId: d.serviceId,
          zip: d.address.zip,
          tcpaConsent: { text: brand.tcpaText, at: new Date().toISOString(), url: location.href },
          attribution: getAttribution(),
        })
        .catch(() => undefined);
    }, 1500);
    return () => clearTimeout(timer.current);
  }, [d.step, d.email, d.phone, d.name, d.serviceId, d.address.zip]);

  const submit = useMutation({
    mutationFn: async () => {
      const a = bookingAmounts(svc!, d.payMode);
      return bookings.create({
        serviceId: d.serviceId!,
        customerName: d.name,
        email: d.email,
        phone: d.phone,
        device: { brand: d.deviceBrand, model: d.deviceModel, issue: d.issue, photos: d.photos },
        address: d.address,
        slotStartUtc: d.slotStartUtc!,
        timezone: d.timezone,
        paymentStatus: a.dueNow >= a.total ? 'paid' : 'deposit',
        amount: a.total,
        deposit: a.deposit,
        attribution: getAttribution(),
      });
    },
    onSuccess: (b) => {
      const id = b.id;
      reset();
      nav(`/order/confirmation/${id}?type=booking`);
    },
  });

  const next = async () => {
    setErr('');
    if (d.step === 1 && !d.serviceId) return setErr('Choose a service.');
    if (d.step === 2 && (!d.deviceBrand || d.issue.trim().length < 5))
      return setErr('Add a brand and a short description of the issue.');
    if (d.step === 3) {
      if (!d.address.street || !d.address.city || !d.address.state) return setErr('Complete the address.');
      if (!zipSchema.safeParse(d.address.zip).success) return setErr('Enter a valid ZIP.');
      const r = await bookings.checkZip(d.address.zip.slice(0, 5));
      if (!r.covered) return setOut(true);
    }
    if (d.step === 4 && !d.slotStartUtc) return setErr('Pick a time slot.');
    patch({ step: d.step + 1 });
  };
  const finish = () => {
    if (
      d.name.length < 2 ||
      !z.string().email().safeParse(d.email).success ||
      !phoneSchema.safeParse(d.phone).success
    )
      return setErr('Enter your name, a valid email and a 10-digit phone.');
    if (!d.tcpa) return setErr('Please accept the consent checkbox.');
    submit.mutate();
  };
  const photos = (files: FileList | null) => {
    if (!files) return;
    const ok = [...files].filter((f) => f.size <= 10 * 1024 * 1024).slice(0, 5);
    if (ok.length < files.length) setErr('Max 5 images, 10 MB each.');
    patch({ photos: ok.map((f) => f.name) });
  };

  if (outOfArea)
    return <OutOfArea zip={d.address.zip} serviceId={d.serviceId} onBack={() => setOut(false)} />;
  const amounts = svc ? bookingAmounts(svc, d.payMode) : null;
  return (
    <div className="container-x section max-w-3xl">
      <Seo title="Book a service" noindex />
      <h1 className="text-3xl font-bold">Book a service</h1>
      <div
        className="mt-4"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={5}
        aria-valuenow={d.step}
        aria-label="Booking progress"
      >
        <div className="h-2 rounded bg-slate-200">
          <div className="h-2 rounded bg-cta transition-all" style={{ width: `${(d.step / 5) * 100}%` }} />
        </div>
        <p className="mt-1 text-sm text-slate-600">
          Step {d.step} of 5: {STEPS[d.step - 1]}
        </p>
      </div>
      <div className="mt-6 space-y-4">
        {d.step === 1 && (
          <>
            <div className="flex flex-wrap gap-2">
              {cats
                .filter((c) => c.type === 'service')
                .map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCat(c.id)}
                    className={`rounded-full border px-4 py-1.5 text-sm ${cat === c.id ? 'border-primary bg-primary text-white' : 'border-slate-300'}`}
                  >
                    {c.name}
                  </button>
                ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {svcs
                .filter((s) => !cat || s.categoryId === cat)
                .map((s) => (
                  <button
                    key={s.id}
                    onClick={() => patch({ serviceId: s.id })}
                    aria-pressed={d.serviceId === s.id}
                    className={`card text-left ${d.serviceId === s.id ? '!border-primary ring-2 ring-primary' : ''}`}
                  >
                    <b>{s.name}</b>
                    <br />
                    <span className="text-sm text-slate-600">
                      Starting at {money(s.priceFrom)} · ~{s.durationMin} min
                    </span>
                  </button>
                ))}
            </div>
          </>
        )}
        {d.step === 2 && (
          <>
            <Field label="Brand">
              <select
                className="input"
                value={d.deviceBrand}
                onChange={(e) => patch({ deviceBrand: e.target.value })}
              >
                <option value="">Select…</option>
                {[...brands.map((b) => b.name), 'Other'].map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </Field>
            <Field label="Model (optional)">
              <input
                className="input"
                value={d.deviceModel}
                onChange={(e) => patch({ deviceModel: e.target.value })}
              />
            </Field>
            <Field label="What do you need done?">
              <textarea
                className="input"
                rows={3}
                value={d.issue}
                onChange={(e) => patch({ issue: e.target.value })}
              />
            </Field>
            <Field label="Photos (optional, up to 5, 10 MB each)">
              <input type="file" accept="image/*" multiple onChange={(e) => photos(e.target.files)} />
            </Field>
          </>
        )}
        {d.step === 3 && (
          <>
            <Field label="Street">
              <input
                className="input"
                autoComplete="address-line1"
                value={d.address.street}
                onChange={(e) => patch({ address: { ...d.address, street: e.target.value } })}
              />
            </Field>
            <Field label="Apt / Suite">
              <input
                className="input"
                value={d.address.unit ?? ''}
                onChange={(e) => patch({ address: { ...d.address, unit: e.target.value } })}
              />
            </Field>
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="City">
                <input
                  className="input"
                  value={d.address.city}
                  onChange={(e) => patch({ address: { ...d.address, city: e.target.value } })}
                />
              </Field>
              <Field label="State">
                <select
                  className="input"
                  value={d.address.state}
                  onChange={(e) => patch({ address: { ...d.address, state: e.target.value } })}
                >
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
                  value={d.address.zip}
                  onChange={(e) => patch({ address: { ...d.address, zip: e.target.value } })}
                />
              </Field>
            </div>
          </>
        )}
        {d.step === 4 && svc && (
          <>
            <Field label="Time zone">
              <select
                className="input max-w-xs"
                value={d.timezone}
                onChange={(e) => patch({ timezone: e.target.value })}
              >
                {!US_ZONES.some(([z2]) => z2 === d.timezone) && (
                  <option value={d.timezone}>{d.timezone}</option>
                )}
                {US_ZONES.map(([z2, n]) => (
                  <option key={z2} value={z2}>
                    {n}
                  </option>
                ))}
              </select>
            </Field>
            <SlotPicker
              serviceId={svc.id}
              tz={d.timezone}
              value={d.slotStartUtc}
              onChange={(utc) => patch({ slotStartUtc: utc })}
            />
          </>
        )}
        {d.step === 5 && svc && amounts && (
          <>
            <Field label="Full name">
              <input
                className="input"
                autoComplete="name"
                value={d.name}
                onChange={(e) => patch({ name: e.target.value })}
              />
            </Field>
            <Field label="Email">
              <input
                className="input"
                type="email"
                autoComplete="email"
                value={d.email}
                onChange={(e) => patch({ email: e.target.value })}
              />
            </Field>
            <Field label="Phone">
              <input
                className="input"
                inputMode="tel"
                autoComplete="tel"
                value={d.phone}
                onChange={(e) => patch({ phone: formatPhone(e.target.value) })}
              />
            </Field>
            {amounts.deposit > 0 && (
              <fieldset className="flex gap-4">
                <legend className="label">Payment</legend>
                {(['deposit', 'full'] as const).map((m) => (
                  <label key={m}>
                    <input type="radio" checked={d.payMode === m} onChange={() => patch({ payMode: m })} />{' '}
                    {m === 'deposit' ? `Pay deposit (${money(amounts.deposit)})` : 'Pay in full'}
                  </label>
                ))}
              </fieldset>
            )}
            <div className="card !hover:translate-y-0">
              <b>{svc.name}</b> —{' '}
              {d.slotStartUtc &&
                new Intl.DateTimeFormat('en-US', {
                  dateStyle: 'short',
                  timeStyle: 'short',
                  timeZone: d.timezone,
                  timeZoneName: 'short',
                }).format(new Date(d.slotStartUtc))}
              <p>
                Total {money(amounts.total)} · Due now {money(amounts.dueNow)}
              </p>
            </div>
            <label className="flex gap-2 text-xs">
              <input type="checkbox" checked={d.tcpa} onChange={(e) => patch({ tcpa: e.target.checked })} />
              {brand.tcpaText}
            </label>
          </>
        )}
      </div>
      {err && (
        <p role="alert" className="mt-4 text-red-600">
          {err}
        </p>
      )}
      <div className="mt-8 flex justify-between">
        <button className="btn-ghost" disabled={d.step === 1} onClick={() => patch({ step: d.step - 1 })}>
          Back
        </button>
        {d.step < 5 ? (
          <button className="btn-cta" onClick={next}>
            Continue
          </button>
        ) : (
          <button className="btn-cta" disabled={submit.isPending} onClick={finish}>
            {submit.isPending ? 'Booking…' : 'Confirm & pay (mock)'}
          </button>
        )}
      </div>
    </div>
  );
}

function OutOfArea({ zip, serviceId, onBack }: { zip: string; serviceId?: string; onBack: () => void }) {
  const [f, setF] = useState({ name: '', email: '', phone: '', ok: false });
  const [done, setDone] = useState(false);
  if (done)
    return (
      <div className="container-x section text-center">
        <h1 className="text-2xl font-bold">Thanks, we&apos;ll let you know when we reach {zip}.</h1>
      </div>
    );
  return (
    <div className="container-x section max-w-md space-y-3">
      <h1 className="text-2xl font-bold">We&apos;re not in your area yet</h1>
      <p>Leave your details and we&apos;ll notify you.</p>
      <Field label="Name">
        <input className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
      </Field>
      <Field label="Email">
        <input
          className="input"
          type="email"
          value={f.email}
          onChange={(e) => setF({ ...f, email: e.target.value })}
        />
      </Field>
      <Field label="Phone">
        <input
          className="input"
          value={f.phone}
          onChange={(e) => setF({ ...f, phone: formatPhone(e.target.value) })}
        />
      </Field>
      <label className="flex gap-2 text-xs">
        <input type="checkbox" checked={f.ok} onChange={(e) => setF({ ...f, ok: e.target.checked })} />
        {brand.tcpaText}
      </label>
      <div className="flex gap-2">
        <button className="btn-ghost" onClick={onBack}>
          Back
        </button>
        <button
          className="btn-cta"
          disabled={
            !f.ok ||
            !f.name ||
            !z.string().email().safeParse(f.email).success ||
            !phoneSchema.safeParse(f.phone).success
          }
          onClick={async () => {
            await leads.create({
              type: 'out_of_area',
              ...f,
              zip,
              serviceId,
              tcpaConsent: { text: brand.tcpaText, at: new Date().toISOString(), url: location.href },
              attribution: getAttribution(),
            });
            setDone(true);
          }}
        >
          Notify me
        </button>
      </div>
    </div>
  );
}
