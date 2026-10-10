import { Navigate, useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import Summary from '../../components/site/Summary';
import { calcPricing } from '../../utils/format';
export default function BookingSummary() {
  const { draft } = useBooking(); const nav = useNavigate();
  if (!draft?.seats?.length) return <Navigate to="/movies" replace />;
  return (<div className="wrap max-w-xl py-8"><h1 className="mb-4 text-2xl font-bold">Review your booking</h1><Summary draft={draft} p={calcPricing(draft.seats)} />
    <div className="mt-4 flex gap-3"><button className="btn-ghost" onClick={() => nav(-1)}>Change seats</button><button className="btn-primary flex-1" onClick={() => nav('/payment')}>Proceed to Payment</button></div></div>);
}
