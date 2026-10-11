import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { catalog, products } from '@/api';
import { Seo } from '@/components/ui/Seo';
import { ProductCard } from '@/components/ui/ProductCard';

export default function Shop() {
  const [sp, setSp] = useSearchParams();
  const get = (k: string) => sp.get(k) ?? '';
  const set = (k: string, v: string) => {
    const n = new URLSearchParams(sp);
    if (v) n.set(k, v);
    else n.delete(k);
    if (k !== 'page') n.delete('page');
    setSp(n);
  };
  const page = Number(get('page') || 1);
  const params = Object.fromEntries([...sp.entries()]);
  const { data, isLoading } = useQuery({
    queryKey: ['products', params],
    queryFn: () => products.list({ ...params, pageSize: 12, page }),
  });
  const { data: cats = [] } = useQuery({ queryKey: ['categories'], queryFn: catalog.categories });
  const { data: brands = [] } = useQuery({ queryKey: ['brands'], queryFn: catalog.brands });
  const list = get('view') === 'list';
  const pages = data ? Math.ceil(data.total / data.pageSize) : 1;
  const sel = 'input !w-auto';
  return (
    <div className="container-x section">
      <Seo title="Shop appliances" description="Home appliances with optional professional installation." />
      <h1 className="text-4xl font-bold">Shop appliances</h1>
      <div className="mt-6 flex flex-wrap items-end gap-3">
        <select
          aria-label="Category"
          className={sel}
          value={get('category')}
          onChange={(e) => set('category', e.target.value)}
        >
          <option value="">All categories</option>
          {cats
            .filter((c) => c.type === 'product')
            .map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
        </select>
        <select
          aria-label="Brand"
          className={sel}
          value={get('brand')}
          onChange={(e) => set('brand', e.target.value)}
        >
          <option value="">All brands</option>
          {brands.slice(2).map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
        <select
          aria-label="Max price"
          className={sel}
          value={get('maxPrice')}
          onChange={(e) => set('maxPrice', e.target.value)}
        >
          <option value="">Any price</option>
          {[100000, 200000, 400000].map((p) => (
            <option key={p} value={p}>
              Up to ${p / 100}
            </option>
          ))}
        </select>
        <select
          aria-label="Rating"
          className={sel}
          value={get('minRating')}
          onChange={(e) => set('minRating', e.target.value)}
        >
          <option value="">Any rating</option>
          <option value="4">4★ &amp; up</option>
        </select>
        <label className="flex items-center gap-1 text-sm">
          <input
            type="checkbox"
            checked={get('inStock') === '1'}
            onChange={(e) => set('inStock', e.target.checked ? '1' : '')}
          />{' '}
          In stock
        </label>
        <select
          aria-label="Sort"
          className={`${sel} ml-auto`}
          value={get('sort')}
          onChange={(e) => set('sort', e.target.value)}
        >
          <option value="">Popular</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
        </select>
        <button className="btn-ghost !px-3 !py-2" onClick={() => set('view', list ? '' : 'list')}>
          {list ? 'Grid' : 'List'}
        </button>
      </div>
      {isLoading ? (
        <p className="mt-8">Loading…</p>
      ) : (
        <div className={`mt-8 grid gap-4 ${list ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-4'}`}>
          {data?.data.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      )}
      {data && data.total === 0 && <p className="mt-8">No products match those filters.</p>}
      <nav className="mt-10 flex justify-center gap-2" aria-label="Pagination">
        {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            aria-current={n === page}
            onClick={() => set('page', String(n))}
            className={`h-10 w-10 rounded-lg border ${n === page ? 'bg-primary text-white' : ''}`}
          >
            {n}
          </button>
        ))}
      </nav>
    </div>
  );
}
