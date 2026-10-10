export default function Seat({ seat, selected, onToggle }) {
  const base = 'h-8 w-8 sm:h-9 sm:w-9 rounded-t-lg rounded-b text-[10px] font-semibold border transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand ';
  const cls = seat.sold ? 'bg-slate-200 border-slate-200 text-slate-400 cursor-not-allowed'
    : selected ? 'bg-brand border-brand text-white'
    : seat.type === 'RECLINER' ? 'border-violet-400 bg-violet-100 text-violet-700 hover:bg-violet-200'
    : seat.type === 'PREMIUM' ? 'border-gold bg-gold/20 text-amber-700 hover:bg-gold/50' : 'border-emerald-500 text-emerald-600 hover:bg-emerald-50';
  return <button disabled={seat.sold} aria-pressed={selected} aria-label={`Seat ${seat.label || seat.number} ${seat.type} ₹${seat.price}${seat.sold ? ' sold' : ''}`} className={base + cls} onClick={() => onToggle(seat)}>{seat.number}</button>;
}
