export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-slate-200 rounded-xl2 border border-slate-200">
      {items.map((i) => (
        <details key={i.q} className="group p-5">
          <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-ink">
            {i.q}
            <span className="transition group-open:rotate-45" aria-hidden>
              +
            </span>
          </summary>
          <p className="mt-3 text-slate-600">{i.a}</p>
        </details>
      ))}
    </div>
  );
}
