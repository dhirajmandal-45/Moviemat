import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Clapperboard, Building2, CalendarClock, Ticket, Users, X, ArrowLeftRight, Sparkles } from 'lucide-react';

const LINKS = [
  ['/admin', LayoutGrid, 'Dashboard'],
  ['/admin/movies', Clapperboard, 'Movies'],
  ['/admin/theatres', Building2, 'Theatres'],
  ['/admin/shows', CalendarClock, 'Shows'],
  ['/admin/bookings', Ticket, 'Bookings'],
  ['/admin/users', Users, 'Users'],
];

function Navigation({ onClose }) {
  return (
    <nav className="mt-7 flex flex-col gap-1 px-3">
      <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Management</p>
      {LINKS.map(([to, Icon, label]) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/admin'}
          onClick={onClose}
          className="group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition"
        >
          {({ isActive }) => (
            <>
              {isActive && <motion.span layoutId="admin-active" className="absolute inset-0 rounded-xl bg-brand" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
              <Icon size={18} className={`relative z-10 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
              <span className={`relative z-10 ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>{label}</span>
            </>
          )}
        </NavLink>
      ))}

      <div className="my-4 h-px bg-white/10" />
      <NavLink to="/" onClick={onClose} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white">
        <ArrowLeftRight size={18} />View customer site
      </NavLink>
    </nav>
  );
}

export default function Sidebar({ open, onClose }) {
  const panel = (
    <aside className="h-full w-64 bg-[#111022] text-white shadow-2xl shadow-black/10 lg:w-60 lg:shadow-none">
      <div className="flex h-16 items-center gap-2 border-b border-white/10 px-5">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand shadow-lg shadow-brand/30"><Sparkles size={18} /></span>
        <div>
          <div className="text-lg font-extrabold tracking-tight">MOVIE<span className="text-brand">MAT</span></div>
          <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">Admin studio</div>
        </div>
      </div>
      <Navigation onClose={onClose} />
    </aside>
  );

  return (
    <>
      <div className="fixed inset-y-0 left-0 z-30 hidden lg:block">{panel}</div>
      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-40 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'spring', stiffness: 320, damping: 30 }} className="absolute inset-y-0 left-0">
              <div className="flex h-16 items-center justify-end bg-[#111022] px-4"><button aria-label="Close menu" onClick={onClose} className="rounded-lg p-2 text-slate-300 hover:bg-white/10"><X size={20} /></button></div>
              {panel}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
