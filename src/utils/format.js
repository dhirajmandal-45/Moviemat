export const money = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
export const isoDate = (d) => d.toLocaleDateString('en-CA');
export const next7Days = () => Array.from({ length: 7 }, (_, i) => {
  const d = new Date(); d.setDate(d.getDate() + i);
  return { iso: isoDate(d), day: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(), num: String(d.getDate()).padStart(2, '0') };
});
export const fmtDate = (iso) => (iso ? new Date(String(iso).slice(0, 10) + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : '');
export const fmtDateShort = (iso) => (iso ? new Date(String(iso).slice(0, 10) + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '');
export const calcPricing = (seats) => {
  const ticket = seats.reduce((s, x) => s + Number(x.price || 0), 0);
  const fee = 0;
  const tax = 0;
  return { ticket, fee, tax, total: ticket };
};
export const initials = (name = '') => name.split(' ').filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase();

/** "18:30:00" / "18:30" -> "06:30 PM". Already formatted labels are returned unchanged. */
export const timeLabel = (time) => {
  if (!time) return '';
  const text = String(time).trim();
  if (/am|pm/i.test(text)) return text;
  const [hh, mm] = text.split(':').map(Number);
  if (!Number.isFinite(hh)) return text;
  const suffix = hh >= 12 ? 'PM' : 'AM';
  const h = hh % 12 || 12;
  return `${String(h).padStart(2, '0')}:${String(Number.isFinite(mm) ? mm : 0).padStart(2, '0')} ${suffix}`;
};

/** Seat label such as "A1", whether the backend stores seatNumber as "A1" or just "1". */
export const seatLabel = (seat) => {
  if (!seat) return '';
  if (typeof seat === 'string') return seat;
  const row = String(seat.row ?? seat.rowLabel ?? '');
  const num = String(seat.number ?? seat.seatNumber ?? '');
  if (!num) return row;
  return row && !num.toUpperCase().startsWith(row.toUpperCase()) ? `${row}${num}` : num;
};
