const MAP = {
  CONFIRMED: 'bg-emerald-50 text-success', COMPLETED: 'bg-blue-50 text-info', CANCELLED: 'bg-red-50 text-danger', PENDING: 'bg-amber-50 text-warning', FAILED: 'bg-red-50 text-danger',
  SCHEDULED: 'bg-emerald-50 text-success', ONGOING: 'bg-blue-50 text-info', ended: 'bg-slate-100 text-slate-600',
  now: 'bg-emerald-50 text-success', soon: 'bg-amber-50 text-warning', ACTIVE: 'bg-emerald-50 text-success', BLOCKED: 'bg-red-50 text-danger',
};
const LABEL = { now: 'Now Showing', soon: 'Coming Soon', ended: 'Ended' };
export default function Badge({ status }) {
  return <span className={`pill ${MAP[status] || 'bg-slate-100 text-slate-600'}`}>{LABEL[status] || status}</span>;
}
