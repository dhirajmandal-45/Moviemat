import { useState } from 'react';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import useFetch from '../../hooks/useFetch';
import useDebounce from '../../hooks/useDebounce';
import { adminMovieApi } from '../../services/movieApi';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import SearchInput from '../../components/admin/SearchInput';
import Badge from '../../components/admin/Badge';
import { GENRES, LANGUAGES, MOVIE_STATUS } from '../../constants';
const BLANK = { posterUrl: '', title: '', status: 'now', rating: '', language: 'Hindi', genre: 'Action', duration: '', release: '', color: '#5b3df5', director: '', cast: '', trailerUrl: '', description: '' };
const STATUS_LABEL = { now: 'Now showing', soon: 'Coming soon', ended: 'Ended' };
export default function Movies() {
  const [q, setQ] = useState(''); const dq = useDebounce(q); const [status, setStatus] = useState('');
  const { data, loading, error, reload } = useFetch(() => adminMovieApi.list({ q: dq, status }), [dq, status]);
  const [form, setForm] = useState(null); const [editing, setEditing] = useState(null); const [del, setDel] = useState(null); const [busy, setBusy] = useState(false); const [file, setFile] = useState(null);
  const openCreate = () => { setEditing(null); setFile(null); setForm(BLANK); };
  const openEdit = (m) => { setEditing(m); setFile(null); setForm({ ...m, cast: m.cast.join(', '), duration: String(m.durationMinutes || m.duration || ''), release: String(m.release || '').slice(0, 10), director: m.director || '', trailerUrl: m.trailerUrl || '' }); };
  const save = async (e) => {
    e.preventDefault(); setBusy(true);
    const payload = { ...form, rating: Number(form.rating) || 0, cast: form.cast.split(',').map((c) => c.trim()).filter(Boolean) };
    try {
      const saved = editing ? await adminMovieApi.update(editing.id, payload) : await adminMovieApi.create(payload);
      toast.success(editing ? 'Movie updated' : 'Movie added');
      if (file) {
        try { await adminMovieApi.uploadPoster(saved.id, file); toast.success('Poster uploaded'); }
        catch (err) { toast.error(err?.response?.data?.message || 'Movie saved, but the poster upload failed'); }
      }
      setForm(null); setFile(null); reload();
    } catch (err) { toast.error(err?.response?.data?.message || 'Could not save movie'); } finally { setBusy(false); }
  };
  const remove = async () => {
    setBusy(true);
    try { await adminMovieApi.remove(del.id); toast.success('Movie removed'); setDel(null); reload(); }
    catch (err) { toast.error(err?.response?.data?.message || 'Could not remove movie'); setDel(null); }
    finally { setBusy(false); }
  };
  const columns = [
    { key: 'title', header: 'Movie', render: (m) => (<div className="flex items-center gap-3"><span className="h-10 w-8 shrink-0 overflow-hidden rounded-md" style={{ background: `linear-gradient(160deg, ${m.color}, #14122b)` }}>
          {m.posterUrl && <img src={m.posterUrl} alt="" className="h-full w-full object-cover" />}
        </span><div><p className="font-semibold">{m.title}</p><p className="text-xs text-slate-500">{m.genre} · {m.language}</p></div></div>) },
    { key: 'status', header: 'Status', render: (m) => <Badge status={m.status} /> },
    { key: 'rating', header: 'Rating', render: (m) => m.rating > 0 ? <span className="flex items-center gap-1"><Star size={13} className="fill-gold text-gold" />{m.rating}</span> : '—' },
    { key: 'duration', header: 'Duration' }, { key: 'release', header: 'Release' },
    { key: 'actions', header: '', render: (m) => (<div className="flex justify-end gap-1"><button aria-label="Edit" className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-brand" onClick={() => openEdit(m)}><Pencil size={15} /></button><button aria-label="Delete" className="rounded-lg p-1.5 text-slate-500 hover:bg-red-50 hover:text-danger" onClick={() => setDel(m)}><Trash2 size={15} /></button></div>) },
  ];
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3"><SearchInput value={q} onChange={setQ} placeholder="Search movies" />
        <select className="input w-auto !py-2" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All status</option>{MOVIE_STATUS.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}</select>
        <button className="btn-primary ml-auto" onClick={openCreate}><Plus size={16} />Add movie</button></div>
      <div className="card"><DataTable columns={columns} rows={data} loading={loading} error={error} onRetry={reload} emptyTitle="No movies yet" emptyHint="Add your first movie to get started." /></div>
      <Modal open={!!form} onClose={() => setForm(null)} title={editing ? 'Edit movie' : 'Add movie'} wide>
        {form && <form onSubmit={save} className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm">Poster URL
            <input className="input mt-1" type="url" placeholder="https://example.com/poster.jpg" value={form.posterUrl || ''} onChange={(e) => setForm({ ...form, posterUrl: e.target.value })} />
          </label>
          <label className="text-sm">…or upload a poster
            <input className="input mt-1 !py-1.5" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </label>
          <label className="sm:col-span-2 text-sm">Title<input className="input mt-1" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
          <label className="text-sm">Status<select className="input mt-1" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{MOVIE_STATUS.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}</select></label>
          <label className="text-sm">Rating (0-10)<input className="input mt-1" type="number" step="0.1" min="0" max="10" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} /></label>
          <label className="text-sm">Genre<select className="input mt-1" value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })}>{GENRES.map((g) => <option key={g}>{g}</option>)}</select></label>
          <label className="text-sm">Language<select className="input mt-1" value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}>{LANGUAGES.map((g) => <option key={g}>{g}</option>)}</select></label>
          <label className="text-sm">Duration<input className="input mt-1" required placeholder="2h 10m or 130" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} /></label>
          <label className="text-sm">Release date<input className="input mt-1" type="date" required value={form.release} onChange={(e) => setForm({ ...form, release: e.target.value })} /></label>
          <label className="text-sm">Brand color<input className="input mt-1 h-10" type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} /></label>
          <label className="text-sm">Director<input className="input mt-1" value={form.director} onChange={(e) => setForm({ ...form, director: e.target.value })} /></label>
          <label className="text-sm">Cast (comma separated)<input className="input mt-1" value={form.cast} onChange={(e) => setForm({ ...form, cast: e.target.value })} /></label>
          <label className="sm:col-span-2 text-sm">Trailer URL (optional)<input className="input mt-1" type="url" placeholder="https://youtube.com/watch?v=..." value={form.trailerUrl} onChange={(e) => setForm({ ...form, trailerUrl: e.target.value })} /></label>
          <label className="sm:col-span-2 text-sm">Description<textarea className="input mt-1" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
          <div className="sm:col-span-2 mt-2 flex justify-end gap-2"><button type="button" className="btn-ghost" onClick={() => setForm(null)}>Cancel</button><button className="btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save movie'}</button></div>
        </form>}
      </Modal>
      <ConfirmDialog open={!!del} onClose={() => setDel(null)} onConfirm={remove} busy={busy} title="Remove movie" body={`Remove "${del?.title}" from the catalogue? This can't be undone.`} />
    </div>
  );
}
