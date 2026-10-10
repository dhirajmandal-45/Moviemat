import { Link, useNavigate } from 'react-router-dom';
import { Star, Film } from 'lucide-react';
import { motion } from 'framer-motion';
import { fmtDateShort } from '../../utils/format';
export const Poster = ({ movie, className = '' }) => (
  <div className={`relative aspect-[2/3] overflow-hidden rounded-2xl ${className}`} style={{ background: `linear-gradient(160deg, ${movie.color}, #14122b 95%)` }}>
    {movie.posterUrl && <img src={movie.posterUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />}
    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
    <Film className="absolute right-3 top-3 text-white/30" size={22} />
    <p className="absolute inset-x-3 bottom-4 text-lg font-bold leading-tight text-white">{movie.title}</p>
  </div>
);
export default function MovieCard({ movie, showBook, className = 'w-40 sm:w-44' }) {
  const nav = useNavigate(); const soon = movie.status === 'soon';
  return (
    <motion.div whileHover={{ y: -4 }} className={`${className} shrink-0`}>
      <Link to={`/movies/${movie.id}`} aria-label={movie.title}><Poster movie={movie} className="shadow-md" /></Link>
      <div className="mt-2 px-0.5">
        <h3 className="truncate text-sm font-semibold">{movie.title}</h3>
        {soon ? <p className="text-xs font-medium text-brand">Releases {fmtDateShort(movie.release)}</p> : (
          <p className="flex items-center gap-1 text-xs text-slate-500"><Star size={12} className="fill-gold text-gold" />{movie.rating}/10 · {movie.language}</p>)}
        <p className="truncate text-xs text-slate-500">{movie.genre}{movie.duration ? ` · ${movie.duration}` : ''}</p>
        {showBook && !soon && <button className="btn-primary mt-2 w-full !py-1.5" onClick={() => nav(`/theatres?movieId=${movie.id}`)}>Book Tickets</button>}
      </div>
    </motion.div>
  );
}
