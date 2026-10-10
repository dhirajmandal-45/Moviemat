import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, Sparkles, MapPin, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useFetch from '../../hooks/useFetch';
import useMedia from '../../hooks/useMedia';
import { movieApi } from '../../services/movieApi';
import { theatreApi } from '../../services/theatreApi';
import { useBooking } from '../../context/BookingContext';
import MovieRow from '../../components/site/MovieRow';
import { ErrorState, Skeleton } from '../../components/shared/Loading';

function Hero({ movies }) {
  const nav = useNavigate();
  const wide = useMedia('(min-width: 1024px)');
  const per = wide ? 3 : 1;
  const max = Math.max(0, movies.length - per);
  const [i, setI] = useState(0);

  useEffect(() => {
    if (movies.length <= per) return undefined;
    const timer = setInterval(() => setI((x) => (x >= max ? 0 : x + 1)), 5000);
    return () => clearInterval(timer);
  }, [max, movies.length, per]);

  if (!movies.length) return null;

  return (
    <section className="wrap relative mt-4 sm:mt-6" aria-label="Featured movies">
      <div className="overflow-hidden rounded-[28px] bg-[#111022] p-1 shadow-2xl shadow-brand/10">
        <div className="flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${(Math.min(i, max) * 100) / per}%)` }}>
          {movies.map((m) => (
            <div key={m.id} className="shrink-0 px-1.5" style={{ width: `${100 / per}%` }}>
              <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: .995 }} onClick={() => nav(`/movies/${m.id}`)} className="group relative block h-64 w-full overflow-hidden rounded-[22px] p-5 text-left text-white sm:h-72">
                {m.posterUrl ? <img src={m.posterUrl} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" /> : <div className="absolute inset-0" style={{ background: `linear-gradient(120deg, ${m.color || '#5b3df5'}, #14122b)` }} />}
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/10" />
                <div className="absolute inset-x-5 bottom-5 sm:bottom-7 sm:left-7 sm:max-w-md">
                  <span className="mb-2 inline-flex rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">Now showing</span>
                  <span className="block text-2xl font-extrabold tracking-tight sm:text-3xl">{m.title}</span>
                  <span className="mt-2 flex flex-wrap items-center gap-2 text-xs text-white/80"><Star size={13} className="fill-gold text-gold" />{m.rating || '—'} · {m.genre} · {m.language}</span>
                  <span className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-ink">Book tickets <ArrowRight size={14} /></span>
                </div>
              </motion.button>
            </div>
          ))}
        </div>
      </div>
      {movies.length > per && <>
        <button aria-label="Previous" onClick={() => setI(i <= 0 ? max : i - 1)} className="absolute left-7 top-1/2 hidden -translate-y-1/2 rounded-full border border-white/70 bg-white/90 p-2.5 shadow-xl backdrop-blur sm:block"><ChevronLeft size={18} /></button>
        <button aria-label="Next" onClick={() => setI(i >= max ? 0 : i + 1)} className="absolute right-7 top-1/2 hidden -translate-y-1/2 rounded-full border border-white/70 bg-white/90 p-2.5 shadow-xl backdrop-blur sm:block"><ChevronRight size={18} /></button>
      </>}
    </section>
  );
}

export default function Home() {
  const { language, setCity } = useBooking();
  const nav = useNavigate();
  const { data: movies, loading, error, reload } = useFetch(() => movieApi.list(), []);
  const { data: cities } = useFetch(() => theatreApi.cities(), []);

  if (error) return <ErrorState message={error} onRetry={reload} />;

  const all = (movies || []).filter((m) => language === 'All' || m.language === language);
  const now = all.filter((m) => m.status === 'now');

  return (
    <>
      {loading ? <div className="wrap mt-4 sm:mt-6"><Skeleton className="h-64 w-full rounded-[28px] sm:h-72" /></div> : <Hero movies={now.slice(0, 6)} />}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .1 }}>
        <MovieRow title="Recommended Movies" loading={loading} movies={[...now].sort((a, b) => (b.rating || 0) - (a.rating || 0))} />
        <MovieRow title="Now Showing" loading={loading} movies={now} showBook />
        <MovieRow title="Coming Soon" loading={loading} movies={all.filter((m) => m.status === 'soon')} />
        <MovieRow title="Popular Movies" loading={loading} movies={[...all].reverse()} />
      </motion.div>

      <section className="wrap mt-12">
        <div className="mb-4 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">Explore by location</p><h2 className="section-title mt-1">Popular cities</h2></div><Link to="/location" className="hidden items-center gap-1 text-sm font-bold text-brand sm:flex">View all <ArrowRight size={15} /></Link></div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{(cities || []).map((c, index) => (
          <motion.button key={c.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .04 }} whileHover={{ y: -3 }} onClick={() => { setCity(c.name); nav('/theatres'); }} className="card group p-4 text-left transition hover:border-brand/30 hover:shadow-lg hover:shadow-brand/5">
            <span className="mb-3 grid h-9 w-9 place-items-center rounded-xl bg-brand-soft text-brand"><MapPin size={17} /></span><span className="block text-sm font-bold group-hover:text-brand">{c.name}</span><span className="mt-0.5 block text-xs text-slate-500">{c.state}</span>
          </motion.button>
        ))}</div>
      </section>

      <section className="wrap mt-12"><div className="relative overflow-hidden rounded-[28px] bg-[#111022] p-6 text-white shadow-2xl shadow-brand/10 sm:p-9">
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-brand/30 blur-3xl" /><div className="absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="relative flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center"><div><p className="flex items-center gap-2 text-xl font-extrabold"><Sparkles size={20} className="text-gold" />Your next movie night starts here</p><p className="mt-2 max-w-lg text-sm leading-6 text-white/65">Create a free account, save your bookings and get through checkout faster.</p></div><Link to="/signup" className="btn bg-white text-ink hover:bg-slate-100">Create account <ArrowRight size={16} /></Link></div>
      </div></section>
    </>
  );
}
