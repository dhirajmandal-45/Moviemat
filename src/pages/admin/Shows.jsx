import { useMemo, useState } from 'react';
import { Plus, Trash2, Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import useFetch from '../../hooks/useFetch';
import { adminShowApi, adminScreenApi } from '../../services/showApi';
import { adminMovieApi } from '../../services/movieApi';
import { adminTheatreApi } from '../../services/theatreApi';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import Badge from '../../components/admin/Badge';
import { money, fmtDateShort, isoDate } from '../../utils/format';
import { SHOW_STATUS } from '../../constants';

const hhmm = (t) => String(t || '').slice(0, 5);

/** start "18:30" + minutes -> "20:48" (capped at 23:59 because a show can't run past midnight) */
const addMinutes = (start, minutes) => {
  if (!start || !minutes) return '';
  const [h, m] = start.split(':').map(Number);
  const total = Math.min(h * 60 + m + Number(minutes), 23 * 60 + 59);
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
};

export default function Shows() {
  const { data, loading, error, reload } = useFetch(() => adminShowApi.list(), []);
  const { data: movies } = useFetch(() => adminMovieApi.list(), []);
  const { data: theatres } = useFetch(() => adminTheatreApi.list(), []);
  const { data: screens } = useFetch(() => adminScreenApi.list(), []);
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(null);
  const [del, setDel] = useState(null);
  const [busy, setBusy] = useState(false);

  // When editing, the show's own movie must stay selectable even if it has since ended
  const availableMovies = (movies || []).filter((m) => (m.active !== false && m.status !== 'ended') || Number(m.id) === Number(editing?.movieId));
  const theatreScreens = useMemo(
    () => (screens || []).filter((s) => Number(s.theatreId) === Number(form?.theatreId) && (s.active !== false || Number(s.id) === Number(form?.screenId))),
    [screens, form?.theatreId, form?.screenId]
  );
  const movieOf = (id) => (movies || []).find((m) => Number(m.id) === Number(id));

  const blank = () => ({
    movieId: availableMovies[0]?.id || '',
    theatreId: theatres?.[0]?.id || '',
    screenId: '',
    showDate: isoDate(new Date()),
    startTime: '',
    endTime: '',
    basePrice: 200,
    language: availableMovies[0]?.language || 'Hindi',
    format: '2D',
    status: 'SCHEDULED',
    active: true,
  });

  const openCreate = () => {
    const next = blank();
    const firstScreen = (screens || []).find((s) => Number(s.theatreId) === Number(next.theatreId) && s.active !== false);
    next.screenId = firstScreen?.id || '';
    setEditing(null);
    setForm(next);
  };

  const openEdit = (s) => {
    const screen = (screens || []).find((x) => Number(x.id) === Number(s.screenId));
    setEditing(s);
    setForm({
      movieId: s.movieId, theatreId: screen?.theatreId ?? s.theatreId, screenId: s.screenId,
      showDate: String(s.showDate).slice(0, 10), startTime: hhmm(s.startTime), endTime: hhmm(s.endTime),
      basePrice: s.price, language: s.language || 'Hindi', format: s.format || '2D',
      status: s.status || 'SCHEDULED', active: s.active !== false,
    });
  };

  const setStart = (startTime) => {
    const movie = movieOf(form.movieId);
    // Fill the end time from the movie's running time (the admin can still change it)
    setForm({ ...form, startTime, endTime: addMinutes(startTime, movie?.durationMinutes) || form.endTime });
  };

  const save = async (e) => {
    e.preventDefault();
    if (!form.screenId) { toast.error('Please select a screen'); return; }
    if (form.endTime && form.startTime && form.endTime <= form.startTime) {
      toast.error('End time must be after the start time'); return;
    }
    setBusy(true);
    const payload = { ...form, movieId: Number(form.movieId), screenId: Number(form.screenId), basePrice: Number(form.basePrice) };
    try {
      editing ? await adminShowApi.update(editing.id, payload) : await adminShowApi.create(payload);
      toast.success(editing ? 'Show updated' : 'Show scheduled');
      setForm(null); setEditing(null); reload();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not save show');
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      await adminShowApi.remove(del.id);
      toast.success('Show removed');
      setDel(null); reload();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not remove show');
      setDel(null);
    } finally {
      setBusy(false);
    }
  };

  const sorted = data ? [...data].sort((a, b) =>
    String(a.date || '').localeCompare(String(b.date || '')) ||
    String(a.startTime || '').localeCompare(String(b.startTime || ''))
  ) : data;

  const columns = [
    { key: 'movieTitle', header: 'Movie', render: (s) => <p className="font-semibold">{s.movieTitle || s.movie?.title || 'Removed movie'}</p> },
    { key: 'theatreName', header: 'Theatre', render: (s) => <span>{s.theatreName || s.theatre?.name || 'Removed theatre'}</span> },
    { key: 'screen', header: 'Screen', render: (s) => s.screenName || s.screen || '—' },
    { key: 'date', header: 'Date', render: (s) => fmtDateShort(s.date) },
    { key: 'time', header: 'Time' },
    { key: 'price', header: 'Price', render: (s) => money(s.price) },
    { key: 'status', header: 'Status', render: (s) => <Badge status={s.status} /> },
    { key: 'actions', header: '', render: (s) => (
      <div className="flex justify-end gap-1">
        <button aria-label="Edit" className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-brand" onClick={() => openEdit(s)}><Pencil size={15} /></button>
        <button aria-label="Delete" className="rounded-lg p-1.5 text-slate-500 hover:bg-red-50 hover:text-danger" onClick={() => setDel(s)}><Trash2 size={15} /></button>
      </div>
    ) },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button className="btn-primary" disabled={!availableMovies.length || !theatres?.length || !screens?.length} onClick={openCreate}>
          <Plus size={16} />Schedule show
        </button>
      </div>

      {screens && !screens.length && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          No screens exist yet. Add a theatre first - its screens and seats are created automatically.
        </div>
      )}

      <div className="card">
        <DataTable columns={columns} rows={sorted} loading={loading} error={error} onRetry={reload}
          emptyTitle="No shows scheduled" emptyHint="Schedule a show to make it bookable on the customer site." />
      </div>

      <Modal open={!!form} onClose={() => { setForm(null); setEditing(null); }} title={editing ? 'Edit show' : 'Schedule show'}>
        {form && (
          <form onSubmit={save} className="space-y-3">
            <label className="block text-sm">Movie
              <select className="input mt-1" required value={form.movieId} onChange={(e) => {
                const movie = movieOf(e.target.value);
                setForm({ ...form, movieId: e.target.value, language: movie?.language || form.language, endTime: addMinutes(form.startTime, movie?.durationMinutes) || form.endTime });
              }}>
                {availableMovies.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
              </select>
            </label>

            <label className="block text-sm">Theatre
              <select className="input mt-1" required value={form.theatreId} onChange={(e) => {
                const theatreId = e.target.value;
                const first = (screens || []).find((s) => Number(s.theatreId) === Number(theatreId) && s.active !== false);
                setForm({ ...form, theatreId, screenId: first?.id || '' });
              }}>
                {(theatres || []).map((t) => <option key={t.id} value={t.id}>{t.name} - {t.area}, {t.city}</option>)}
              </select>
            </label>

            <label className="block text-sm">Screen
              <select className="input mt-1" required value={form.screenId} onChange={(e) => setForm({ ...form, screenId: e.target.value })}>
                <option value="">Select screen</option>
                {theatreScreens.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.seatCount} seats)</option>)}
              </select>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm">Date<input className="input mt-1" type="date" required value={form.showDate} onChange={(e) => setForm({ ...form, showDate: e.target.value })} /></label>
              <label className="text-sm">Start time<input className="input mt-1" type="time" required value={form.startTime} onChange={(e) => setStart(e.target.value)} /></label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm">End time<input className="input mt-1" type="time" required value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} /></label>
              <label className="text-sm">Ticket price (₹)<input className="input mt-1" type="number" min="0" required value={form.basePrice} onChange={(e) => setForm({ ...form, basePrice: e.target.value })} /></label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm">Language<input className="input mt-1" required value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} /></label>
              <label className="text-sm">Format<input className="input mt-1" required placeholder="2D / 3D / IMAX" value={form.format} onChange={(e) => setForm({ ...form, format: e.target.value })} /></label>
            </div>

            {editing && (
              <label className="block text-sm">Status
                <select className="input mt-1" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  {SHOW_STATUS.map((s) => <option key={s}>{s}</option>)}
                </select>
                {form.status === 'CANCELLED' && <span className="mt-1 block text-xs text-amber-700">Cancelling a show also cancels all of its bookings and frees the seats.</span>}
              </label>
            )}

            <div className="mt-2 flex justify-end gap-2">
              <button type="button" className="btn-ghost" onClick={() => { setForm(null); setEditing(null); }}>Cancel</button>
              <button className="btn-primary" disabled={busy || !form.screenId}>{busy ? 'Saving…' : editing ? 'Save changes' : 'Schedule'}</button>
            </div>
          </form>
        )}
      </Modal>

      <ConfirmDialog open={!!del} onClose={() => setDel(null)} onConfirm={remove} busy={busy}
        title="Remove show" body="Remove this show? A show that already has bookings can't be deleted - set its status to Cancelled instead." />
    </div>
  );
}
