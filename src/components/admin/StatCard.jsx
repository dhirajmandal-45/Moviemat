import { motion } from 'framer-motion';
export default function StatCard({ icon: Icon, label, value, tint, delta }) {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="card p-4">
      <div className="flex items-start justify-between">
        <div><p className="text-xs font-medium text-slate-500">{label}</p><p className="mt-1 text-2xl font-extrabold text-ink">{value}</p></div>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl" style={{ background: tint + '1a', color: tint }}><Icon size={20} /></span>
      </div>
      {delta != null && <p className={`mt-2 text-xs font-medium ${delta >= 0 ? 'text-success' : 'text-danger'}`}>{delta >= 0 ? '+' : ''}{delta}% vs last period</p>}
    </motion.div>
  );
}
