import { fmtDate, money, seatLabel } from '../../utils/format';
export function Row({ k, v, bold }) { return <div className={`flex justify-between gap-4 py-1.5 text-sm ${bold ? 'border-t border-slate-100 pt-3 text-base font-bold' : ''}`}><span className="text-slate-500">{k}</span><span className="text-right font-medium">{v}</span></div>; }
export default function Summary({ draft, p }) {
  const { show, seats } = draft;
  return (<div className="card p-5"><h2 className="mb-2 font-bold">Order summary</h2>
    <Row k="Movie" v={show.movie.title} /><Row k="Theatre" v={[show.theatre.name, show.theatre.area].filter(Boolean).join(', ')} /><Row k="Date" v={fmtDate(show.date)} /><Row k="Time" v={show.time} /><Row k="Seats" v={seats.map((s) => seatLabel(s)).join(', ')} />
    <div className="my-2 border-t border-dashed border-slate-200" />
    <Row k="Ticket price" v={money(p.ticket)} /><Row k="Convenience fee" v={money(p.fee)} /><Row k="Taxes" v={money(p.tax)} /><Row k="Total" v={money(p.total)} bold /></div>);
}
