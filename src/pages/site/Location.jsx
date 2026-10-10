import { useNavigate } from 'react-router-dom';
import { MapPin, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import useFetch from '../../hooks/useFetch';
import { theatreApi } from '../../services/theatreApi';
import { movieApi } from '../../services/movieApi';
import { useBooking } from '../../context/BookingContext';
import { Spinner, ErrorState } from '../../components/shared/Loading';
import MovieRow from '../../components/site/MovieRow';
export default function Location() {
  const { city, setCity } = useBooking(); const nav = useNavigate();
  const { data: cities, loading, error, reload } = useFetch(() => theatreApi.cities(), []);
  const { data: theatres } = useFetch(() => theatreApi.list({ city }), [city]);
  const { data: movies } = useFetch(() => movieApi.list({ status: 'now' }), []);
  if (loading) return <Spinner />; if (error) return <ErrorState message={error} onRetry={reload} />;
  const states = [...new Set(cities.map((c) => c.state))]; const cur = cities.find((c) => c.name === city);
  return (
    <div className="py-6"><div className="wrap"><h1 className="text-2xl font-bold">Choose your city</h1><p className="text-sm text-slate-500">India{cur?.state ? ` → ${cur.state}` : ''} → {city}</p>
      <div className="mt-4 space-y-4">{states.map((s) => (<div key={s}><p className="mb-2 text-sm font-semibold text-slate-500">{s}</p>
        <div className="flex flex-wrap gap-2">{cities.filter((c) => c.state === s).map((c) => (
          <button key={c.name} onClick={() => { setCity(c.name); toast.success(`Location set to ${c.name}`); }} className={`btn ${city === c.name ? 'bg-brand text-white' : 'btn-ghost'}`}>{city === c.name ? <Check size={14} /> : <MapPin size={14} />}{c.name}</button>))}</div></div>))}</div>
      <h2 className="mb-2 mt-8 text-lg font-bold">Areas in {city}</h2><div className="flex flex-wrap gap-2">{[...new Set((theatres || []).map((t) => t.area).filter(Boolean))].map((a) => <span key={a} className="rounded-full bg-brand-soft px-3 py-1 text-sm text-brand">{a}</span>)}</div>
      <h2 className="mb-2 mt-8 text-lg font-bold">Theatres in {city}</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{(theatres || []).map((t) => <button key={t.id} onClick={() => nav('/theatres')} className="card p-4 text-left hover:border-brand"><p className="font-bold">{t.name}</p><p className="text-sm text-slate-500">{t.area}</p></button>)}</div></div>
      <MovieRow title={`Movies in ${city}`} movies={movies} showBook /></div>
  );
}
