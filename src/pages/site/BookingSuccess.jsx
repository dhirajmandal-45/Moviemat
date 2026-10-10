import { Link, Navigate } from 'react-router-dom';
import { CheckCircle2, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { useBooking } from '../../context/BookingContext';
import Ticket from '../../components/site/Ticket';
export default function BookingSuccess() {
  const { confirmed: b } = useBooking(); if (!b) return <Navigate to="/bookings" replace />;
  return (
    <div className="wrap py-10"><motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mb-6 text-center">
      <CheckCircle2 className={`mx-auto ${b.status === 'CANCELLED' ? 'text-slate-300' : 'text-success'}`} size={56} /><h1 className="mt-2 text-2xl font-extrabold">{b.status === 'CANCELLED' ? 'Booking Cancelled' : 'Booking Confirmed'}</h1><p className="text-sm text-slate-500">{b.status === 'CANCELLED' ? 'This ticket is no longer valid.' : 'Show this ticket at the theatre entrance.'}</p></motion.div>
      <Ticket b={b} />
      <div className="no-print mt-6 flex flex-wrap justify-center gap-3"><button className="btn-primary" onClick={() => window.print()}><Download size={16} />Download Ticket</button><Link className="btn-ghost" to="/bookings">View My Bookings</Link><Link className="btn-ghost" to="/">Go Home</Link></div></div>
  );
}
