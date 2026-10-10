import { fmtDate, money } from '../../utils/format';
import { Poster } from './MovieCard';
export default function Ticket({ b }) {
  const f = (k, v) => <div><p className="text-[11px] text-slate-500">{k}</p><p className="text-sm font-semibold">{v}</p></div>;
  return (
    <div className="card mx-auto flex max-w-2xl flex-col overflow-hidden sm:flex-row">
      <div className="flex gap-4 p-5 sm:flex-1"><Poster movie={b.movie} className="w-24 shrink-0" />
        <div className="grid flex-1 grid-cols-2 gap-3"><div className="col-span-2"><p className="text-lg font-extrabold">{b.movie.title}</p><p className="text-xs text-slate-500">{[b.theatre.name, b.theatre.area, b.theatre.city].filter(Boolean).join(', ')}</p></div>
          {f('Date', fmtDate(b.date))}{f('Time', b.time)}{f('Seats', b.seats.join(', '))}{f('Amount', money(b.amount))}</div></div>
      <div className="flex flex-col items-center justify-center gap-2 border-t border-dashed border-slate-300 bg-brand-soft p-5 sm:border-l sm:border-t-0">
        <div className="grid h-20 w-20 grid-cols-5 gap-0.5" aria-hidden>{[...String(b.reference || b.id).repeat(5)].slice(0, 25).map((c, i) => <i key={i} className={c.charCodeAt(0) % 2 ? 'bg-ink' : 'bg-transparent'} />)}</div>
        <p className="text-[11px] text-slate-500">Booking ID</p><p className="font-mono text-xs font-bold">{b.reference || b.id}</p></div>
    </div>
  );
}
