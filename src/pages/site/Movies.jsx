import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { movieApi } from '../../services/movieApi';
import MovieCard from '../../components/site/MovieCard';
import { CardSkeletons, EmptyState, ErrorState } from '../../components/shared/Loading';
import { GENRES, LANGUAGES, FORMATS } from '../../constants';
const Sel = ({ label, value, set, opts }) => (
  <label className="text-xs text-slate-500">{label}<select className="input mt-1 !py-2" value={value} onChange={(e) => set(e.target.value)}>{opts.map((o) => <option key={o}>{o}</option>)}</select></label>);
export default function Movies() {
  const [sp, setSp] = useSearchParams(); const q = sp.get('q') || '';
  const [tab, setTab] = useState('now'); const [genre, setGenre] = useState('All'); const [lang, setLang] = useState('All');
  const [format, setFormat] = useState('All'); const [minRating, setMin] = useState('All'); const [sort, setSort] = useState('Popularity');
  const { data, loading, error, reload } = useFetch(() => movieApi.list({ status: tab, q }), [tab, q]);
  let list = (data || []).filter((m) => (genre === 'All' || m.genre === genre) && (lang === 'All' || m.language === lang) && (format === 'All' || (m.formats || []).includes(format)) && (minRating === 'All' || m.rating >= parseFloat(minRating)));
  list = [...list].sort((a, b) => (sort === 'Rating' ? b.rating - a.rating : b.id - a.id));
  return (
    <div className="wrap py-6">
      <div className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-2xl font-bold">{q ? `Results for "${q}"` : 'Movies'}</h1>
        <div className="flex rounded-full bg-white p-1 shadow-sm" role="tablist">{[['now', 'Now Showing'], ['soon', 'Coming Soon']].map(([k, l]) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`rounded-full px-4 py-1.5 text-sm font-semibold ${tab === k ? 'bg-brand text-white' : 'text-slate-600'}`}>{l}</button>))}</div></div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <label className="col-span-2 text-xs text-slate-500 sm:col-span-1">Search<input className="input mt-1 !py-2" value={q} onChange={(e) => setSp(e.target.value ? { q: e.target.value } : {})} placeholder="Title" /></label>
        <Sel label="Genre" value={genre} set={setGenre} opts={['All', ...GENRES]} /><Sel label="Language" value={lang} set={setLang} opts={['All', ...LANGUAGES]} /><Sel label="Format" value={format} set={setFormat} opts={['All', ...FORMATS]} />
        <Sel label="Rating" value={minRating} set={setMin} opts={['All', '7+', '8+']} /><Sel label="Sort by" value={sort} set={setSort} opts={['Popularity', 'Rating']} /></div>
      <div className="mt-6">{error ? <ErrorState message={error} onRetry={reload} /> : loading ? <CardSkeletons n={6} /> : !list.length ? <EmptyState title="No movies match" hint="Try clearing a filter." /> : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">{list.map((m) => <MovieCard key={m.id} movie={m} showBook className="w-full" />)}</div>)}</div>
    </div>
  );
}
