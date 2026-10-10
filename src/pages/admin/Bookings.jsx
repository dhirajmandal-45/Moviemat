import { useState } from 'react';
import toast from 'react-hot-toast';
import useFetch from '../../hooks/useFetch';
import useDebounce from '../../hooks/useDebounce';
import { adminBookingApi } from '../../services/bookingApi';
import DataTable from '../../components/admin/DataTable';
import SearchInput from '../../components/admin/SearchInput';
import Badge from '../../components/admin/Badge';
import { money, fmtDateShort } from '../../utils/format';
import { BOOKING_STATUS } from '../../constants';
export default function Bookings() {
  const [q, setQ] = useState(''); const dq = useDebounce(q); const [status, setStatus] = useState('');
  const { data, loading, error, reload } = useFetch(() => adminBookingApi.list({ q: dq, status }), [dq, status]);
  const cancel = async (b) => { try { await adminBookingApi.update(b.id, { status: 'CANCELLED' }); toast.success(`Booking ${b.reference} cancelled — seats released`); reload(); } catch (err) { toast.error(err?.response?.data?.message || 'Could not cancel booking'); } };
  const columns = [
    { key: 'id', header: 'Booking ID', render: (b) => <span className="font-mono text-xs font-semibold">{b.reference}</span> },
    { key: 'movie', header: 'Movie', render: (b) => <div><p className="font-semibold">{b.movieTitle || b.movie?.title || b.movie}</p><p className="text-xs text-slate-500">{b.theatreName || b.theatre?.name || b.theatre}</p></div> },
    { key: 'user', header: 'Customer', render: (b) => <div><p>{b.customerName || b.user}</p><p className="text-xs text-slate-500">{b.customerEmail || b.email}</p></div> },
    { key: 'date', header: 'Show', render: (b) => <span>{fmtDateShort(b.date)} · {b.time}</span> },
    { key: 'seats', header: 'Seats', render: (b) => b.seats.join(', ') },
    { key: 'amount', header: 'Amount', render: (b) => money(b.amount) },
    { key: 'status', header: 'Status', render: (b) => <Badge status={b.status} /> },
    { key: 'actions', header: '', render: (b) => (b.status === 'CONFIRMED' || b.status === 'PENDING') ? <button className="text-xs font-semibold text-danger hover:underline" onClick={() => cancel(b)}>Cancel</button> : null },
  ];
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3"><SearchInput value={q} onChange={setQ} placeholder="Search by reference, movie, theatre or customer" />
        <select className="input w-auto !py-2" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All status</option>{BOOKING_STATUS.map((s) => <option key={s} value={s}>{s}</option>)}</select></div>
      <div className="card"><DataTable columns={columns} rows={data} loading={loading} error={error} onRetry={reload} emptyTitle="No bookings found" emptyHint="Try a different search or status filter." /></div>
    </div>
  );
}
