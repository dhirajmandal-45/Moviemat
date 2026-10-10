import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { showApi } from '../../services/showApi';
import { movieApi } from '../../services/movieApi';
import { useBooking } from '../../context/BookingContext';
import { next7Days } from '../../utils/format';
import TheatreCard from '../../components/site/TheatreCard';
import { EmptyState, ErrorState, Skeleton } from '../../components/shared/Loading';
export default function Theatres() {
  const [sp, setSp] = useSearchParams(); const nav = useNavigate(); const { city } = useBooking();
  const days = next7Days(); const [date, setDate] = useState(days[0].iso);
  const { data: movies } = useFetch(() => movieApi.list({ status: 'now' }), []);
  const movieId = sp.get('movieId') || movies?.[0]?.id;
  const noMovies = movies && movies.length === 0 && !sp.get('movieId');
  const { data, loading, error, reload } = useFetch(() => (movieId ? showApi.listByCity({ city, date, movieId }) : Promise.resolve(null)), [city, date, movieId]);
  return (
    <div className="wrap py-6"><h1 className="text-2xl font-bold">Theatres in {city}</h1>
      <div className="mt-4 flex flex-wrap items-end gap-4">
        <label className="text-xs text-slate-500">Movie<select className="input mt-1 min-w-52" value={movieId || ''} onChange={(e) => setSp({ movieId: e.target.value })}>{(movies || []).map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}</select></label></div>
      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto" role="radiogroup" aria-label="Select date">{days.map((d) => (
        <button key={d.iso} role="radio" aria-checked={date === d.iso} onClick={() => setDate(d.iso)} className={`min-w-16 rounded-xl border px-3 py-2 text-center text-xs font-semibold ${date === d.iso ? 'border-brand bg-brand text-white' : 'border-slate-200 bg-white'}`}>{d.day}<span className="block text-lg">{d.num}</span></button>))}</div>
      <div className="mt-6 space-y-4">{error ? <ErrorState message={error} onRetry={reload} /> : noMovies ? <EmptyState title="No movies are showing right now" hint="Please check back soon." /> : loading || !data ? [1, 2, 3].map((i) => <Skeleton key={i} className="h-36 w-full" />) : !data.length ? <EmptyState title="No shows for this date" hint="Try another date or pick a different movie." /> :
        data.map((t) => <TheatreCard key={t.id} theatre={t} onSelectShow={(s) => nav(`/booking/${s.id}/seats`)} />)}</div></div>
  );
}
