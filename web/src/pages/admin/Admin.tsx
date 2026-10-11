import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import { admin, catalog, products, services } from '@/api';
import { brand } from '@/config/brand';
import { landingPages } from '@/config/landingPages';
import { support } from '@/config/support';
import { fmtDateTime, money } from '@/lib/format';
import { useAuth } from '@/store/auth';
import type { Booking, Lead, Order } from '@/types';
import { Seo } from '@/components/ui/Seo';
import { DataTable } from '@/features/admin/DataTable';
import { downloadCsv } from '@/features/admin/csv';

const NAV = [
  'dashboard',
  'leads',
  'bookings',
  'services',
  'products',
  'categories',
  'availability',
  'service-areas',
  'technicians',
  'orders',
  'reviews',
  'landing-pages',
  'settings',
];
const LEAD_STATUSES = ['New', 'Contacted', 'Quoted', 'Booked', 'Lost'] as const;

export default function Admin() {
  const user = useAuth((s) => s.user);
  if (!user || (user.role !== 'admin' && user.role !== 'staff')) return <Navigate to="/login" replace />;
  return (
    <div className="container-x grid gap-6 py-8 lg:grid-cols-[200px_1fr]">
      <Seo title="Admin" noindex />
      <nav aria-label="Admin" className="flex gap-2 overflow-x-auto lg:flex-col">
        {NAV.map((n) => (
          <NavLink
            key={n}
            to={`/admin/${n}`}
            className={({ isActive }) =>
              `whitespace-nowrap rounded-lg px-3 py-2 capitalize ${isActive ? 'bg-primary text-white' : 'hover:bg-slate-100'}`
            }
          >
            {n.replace('-', ' ')}
          </NavLink>
        ))}
      </nav>
      <div className="min-w-0">
        <Routes>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="leads" element={<Leads />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="orders" element={<Orders />} />
          <Route path="services" element={<ServicesAdmin />} />
          <Route path="products" element={<ProductsAdmin />} />
          <Route path="categories" element={<Categories />} />
          <Route path="landing-pages" element={<Landing />} />
          <Route path="settings" element={<Settings />} />
          <Route
            path="*"
            element={<Pending name={user.role === 'admin' ? 'This module' : 'This module'} />}
          />
        </Routes>
      </div>
    </div>
  );
}

const Pending = ({ name }: { name: string }) => (
  <div>
    <h1 className="text-2xl font-bold">Module</h1>
    <p className="mt-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
      {name} is wired to the API contract but its editor UI is not built in this pass (availability, service
      areas, technicians, reviews).
    </p>
  </div>
);

function Dashboard() {
  const { data: l } = useQuery({ queryKey: ['admin', 'leads'], queryFn: () => admin.leads(1) });
  const { data: b } = useQuery({ queryKey: ['admin', 'bookings'], queryFn: admin.bookings });
  const bySource: Record<string, number> = {};
  l?.data.forEach((x) => {
    const s = x.attribution?.utmSource ?? 'direct';
    bySource[s] = (bySource[s] ?? 0) + 1;
  });
  const max = Math.max(1, ...Object.values(bySource));
  const today = new Date().toDateString();
  const booked = l?.data.filter((x) => x.status === 'Booked').length ?? 0;
  const kpi = [
    [
      "Today's bookings",
      b?.data.filter((x) => new Date(x.slotStartUtc).toDateString() === today).length ?? 0,
    ],
    ['Total leads', l?.total ?? 0],
    ['Revenue (bookings)', money(b?.data.reduce((s, x) => s + x.deposit, 0) ?? 0)],
    ['Conversion', l?.total ? `${Math.round((booked / l.total) * 100)}%` : '0%'],
  ];
  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="mt-4 grid gap-4 sm:grid-cols-4">
        {kpi.map(([k, v]) => (
          <div key={k} className="card !hover:translate-y-0">
            <p className="text-sm text-slate-500">{k}</p>
            <p className="text-2xl font-bold">{v}</p>
          </div>
        ))}
      </div>
      <h2 className="mt-8 text-lg font-bold">Leads by source</h2>
      <div className="mt-3 space-y-2">
        {Object.entries(bySource).map(([s, n]) => (
          <div key={s} className="flex items-center gap-3">
            <span className="w-24 text-sm">{s}</span>
            <div className="h-5 rounded bg-primary" style={{ width: `${(n / max) * 70}%` }} />
            <span className="text-sm">{n}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Leads() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ['admin', 'leads'], queryFn: () => admin.leads(1) });
  const upd = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Lead['status'] }) => admin.updateLead(id, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'leads'] }),
  });
  const cols: ColumnDef<Lead>[] = [
    { header: 'Created', accessorKey: 'createdAt', cell: (c) => fmtDateTime(c.getValue<string>()) },
    { header: 'Type', accessorKey: 'type' },
    { header: 'Name', accessorKey: 'name' },
    { header: 'Phone', accessorKey: 'phone' },
    { header: 'Email', accessorKey: 'email' },
    { header: 'ZIP', accessorKey: 'zip' },
    { header: 'Source', accessorFn: (r) => r.attribution?.utmSource ?? 'direct' },
    { header: 'Campaign', accessorFn: (r) => r.attribution?.utmCampaign ?? '' },
    { header: 'gclid', accessorFn: (r) => r.attribution?.gclid ?? '' },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (c) => (
        <select
          aria-label="Lead status"
          className="input !py-1"
          value={c.row.original.status}
          onChange={(e) => upd.mutate({ id: c.row.original.id, status: e.target.value as Lead['status'] })}
        >
          {LEAD_STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      ),
    },
  ];
  const flat = (rows: Lead[]) =>
    rows.map((l) => ({
      id: l.id,
      type: l.type,
      name: l.name,
      email: l.email,
      phone: l.phone,
      zip: l.zip,
      status: l.status,
      utm_source: l.attribution?.utmSource,
      utm_medium: l.attribution?.utmMedium,
      utm_campaign: l.attribution?.utmCampaign,
      utm_term: l.attribution?.utmTerm,
      utm_content: l.attribution?.utmContent,
      gclid: l.attribution?.gclid,
      fbclid: l.attribution?.fbclid,
      landing_page: l.attribution?.landingPage,
      tcpa_text: l.tcpaConsent.text,
      tcpa_at: l.tcpaConsent.at,
      tcpa_url: l.tcpaConsent.url,
      created_at: l.createdAt,
    }));
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Leads</h1>
        <button
          className="btn-primary !py-2"
          onClick={() => data && downloadCsv('leads.csv', flat(data.data))}
        >
          Export CSV
        </button>
      </div>
      <div className="mt-4">
        {data && (
          <DataTable
            data={data.data}
            columns={cols}
            bulk={[
              { label: 'Export selected', run: (r) => downloadCsv('leads-selected.csv', flat(r)) },
              {
                label: 'Mark contacted',
                run: (r) => r.forEach((l) => upd.mutate({ id: l.id, status: 'Contacted' })),
              },
            ]}
          />
        )}
      </div>
    </div>
  );
}

