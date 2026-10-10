import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import useFetch from '../../hooks/useFetch';
import { showApi } from '../../services/showApi';
import Seat from '../../components/site/Seat';
import { Spinner, ErrorState } from '../../components/shared/Loading';
import { useBooking } from '../../context/BookingContext';
import { calcPricing, fmtDate, money, seatLabel } from '../../utils/format';
export default function SeatSelection() {
  const { showId } = useParams(); const nav = useNavigate(); const { setDraft } = useBooking(); const [sel, setSel] = useState([]);
  const { data: show, loading: l1, error: e1 } = useFetch(() => showApi.get(showId), [showId]);
  const { data: seats, loading: l2, error: e2, reload } = useFetch(() => showApi.seats(showId), [showId]);
  if (l1 || l2) return <Spinner />; if (e1 || e2) return <ErrorState message={e1 || e2} onRetry={reload} />;
  const toggle = (s) => setSel((c) => c.some((x) => x.id === s.id) ? c.filter((x) => x.id !== s.id) : c.length >= 8 ? (toast.error('You can book up to 8 seats'), c) : [...c, s]);
  const p = calcPricing(sel); const rows = [...new Set(seats.map((s) => s.row))];
  const go = () => { setDraft({ showId, show, seats: sel }); nav('/booking/summary'); };
  return (
    <div className="wrap py-6 pb-40 md:pb-28">
      <h1 className="text-xl font-bold">{show.movie.title}</h1><p className="text-sm text-slate-500">{[show.theatre.name, show.theatre.area].filter(Boolean).join(', ')} · {fmtDate(show.date)} · {show.time}</p>
      {!seats.length && <p className="card mt-5 p-5 text-sm text-slate-500">This screen has no seats configured yet.</p>}
      <div className="card mt-5 overflow-x-auto p-5"><div className="mx-auto w-fit">
        <div className="mx-auto mb-8 h-2 w-64 rounded-full bg-gradient-to-r from-transparent via-brand to-transparent sm:w-80"><p className="pt-3 text-center text-[10px] tracking-widest text-slate-400">SCREEN</p></div>
        {rows.map((r) => <div key={r} className="mb-2 flex items-center gap-2"><span className="w-4 text-xs font-semibold text-slate-400">{r}</span>{seats.filter((s) => s.row === r).map((s) => <Seat key={s.id} seat={s} selected={sel.some((x) => x.id === s.id)} onToggle={toggle} />)}</div>)}
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-slate-600">
          {[['border-emerald-500', 'Available'], ['bg-brand border-brand', 'Selected'], ['bg-slate-200 border-slate-200', 'Sold'], ['border-gold bg-gold/20', 'Premium'], ['border-violet-400 bg-violet-100', 'Recliner']].map(([c, l]) => <span key={l} className="flex items-center gap-1.5"><i className={`inline-block h-4 w-4 rounded border ${c}`} />{l}</span>)}</div></div></div>
      <div className="fixed inset-x-0 bottom-14 z-30 border-t border-slate-100 bg-white p-3 shadow-[0_-4px_20px_rgba(0,0,0,.06)] md:bottom-0">
        <div className="wrap flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <div><p className="text-xs text-slate-500">Selected Seats</p><p className="font-semibold">{sel.length ? sel.map((s) => seatLabel(s)).join(', ') : 'None'}</p></div>
          <div className="hidden sm:block"><p className="text-xs text-slate-500">Ticket Price</p><p className="font-semibold">{money(p.ticket)}</p></div>
          <div className="hidden sm:block"><p className="text-xs text-slate-500">Convenience Fee</p><p className="font-semibold">{money(p.fee)}</p></div>
          <div><p className="text-xs text-slate-500">Total Amount</p><p className="font-bold text-brand">{money(p.total)}</p></div>
          <button className="btn-primary ml-auto" disabled={!sel.length} onClick={go}>Continue</button></div></div>
    </div>
  );
}
