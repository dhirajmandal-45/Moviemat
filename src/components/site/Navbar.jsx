import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { MapPin, Search, Menu, X, User, LogOut, Ticket, Home, Film, Building2, ChevronDown, ShieldCheck, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';
import { LANGUAGES } from '../../constants';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { city, language, setLanguage } = useBooking();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [q, setQ] = useState('');
  const nav = useNavigate();
  const search = (e) => { e.preventDefault(); nav(`/movies?q=${encodeURIComponent(q)}`); setOpen(false); };
  const Search_ = <form onSubmit={search} className="relative w-full" role="search"><Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search" placeholder="Search movies, actors, events" className="input !rounded-full !border-0 !bg-slate-100/80 !py-2.5 pl-10" /></form>;

  return (
    <>
      <nav className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
        <div className="wrap flex h-16 items-center gap-3">
          <Link to="/" className="group flex items-center gap-2 text-xl font-black tracking-tight text-ink"><span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-white shadow-md shadow-brand/20 transition group-hover:rotate-3"><Sparkles size={17} /></span><span>MOVIE<span className="text-brand">MAT</span></span></Link>
          <Link to="/location" className="hidden items-center gap-1.5 rounded-full border border-brand/10 bg-brand-soft px-3 py-2 text-xs font-bold text-brand transition hover:border-brand/30 sm:flex"><MapPin size={14} />{city}<ChevronDown size={13} /></Link>
          <div className="mx-4 hidden max-w-lg flex-1 md:block">{Search_}</div>
          <div className="ml-auto flex items-center gap-2">
            <select aria-label="Language" value={language} onChange={(e) => setLanguage(e.target.value)} className="hidden rounded-lg border-0 bg-transparent text-xs font-bold text-slate-600 outline-none lg:block">{['All', ...LANGUAGES].map((l) => <option key={l}>{l}</option>)}</select>
            {user ? <div className="relative"><button onClick={() => setMenu(!menu)} className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1.5 pl-1.5 pr-2.5 text-sm shadow-sm transition hover:border-brand/30" aria-haspopup="menu" aria-expanded={menu}><span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-xs font-bold text-white">{(user.name || '?')[0].toUpperCase()}</span><span className="hidden max-w-20 truncate text-xs font-bold sm:inline">{user.name.split(' ')[0]}</span></button><AnimatePresence>{menu && <motion.div initial={{ opacity: 0, y: -5, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -5 }} className="card absolute right-0 mt-2 w-52 overflow-hidden p-1.5 shadow-xl shadow-slate-900/10" onClick={() => setMenu(false)}><div className="mb-1 rounded-xl bg-slate-50 px-3 py-2.5"><p className="text-xs font-bold">{user.name}</p><p className="mt-0.5 truncate text-[11px] text-slate-400">{user.email}</p></div>{isAdmin && <Link className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-brand hover:bg-brand-soft" to="/admin"><ShieldCheck size={15} />Admin panel</Link>}<Link className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-slate-50" to="/profile"><User size={15} />Profile</Link><Link className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-slate-50" to="/bookings"><Ticket size={15} />My bookings</Link><button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-danger hover:bg-red-50" onClick={() => { logout(); nav('/'); }}><LogOut size={15} />Log out</button></motion.div>}</AnimatePresence></div> : <Link to="/login" className="btn-primary !rounded-full !px-4 !py-2">Log in</Link>}
            <button className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 md:hidden" aria-label="Menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
          </div>
        </div>
        <AnimatePresence>{open && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-slate-100 md:hidden"><div className="space-y-3 p-4">{Search_}<Link to="/location" onClick={() => setOpen(false)} className="flex items-center gap-2 text-sm font-semibold"><MapPin size={16} />{city} - change city</Link><select aria-label="Language" value={language} onChange={(e) => setLanguage(e.target.value)} className="input">{['All', ...LANGUAGES].map((l) => <option key={l}>{l}</option>)}</select></div></motion.div>}</AnimatePresence>
      </nav>
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-slate-200/80 bg-white/90 py-2 backdrop-blur-xl md:hidden">{[['/', Home, 'Home'], ['/movies', Film, 'Movies'], ['/theatres', Building2, 'Theatres'], [user ? '/profile' : '/login', User, user ? 'Profile' : 'Login']].map(([to, Icon, label]) => <NavLink key={label} to={to} end={to === '/'} className={({ isActive }) => `flex flex-col items-center gap-0.5 text-[10px] font-semibold ${isActive ? 'text-brand' : 'text-slate-500'}`}><Icon size={19} />{label}</NavLink>)}</div>
    </>
  );
}
