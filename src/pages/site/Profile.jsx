import { Link, useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Ticket, Settings, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
export default function Profile() {
  const { user, logout, isAdmin } = useAuth(); const nav = useNavigate();
  const row = (I, v) => <p className="flex items-center gap-2 text-sm text-slate-600"><I size={15} />{v}</p>;
  return (
    <div className="wrap max-w-2xl py-8"><div className="card p-6"><div className="flex items-center gap-4">
      <span className="grid h-16 w-16 place-items-center rounded-full bg-brand text-2xl font-bold text-white">{(user.name || '?')[0].toUpperCase()}</span>
      <div><h1 className="text-xl font-bold">{user.name}</h1><div className="mt-1 space-y-0.5">{row(Mail, user.email)}{user.phone && row(Phone, user.phone)}{user.city && row(MapPin, user.city)}</div></div></div></div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {isAdmin && <Link to="/admin" className="card flex items-center gap-3 p-4 font-semibold text-brand hover:border-brand sm:col-span-2"><ShieldCheck />Go to admin panel</Link>}
        <Link to="/bookings" className="card flex items-center gap-3 p-4 font-semibold hover:border-brand"><Ticket className="text-brand" />My bookings</Link>
        <Link to="/location" className="card flex items-center gap-3 p-4 font-semibold hover:border-brand"><Settings className="text-brand" />Account settings · change city</Link></div>
      <button className="btn mt-4 w-full border border-red-200 bg-white text-danger hover:bg-red-50" onClick={() => { logout(); nav('/'); }}><LogOut size={16} />Log out</button></div>
  );
}
