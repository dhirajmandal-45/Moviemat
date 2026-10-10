import { IndianRupee, Ticket, Clapperboard, Users, Building2, Percent } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import useFetch from '../../hooks/useFetch';
import { statsApi } from '../../services/statsApi';
import { Spinner, ErrorState } from '../../components/shared/Loading';
import StatCard from '../../components/admin/StatCard';
import { money } from '../../utils/format';
const PIE = ['#5b3df5', '#0f9d8a', '#f59e0b', '#e0407b', '#2563eb', '#dc2626', '#16a34a'];
export default function Dashboard() {
  const { data: s, loading, error, reload } = useFetch(() => statsApi.get(), []);
  if (loading) return <Spinner />; if (error) return <ErrorState message={error} onRetry={reload} />;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard icon={IndianRupee} label="Revenue" value={money(s.totalRevenue)} tint="#5b3df5" />
        <StatCard icon={Ticket} label="Bookings" value={s.totalBookings} tint="#0f9d8a" />
        <StatCard icon={Clapperboard} label="Active movies" value={s.activeMovies} tint="#f59e0b" />
        <StatCard icon={Building2} label="Theatres" value={s.totalTheatres} tint="#2563eb" />
        <StatCard icon={Users} label="Users" value={s.totalUsers} tint="#e0407b" />
        <StatCard icon={Percent} label="Cancellation rate" value={`${s.cancelRate}%`} tint="#dc2626" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2"><h2 className="font-bold">Revenue trend</h2><p className="mb-2 text-xs text-slate-500">Confirmed + completed bookings, by show date</p>
          <ResponsiveContainer width="100%" height={260}><AreaChart data={s.revenueSeries}>
            <defs><linearGradient id="rev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#5b3df5" stopOpacity={0.35} /><stop offset="95%" stopColor="#5b3df5" stopOpacity={0} /></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" /><XAxis dataKey="date" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} width={44} />
            <Tooltip formatter={(v) => money(v)} /><Area type="monotone" dataKey="amount" stroke="#5b3df5" fill="url(#rev)" strokeWidth={2} /></AreaChart></ResponsiveContainer></div>
        <div className="card p-5"><h2 className="font-bold">Movies by genre</h2><p className="mb-2 text-xs text-slate-500">Current catalogue mix</p>
          <ResponsiveContainer width="100%" height={260}><PieChart><Pie data={s.genreSeries} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
            {s.genreSeries.map((_, i) => <Cell key={i} fill={PIE[i % PIE.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">{s.genreSeries.map((g, i) => <span key={g.name} className="flex items-center gap-1"><i className="h-2 w-2 rounded-full" style={{ background: PIE[i % PIE.length] }} />{g.name}</span>)}</div></div>
      </div>
      <div className="card p-5"><h2 className="font-bold">Top movies by tickets sold</h2>
        <ResponsiveContainer width="100%" height={260}><BarChart data={s.topMovies} layout="vertical" margin={{ left: 24 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eee" /><XAxis type="number" tick={{ fontSize: 12 }} /><YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 12 }} />
          <Tooltip /><Bar dataKey="tickets" fill="#5b3df5" radius={[0, 6, 6, 0]} /></BarChart></ResponsiveContainer></div>
    </div>
  );
}
