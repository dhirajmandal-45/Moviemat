import { TableSkeleton, EmptyState, ErrorState } from '../shared/Loading';
export default function DataTable({ columns, rows, loading, error, onRetry, emptyTitle, emptyHint, keyField = 'id' }) {
  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  if (loading) return <TableSkeleton cols={columns.length} />;
  if (!rows?.length) return <EmptyState title={emptyTitle || 'No records'} hint={emptyHint || 'Try adjusting your filters.'} />;
  return (
    <div className="overflow-x-auto"><table className="w-full border-collapse">
      <thead><tr className="border-b border-slate-100">{columns.map((c) => <th key={c.key} className="th">{c.header}</th>)}</tr></thead>
      <tbody>{rows.map((row) => (
        <tr key={row[keyField]} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/70">
          {columns.map((c) => <td key={c.key} className="td">{c.render ? c.render(row) : row[c.key]}</td>)}
        </tr>))}</tbody>
    </table></div>
  );
}
