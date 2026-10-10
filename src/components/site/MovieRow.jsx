import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';
import { CardSkeletons } from '../shared/Loading';
export default function MovieRow({ title, movies, loading, showBook }) {
  const ref = useRef(); const scroll = (d) => ref.current.scrollBy({ left: d * 480, behavior: 'smooth' });
  if (!loading && !movies?.length) return null;
  return (
    <section className="wrap mt-8">
      <div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-bold sm:text-xl">{title}</h2>
        <div className="hidden gap-1 sm:flex"><button aria-label="Scroll left" className="btn-ghost !p-1.5" onClick={() => scroll(-1)}><ChevronLeft size={16} /></button><button aria-label="Scroll right" className="btn-ghost !p-1.5" onClick={() => scroll(1)}><ChevronRight size={16} /></button></div></div>
      {loading ? <CardSkeletons /> : <div ref={ref} className="no-scrollbar flex gap-4 overflow-x-auto pb-2">{movies.map((m) => <MovieCard key={m.id} movie={m} showBook={showBook} />)}</div>}
    </section>
  );
}
