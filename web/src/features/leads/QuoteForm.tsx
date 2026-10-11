import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { leads, services } from '@/api';
import { brand } from '@/config/brand';
import { getAttribution } from '@/lib/attribution';
import { formatPhone } from '@/lib/format';
import { phoneSchema, zipSchema } from '@/lib/schemas';
import { track } from '@/lib/track';
import { Field } from '@/components/ui/Field';

const schema = z.object({
  name: z.string().min(2, 'Enter your name'),
  phone: phoneSchema,
  email: z.string().email('Enter a valid email'),
  serviceId: z.string().min(1, 'Choose a service'),
  zip: zipSchema,
  message: z.string().optional(),
  tcpa: z.literal(true, { message: 'Consent is required to contact you' }),
});
type V = z.infer<typeof schema>;

export function QuoteForm({
  defaultServiceSlug,
  type = 'quote',
  compact,
}: {
  defaultServiceSlug?: string;
  type?: 'quote' | 'callback';
  compact?: boolean;
}) {
  const { data: list = [] } = useQuery({ queryKey: ['services'], queryFn: services.list });
  const [done, setDone] = useState(false);
  const def = list.find((s) => s.slug === defaultServiceSlug)?.id ?? '';
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<V>({ resolver: zodResolver(schema), values: { serviceId: def } as V });
  const m = useMutation({
    mutationFn: (v: V) =>
      leads.create({
        type,
        name: v.name,
        email: v.email,
        phone: v.phone,
        serviceId: v.serviceId,
        zip: v.zip,
        message: v.message,
        tcpaConsent: { text: brand.tcpaText, at: new Date().toISOString(), url: location.href },
        attribution: getAttribution(),
      }),
    onSuccess: () => {
      track('generate_lead', { lead_type: type });
      setDone(true);
    },
  });
  if (done)
    return (
      <div role="status" className="rounded-xl2 bg-emerald-50 p-6 text-emerald-900">
        <strong>Thanks!</strong> We&apos;ll contact you shortly.
      </div>
    );
  return (
    <form
      onSubmit={handleSubmit(
        (v) => m.mutate(v),
        () => track('quote_form_error'),
      )}
      className="space-y-3 rounded-xl2 bg-white p-5 text-left shadow-2xl"
      noValidate
    >
      <h3 className="text-xl font-bold">{type === 'callback' ? 'Request a callback' : 'Get a free quote'}</h3>
      <Field label="Name" error={errors.name?.message}>
        <input className="input" autoComplete="name" {...register('name')} />
      </Field>
      <div className={compact ? 'space-y-3' : 'grid gap-3 sm:grid-cols-2'}>
        <Field label="Phone" error={errors.phone?.message}>
          <input
            className="input"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(555) 555-5555"
            {...register('phone', { onChange: (e) => setValue('phone', formatPhone(e.target.value)) })}
          />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input className="input" type="email" autoComplete="email" {...register('email')} />
        </Field>
      </div>
      <div className={compact ? 'space-y-3' : 'grid gap-3 sm:grid-cols-2'}>
        <Field label="Service" error={errors.serviceId?.message}>
          <select className="input" {...register('serviceId')}>
            <option value="">Select…</option>
            {list.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="ZIP" error={errors.zip?.message}>
          <input className="input" inputMode="numeric" autoComplete="postal-code" {...register('zip')} />
        </Field>
      </div>
      <Field label="Message (optional)">
        <textarea className="input" rows={2} {...register('message')} />
      </Field>
      <label className="flex items-start gap-2 text-xs text-slate-600">
        <input type="checkbox" className="mt-0.5" {...register('tcpa')} /> <span>{brand.tcpaText}</span>
      </label>
      {errors.tcpa && (
        <p role="alert" className="text-sm text-red-600">
          {errors.tcpa.message}
        </p>
      )}
      {m.isError && (
        <p role="alert" className="text-sm text-red-600">
          Something went wrong. Please try again.
        </p>
      )}
      <button className="btn-cta w-full" disabled={m.isPending}>
        {m.isPending ? 'Sending…' : 'Get my free quote'}
      </button>
    </form>
  );
}
