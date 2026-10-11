import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type RowSelectionState,
} from '@tanstack/react-table';
import { useState } from 'react';

export function DataTable<T>({
  data,
  columns,
  bulk,
}: {
  data: T[];
  columns: ColumnDef<T>[];
  bulk?: { label: string; run: (rows: T[]) => void }[];
}) {
  const [filter, setFilter] = useState('');
  const [sel, setSel] = useState<RowSelectionState>({});
  // eslint-disable-next-line react-hooks/incompatible-library
  const t = useReactTable({
    data,
    columns,
    state: { globalFilter: filter, rowSelection: sel },
    onGlobalFilterChange: setFilter,
    onRowSelectionChange: setSel,
    enableRowSelection: !!bulk,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });
  const selected = t.getSelectedRowModel().rows.map((r) => r.original);
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <input
          className="input max-w-xs"
          placeholder="Search…"
          aria-label="Search table"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        {bulk?.map((b) => (
          <button
            key={b.label}
            className="btn-ghost !px-3 !py-2"
            disabled={!selected.length}
            onClick={() => {
              b.run(selected);
              setSel({});
            }}
          >
            {b.label} ({selected.length})
          </button>
        ))}
      </div>
      <div className="overflow-x-auto rounded-xl2 border">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left">
            {t.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {bulk && (
                  <th className="p-2">
                    <input
                      type="checkbox"
                      aria-label="Select all"
                      checked={t.getIsAllPageRowsSelected()}
                      onChange={t.getToggleAllPageRowsSelectedHandler()}
                    />
                  </th>
                )}
                {hg.headers.map((h) => (
                  <th
                    key={h.id}
                    className="cursor-pointer select-none p-2"
                    onClick={h.column.getToggleSortingHandler()}
                  >
                    {flexRender(h.column.columnDef.header, h.getContext())}
                    {{ asc: ' ▲', desc: ' ▼' }[h.column.getIsSorted() as string] ?? ''}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {t.getRowModel().rows.map((r) => (
              <tr key={r.id} className="border-t">
                {bulk && (
                  <td className="p-2">
                    <input
                      type="checkbox"
                      aria-label="Select row"
                      checked={r.getIsSelected()}
                      onChange={r.getToggleSelectedHandler()}
                    />
                  </td>
                )}
                {r.getVisibleCells().map((c) => (
                  <td key={c.id} className="p-2">
                    {flexRender(c.column.columnDef.cell, c.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex items-center gap-2 text-sm">
        <button
          className="btn-ghost !px-3 !py-1"
          disabled={!t.getCanPreviousPage()}
          onClick={() => t.previousPage()}
        >
          Prev
        </button>
        <span>
          Page {t.getState().pagination.pageIndex + 1} of {Math.max(1, t.getPageCount())}
        </span>
        <button className="btn-ghost !px-3 !py-1" disabled={!t.getCanNextPage()} onClick={() => t.nextPage()}>
          Next
        </button>
      </div>
    </div>
  );
}
