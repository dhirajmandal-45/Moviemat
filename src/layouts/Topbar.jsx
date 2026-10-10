import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, LogOut, ChevronDown, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { initials } from '../utils/format';

const TITLES = {
  '/admin': ['Dashboard', 'Overview of your cinema business'],
  '/admin/movies': ['Movies', 'Manage your catalogue and posters'],
  '/admin/theatres': ['Theatres', 'Manage cinema locations'],
  '/admin/shows': ['Shows & schedule', 'Create and manage showtimes'],
  '/admin/bookings': ['Bookings', 'Track and manage reservations'],
  '/admin/users': ['Users', 'Manage registered customers'],
};

export default function Topbar({ path }) {
  const { user, logout } = useAuth();
  const { setSidebarOpen } = useUI();
  const nav = useNavigate();
  const [menu, setMenu] = useState(false);
  const title = TITLES[path] || ['MOVIEMAT Admin', 'Cinema management console'];

  return (
    <header className="sticky top-0 z-20 flex min-h-16 items-center gap-3 border-b border-slate-200/70 bg-white/90 px-4 backdrop-blur-xl sm:px-6">
      <button aria-label="Open menu" className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 lg:hidden" onClick={() => setSidebarOpen(true)}><Menu size={21} /></button>
      <div>
        <h1 className="text-base font-extrabold tracking-tight sm:text-lg">{title[0]}</h1>
        <p className="hidden text-[11px] text-slate-400 sm:block">{title[1]}</p>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <button aria-label="Notifications" className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-brand"><Bell size={18} /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-danger" /></button>
        <div className="relative">
          <button onClick={() => setMenu(!menu)} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white py-1.5 pl-1.5 pr-2.5 transition hover:border-brand/30" aria-haspopup="menu" aria-expanded={menu}>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand to-brand-dark text-xs font-bold text-white shadow-sm">{initials(user?.name || 'Admin')}</span>
            <span className="hidden text-left sm:block"><span className="block text-xs font-bold">{user?.name || 'Admin'}</span><span className="block text-[10px] text-slate-400">Administrator</span></span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>
          <AnimatePresence>
            {menu && <motion.div initial={{ opacity: 0, y: -4, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4, scale: .98 }} className="card absolute right-0 mt-2 w-56 overflow-hidden p-1.5 shadow-xl shadow-slate-900/10">
              <div className="rounded-xl bg-slate-50 px-3 py-2.5"><p className="text-xs font-bold">{user?.name || 'Admin'}</p><p className="mt-0.5 truncate text-[11px] text-slate-400">{user?.email}</p></div>
              <button className="mt-1.5 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-danger hover:bg-red-50" onClick={() => { setMenu(false); logout(); nav('/login'); }}><LogOut size={15} />Log out</button>
            </motion.div>}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
