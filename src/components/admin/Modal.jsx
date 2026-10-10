import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
export default function Modal({ open, onClose, title, children, wide }) {
  return (
    <AnimatePresence>{open && (
      <motion.div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
        <motion.div role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.96, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
          className={`max-h-[88vh] w-full overflow-y-auto rounded-2xl bg-white p-6 shadow-xl ${wide ? 'max-w-2xl' : 'max-w-md'}`}>
          <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-bold">{title}</h2>
            <button aria-label="Close" onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-ink"><X size={18} /></button></div>
          {children}
        </motion.div>
      </motion.div>)}</AnimatePresence>
  );
}