function Bookings() {
  const { data } = useQuery({ queryKey: ['admin', 'bookings'], queryFn: admin.bookings });
  const cols: ColumnDef<Booking>[] = [
    { header: 'ID', accessorKey: 'id' },
    { header: 'Customer', accessorKey: 'customerName' },
    {
      header: 'When',
      accessorKey: 'slotStartUtc',
      cell: (c) => fmtDateTime(c.getValue<string>(), c.row.original.timezone),
    },
    { header: 'Status', accessorKey: 'status' },
    { header: 'Amount', accessorKey: 'amount', cell: (c) => money(c.getValue<number>()) },
    { header: 'City', accessorFn: (r) => r.address.city },
  ];
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Bookings</h1>
      {data && <DataTable data={data.data} columns={cols} />}
    </div>
  );
}
function Orders() {
  const { data } = useQuery({ queryKey: ['admin', 'orders'], queryFn: admin.orders });
  const cols: ColumnDef<Order>[] = [
    { header: 'ID', accessorKey: 'id' },
    { header: 'Email', accessorKey: 'customerEmail' },
    { header: 'Total', accessorKey: 'total', cell: (c) => money(c.getValue<number>()) },
    { header: 'Status', accessorKey: 'status' },
  ];
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Orders</h1>
      {data && <DataTable data={data.data} columns={cols} />}
    </div>
  );
}
function ServicesAdmin() {
  const { data = [] } = useQuery({ queryKey: ['services'], queryFn: services.list });
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Services</h1>
      <DataTable
        data={data}
        columns={[
          { header: 'Name', accessorKey: 'name' },
          { header: 'Price from', accessorKey: 'priceFrom', cell: (c) => money(c.getValue<number>()) },
          { header: 'Deposit', accessorKey: 'depositType' },
          { header: 'Min', accessorKey: 'durationMin' },
        ]}
      />
    </div>
  );
}
function ProductsAdmin() {
  const { data } = useQuery({
    queryKey: ['products', 'admin'],
    queryFn: () => products.list({ pageSize: 100 }),
  });
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Products</h1>
      {data && (
        <DataTable
          data={data.data}
          columns={[
            { header: 'SKU', accessorKey: 'sku' },
            { header: 'Name', accessorKey: 'name' },
            { header: 'Price', accessorKey: 'price', cell: (c) => money(c.getValue<number>()) },
            { header: 'Stock', accessorKey: 'stock' },
          ]}
        />
      )}
    </div>
  );
}
function Categories() {
  const { data = [] } = useQuery({ queryKey: ['categories'], queryFn: catalog.categories });
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Categories</h1>
      <DataTable
        data={data}
        columns={[
          { header: 'Name', accessorKey: 'name' },
          { header: 'Type', accessorKey: 'type' },
          { header: 'Order', accessorKey: 'order' },
        ]}
      />
    </div>
  );
}
const Landing = () => (
  <div>
    <h1 className="text-2xl font-bold">Landing pages</h1>
    <p className="mt-2 text-sm text-slate-600">
      Edit <code>src/config/landingPages.ts</code> to add pages (no new code needed).
    </p>
    <ul className="mt-4 list-disc pl-5">
      {landingPages.map((l) => (
        <li key={l.slug}>
          <a className="underline" href={`/lp/${l.slug}`}>
            /lp/{l.slug}
          </a>{' '}
          — {l.headline}
        </li>
      ))}
    </ul>
  </div>
);
const Settings = () => (
  <div>
    <h1 className="text-2xl font-bold">Settings (read-only in Phase 1)</h1>
    <p className="mt-2 text-sm text-slate-600">
      Change in <code>src/config/*</code> or <code>.env</code>.
    </p>
    <dl className="mt-4 grid max-w-xl grid-cols-2 gap-2 text-sm">
      {[
        ['Brand name', brand.name],
        ['Phone', brand.supportPhone],
        ['Support hours', `${support.open}–${support.close} ET`],
        ['Chat script ID', brand.chatScriptId || '(empty)'],
        ['GTM ID', brand.gtmId || '(empty)'],
      ].map(([k, v]) => (
        <>
          <dt key={k} className="font-medium">
            {k}
          </dt>
          <dd key={k + 'v'}>{v}</dd>
        </>
      ))}
    </dl>
  </div>
);
