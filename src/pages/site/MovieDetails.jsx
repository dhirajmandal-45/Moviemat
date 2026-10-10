import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Star, Clock, Globe, Calendar, PlayCircle, Share2, Ticket } from 'lucide-react';
import toast from 'react-hot-toast';
import useFetch from '../../hooks/useFetch';
import { movieApi } from '../../services/movieApi';
import { Poster } from '../../components/site/MovieCard';
import MovieRow from '../../components/site/MovieRow';
import { Spinner, ErrorState } from '../../components/shared/Loading';
import { fmtDateShort } from '../../utils/format';
import { useAuth } from '../../context/AuthContext';
export default function MovieDetails() {
  const { id } = useParams(); const nav = useNavigate();
  const { data: m, loading, error, reload } = useFetch(() => movieApi.get(id), [id]);
  const { data: all } = useFetch(() => movieApi.list(), []);
  const { data: reviews, reload: reloadReviews } = useFetch(() => movieApi.reviews(id), [id]);
  const { user } = useAuth();
  const [stars, setStars] = useState(5); const [text, setText] = useState(''); const [posting, setPosting] = useState(false);
  const submitReview = async (e) => {
    e.preventDefault(); setPosting(true);
    try { await movieApi.addReview(id, { rating: stars, text }); toast.success('Thanks for your review!'); setText(''); reloadReviews(); }
    catch (err) { toast.error(err?.response?.data?.message || 'Could not save your review'); }
    finally { setPosting(false); }
  };
  if (loading) return <Spinner />; if (error) return <ErrorState message={error} onRetry={reload} />;
  const others = (all || []).filter((x) => x.id !== m.id);
  const share = async () => { try { if (navigator.share) await navigator.share({ title: m.title, url: location.href }); else { await navigator.clipboard.writeText(location.href); toast.success('Link copied'); } } catch { /* cancelled */ } };
  return (
    <>
      <section className="text-white" style={{ background: `linear-gradient(110deg, #14122b 30%, ${m.color})` }}>
        <div className="wrap flex flex-col gap-6 py-8 sm:flex-row">
          <Poster movie={m} className="w-44 shrink-0 shadow-2xl sm:w-56" />
          <div className="flex-1"><h1 className="text-3xl font-extrabold">{m.title}</h1>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/85">
              {m.rating > 0 && <span className="flex items-center gap-1"><Star size={14} className="fill-gold text-gold" />{m.rating}/10</span>}
              <span className="flex items-center gap-1"><Clock size={14} />{m.duration}</span><span className="flex items-center gap-1"><Globe size={14} />{m.language}</span><span className="flex items-center gap-1"><Calendar size={14} />{fmtDateShort(m.release)}</span></div>
            <div className="mt-3 flex flex-wrap gap-2"><span className="rounded-full bg-white/15 px-3 py-1 text-xs">{m.genre}</span>{m.formats.map((f) => <span key={f} className="rounded-full bg-white/15 px-3 py-1 text-xs">{f}</span>)}</div>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/90">{m.description}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {m.status === 'now' ? <button className="btn bg-gold text-ink hover:bg-amber-400" onClick={() => nav(`/theatres?movieId=${m.id}`)}><Ticket size={16} />Book Tickets</button> : <span className="btn bg-white/15">Opens {fmtDateShort(m.release)}</span>}
              <a className="btn bg-white/15 hover:bg-white/25" target="_blank" rel="noreferrer" href={m.trailerUrl || `https://www.youtube.com/results?search_query=${encodeURIComponent(m.title + ' official trailer')}`}><PlayCircle size={16} />Trailer</a>
              <button className="btn bg-white/15 hover:bg-white/25" onClick={share}><Share2 size={16} />Share</button></div></div>
        </div>
      </section>
      <section className="wrap mt-8 grid gap-6 md:grid-cols-2">
        {m.cast.length > 0 && <div><h2 className="mb-2 text-lg font-bold">Cast</h2><div className="flex flex-wrap gap-2">{m.cast.map((c) => <span key={c} className="card px-3 py-1.5 text-sm">{c}</span>)}</div></div>}
        {m.director && <div><h2 className="mb-2 text-lg font-bold">Director</h2><span className="card inline-block px-3 py-1.5 text-sm">{m.director}</span></div>}</section>
      <MovieRow title="Recommended Movies" movies={others.filter((x) => x.status === 'now').slice(0, 8)} />
      <MovieRow title="Similar Movies" movies={others.filter((x) => x.genre === m.genre || x.language === m.language)} />
      <section className="wrap mt-8"><h2 className="mb-3 text-lg font-bold">User reviews</h2>
        {user ? (
          <form onSubmit={submitReview} className="card mb-4 space-y-3 p-4">
            <div className="flex items-center gap-1" role="radiogroup" aria-label="Your rating">{[1, 2, 3, 4, 5].map((n) => (
              <button type="button" key={n} role="radio" aria-checked={stars === n} aria-label={`${n} star${n > 1 ? 's' : ''}`} onClick={() => setStars(n)}><Star size={22} className={n <= stars ? 'fill-gold text-gold' : 'text-slate-300'} /></button>))}</div>
            <textarea className="input" rows={2} maxLength={1000} value={text} onChange={(e) => setText(e.target.value)} placeholder="Share your thoughts (optional)" />
            <button className="btn-primary" disabled={posting}>{posting ? 'Saving…' : 'Post review'}</button>
          </form>
        ) : <p className="mb-4 text-sm text-slate-500"><Link className="font-semibold text-brand" to="/login">Log in</Link> to write a review.</p>}
        {!(reviews || []).length && <p className="text-sm text-slate-500">No reviews yet - be the first!</p>}
        <div className="grid gap-3 md:grid-cols-3">
        {(reviews || []).map((r) => <div key={r.id} className="card p-4"><p className="flex items-center gap-1 text-sm font-semibold">{r.user}<span className="ml-auto flex items-center gap-0.5 text-xs"><Star size={12} className="fill-gold text-gold" />{r.rating}</span></p><p className="mt-1 text-sm text-slate-600">{r.text}</p></div>)}</div></section>
    </>
  );
}
