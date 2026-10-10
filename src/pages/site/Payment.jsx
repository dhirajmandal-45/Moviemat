import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, Landmark, Wallet, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useBooking } from '../../context/BookingContext';
import { bookingApi } from '../../services/bookingApi';
import Summary from '../../components/site/Summary';
import { calcPricing } from '../../utils/format';
import { PAY_METHODS } from '../../constants';
const ICONS = { Card: CreditCard, UPI: Smartphone, 'Net Banking': Landmark, Wallet };
export default function Payment() {
  const { draft, setBooking } = useBooking(); const nav = useNavigate(); const [method, setMethod] = useState('Card'); const [busy, setBusy] = useState(false);
  if (!draft?.seats?.length) return <Navigate to="/movies" replace />;
  const p = calcPricing(draft.seats);
  const pay = async (e) => {
    e.preventDefault(); setBusy(true);
    try { await new Promise((r) => setTimeout(r, 900)); // mock gateway
      const b = await bookingApi.create({ showId: draft.showId, seats: draft.seats, paymentMethod: method });
      setBooking(b); nav('/booking-success', { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Payment failed');
      setBusy(false);
      // Seat taken by someone else -> send the customer back to pick again
      if (err?.response?.status === 409) nav(`/booking/${draft.showId}/seats`, { replace: true });
    }
  };
  return (
    <div className="wrap grid gap-6 py-8 lg:grid-cols-[1fr_360px]">
      <form onSubmit={pay} className="card p-5"><h1 className="mb-4 text-2xl font-bold">Payment</h1>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="tablist">{PAY_METHODS.map((m) => { const I = ICONS[m]; return (
          <button type="button" key={m} role="tab" aria-selected={method === m} onClick={() => setMethod(m)} className={`flex flex-col items-center gap-1 rounded-xl border p-3 text-sm font-medium ${method === m ? 'border-brand bg-brand-soft text-brand' : 'border-slate-200'}`}><I size={20} />{m}</button>); })}</div>
        <div className="mt-5 space-y-3">
          {method === 'Card' && <><label className="block text-sm">Card number<input className="input mt-1" required inputMode="numeric" pattern="[0-9 ]{12,19}" placeholder="4111 1111 1111 1111" /></label>
            <div className="grid grid-cols-2 gap-3"><label className="text-sm">Expiry<input className="input mt-1" required placeholder="MM/YY" pattern="\d{2}/\d{2}" /></label><label className="text-sm">CVV<input className="input mt-1" required type="password" pattern="\d{3,4}" placeholder="•••" /></label></div>
            <label className="block text-sm">Name on card<input className="input mt-1" required /></label></>}
          {method === 'UPI' && <label className="block text-sm">UPI ID<input className="input mt-1" required pattern="[\w.\-]+@[\w]+" placeholder="name@bank" /></label>}
          {method === 'Net Banking' && <label className="block text-sm">Select bank<select className="input mt-1" required>{['HDFC Bank', 'SBI', 'ICICI Bank', 'Axis Bank', 'Kotak'].map((b) => <option key={b}>{b}</option>)}</select></label>}
          {method === 'Wallet' && <label className="block text-sm">Wallet<select className="input mt-1">{['Paytm', 'PhonePe', 'Amazon Pay'].map((b) => <option key={b}>{b}</option>)}</select></label>}
        </div>
        <button className="btn-primary mt-6 w-full" disabled={busy}>{busy ? <><Loader2 className="animate-spin" size={16} />Processing…</> : `Pay ₹${p.total}`}</button>
        <p className="mt-2 text-center text-xs text-slate-400">Demo payment. No real charge is made.</p></form>
      <div className="lg:sticky lg:top-20 lg:self-start"><Summary draft={draft} p={p} /></div>
    </div>
  );
}
