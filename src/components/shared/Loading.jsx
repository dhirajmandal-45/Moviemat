import { Loader2, AlertCircle, SearchX, Inbox } from 'lucide-react';
export const Spinner = () => <div className="grid place-items-center py-24"><Loader2 className="animate-spin text-brand" size={28} aria-label="Loading" /></div>;
export const Skeleton = ({ className = '' }) => <div className={`animate-pulse rounded-lg bg-slate-200 ${className}`} />;
export const CardSkeletons = ({ n = 6 }) => (
  <div className="flex gap-4 overflow-hidden">{Array.from({ length: n }, (_, i) => (
    <div key={i} className="w-40 shrink-0 sm:w-44"><Skeleton className="aspect-[2/3] w-full !rounded-2xl" /><Skeleton className="mt-2 h-4 w-3/4" /><Skeleton className="mt-1 h-3 w-1/2" /></div>))}</div>
);
export const TableSkeleton = ({ rows = 6, cols = 5 }) => (
  <div className="p-4">{Array.from({ length: rows }, (_, i) => <div key={i} className="mb-2 flex gap-4">{Array.from({ length: cols }, (_, j) => <Skeleton key={j} className="h-8 flex-1" />)}</div>)}</div>
);
export const ErrorState = ({ message, onRetry }) => (
  <div className="my-10 text-center"><AlertCircle className="mx-auto text-danger" size={30} />
    <p className="mt-2 font-semibold">Couldn't load this</p><p className="text-sm text-slate-500">{message}</p>
    {onRetry && <button className="btn-primary mt-4" onClick={onRetry}>Try again</button>}</div>
);
export const EmptyState = ({ title, hint, icon: Icon = SearchX }) => (
  <div className="my-10 text-center"><Icon className="mx-auto text-slate-300" size={30} /><p className="mt-2 font-semibold">{title}</p><p className="text-sm text-slate-500">{hint}</p></div>
);
export { Inbox };
