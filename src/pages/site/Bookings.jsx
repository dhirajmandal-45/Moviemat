import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useFetch from '../../hooks/useFetch';
import { bookingApi } from '../../services/bookingApi';
import { useBooking } from '../../context/BookingContext';
import { Poster } from '../../components/site/MovieCard';
import { Spinner, ErrorState, EmptyState } from '../../components/shared/Loading';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { fmtDate, money } from '../../utils/format';

const STATUS_CLS = {
  CONFIRMED: 'bg-emerald-100 text-emerald-700',
  COMPLETED: 'bg-slate-100 text-slate-600',
  PENDING: 'bg-amber-100 text-amber-700',
  CANCELLED: 'bg-red-100 text-red-600',
  FAILED: 'bg-red-100 text-red-600',
};

export default function Bookings() {
  const { data, loading, error, reload } = useFetch(() => bookingApi.mine(), []);
  const { setBooking } = useBooking(); const nav = useNavigate();
  const [target, setTarget] = useState(null);

  const cancel = async () => {
    try { await bookingApi.cancel(target.id); toast.success('Booking cancelled'); reload(); }
    catch (err) { toast.error(err?.response?.data?.message || 'Could not cancel the booking'); }
    finally { setTarget(null); }
  };
  const upcoming = (b) => b.date && new Date(`${String(b.date).slice(0, 10)}T23:59:59`) >= new Date();

  if (loading) return <Spinner />; if (error) return <ErrorState message={error} onRetry={reload} />;
  return (
    <div className="wrap max-w-3xl py-8"><h1 className="mb-4 text-2xl font-bold">My bookings</h1>
      {!data.length ? <EmptyState title="No bookings yet" hint="Book a movie and your tickets will show up here." /> : <div className="space-y-4">{data.map((b) => (
        <article key={b.id} className="card flex gap-4 p-4"><Poster movie={b.movie} className="w-20 shrink-0" />
          <div className="flex-1 text-sm"><div className="flex items-start justify-between gap-2"><h2 className="font-bold">{b.movie.title}</h2><span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS_CLS[b.status] || 'bg-slate-100 text-slate-600'}`}>{b.status}</span></div>
            <p className="text-slate-500">{[b.theatre.name, b.theatre.area].filter(Boolean).join(', ')}</p><p>{fmtDate(b.date)} · {b.time}</p><p>Seats: {b.seats.join(', ')}</p>
            <p className="text-xs text-slate-500">Ref {b.reference} · {money(b.amount)}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button className="btn-ghost !py-1" onClick={() => { setBooking(b); nav('/booking-success'); }}>View Ticket</button>
              {(b.status === 'CONFIRMED' || b.status === 'PENDING') && upcoming(b) && <button className="btn-ghost !py-1 !text-danger" onClick={() => setTarget(b)}>Cancel booking</button>}
            </div></div></article>))}</div>}
      <ConfirmDialog open={!!target} title="Cancel this booking?" body={target ? `Your seats for ${target.movie.title} will be released.` : ''} confirmLabel="Cancel booking" onConfirm={cancel} onClose={() => setTarget(null)} />
    </div>
  );
}
