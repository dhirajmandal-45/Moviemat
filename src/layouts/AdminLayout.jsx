import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useUI } from '../context/UIContext';

export default function AdminLayout() {
  const { sidebarOpen, setSidebarOpen } = useUI();
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-[#f6f6fa] lg:pl-60">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Topbar path={pathname} />
      <motion.main
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="p-4 sm:p-6"
      >
        <Outlet />
      </motion.main>
    </div>
  );
}
