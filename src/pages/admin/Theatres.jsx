import { useState } from 'react';
import { Plus, Pencil, Trash2, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import useFetch from '../../hooks/useFetch';
import { adminTheatreApi, adminCityApi } from '../../services/theatreApi';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const BLANK = { name: '', cityId: '', address: '', screens: 1, facilities: '', active: true };

export default function Theatres() {
  const { data, loading, error, reload } = useFetch(() => adminTheatreApi.list(), []);
  const { data: cities } = useFetch(() => adminCityApi.list(), []);
  const [form, setForm] = useState(null); const [editing, setEditing] = useState(null); const [del, setDel] = useState(null); const [busy, setBusy] = useState(false);

  const openCreate = () => { setEditing(null); setForm({ ...BLANK, cityId: cities?.[0]?.id || '' }); };
  const openEdit = (t) => { setEditing(t); setForm({ ...t, facilities: t.facilities.join(', '), screens: t.screens || 1 }); };

  const save = async (e) => {
    e.preventDefault();
    if (!form.cityId) { toast.error('Please choose a city'); return; }
    setBusy(true);
    const payload = { ...form, cityId: Number(form.cityId), screens: Number(form.screens) || 1, facilities: form.facilities.split(',').map((f) => f.trim()).filter(Boolean) };
    try {
      editing ? await adminTheatreApi.update(editing.id, payload) : await adminTheatreApi.create(payload);
      toast.success(editing ? 'Theatre updated' : 'Theatre added (screens and seats were created automatically)');
      setForm(null); reload();
    } catch (err) { toast.error(err?.response?.data?.message || err?.message || 'Could not save theatre'); } finally { setBusy(false); }
  };
  const remove = async () => {
    setBusy(true);
    try { await adminTheatreApi.remove(del.id); toast.success('Theatre removed'); setDel(null); reload(); }
    catch (err) { toast.error(err?.response?.data?.message || 'Could not remove theatre'); setDel(null); }
    finally { setBusy(false); }
  };

  const columns = [
    { key: 'name', header: 'Theatre', render: (t) => <div><p className="font-semibold">{t.name}</p>{t.active === false && <span className="text-[11px] text-danger">Inactive</span>}</div> },
    { key: 'location', header: 'Location', render: (t) => <span className="flex items-center gap-1 text-slate-500"><MapPin size={13} />{[t.area, t.city].filter(Boolean).join(', ')}</span> },
    { key: 'screens', header: 'Screens' },
    { key: 'facilities', header: 'Facilities', render: (t) => <div className="flex flex-wrap gap-1">{t.facilities.map((f) => <span key={f} className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px]">{f}</span>)}</div> },
    { key: 'actions', header: '', render: (t) => (<div className="flex justify-end gap-1"><button aria-label="Edit" className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-brand" onClick={() => openEdit(t)}><Pencil size={15} /></button><button aria-label="Delete" className="rounded-lg p-1.5 text-slate-500 hover:bg-red-50 hover:text-danger" onClick={() => setDel(t)}><Trash2 size={15} /></button></div>) },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end"><button className="btn-primary" disabled={!cities?.length} onClick={openCreate}><Plus size={16} />Add theatre</button></div>
      <div className="card"><DataTable columns={columns} rows={data} loading={loading} error={error} onRetry={reload} emptyTitle="No theatres yet" emptyHint="Add a theatre to start scheduling shows." /></div>
      <Modal open={!!form} onClose={() => setForm(null)} title={editing ? 'Edit theatre' : 'Add theatre'}>
        {form && <form onSubmit={save} className="space-y-3">
          <label className="block text-sm">Name<input className="input mt-1" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
          <label className="block text-sm">City<select className="input mt-1" required value={form.cityId} onChange={(e) => setForm({ ...form, cityId: e.target.value })}>{(cities || []).map((c) => <option key={c.id} value={c.id}>{c.name}{c.active === false ? ' (inactive)' : ''}</option>)}</select></label>
          <label className="block text-sm">Address <span className="text-slate-400">(start with the area, e.g. "Vaishali Nagar, Jaipur")</span><input className="input mt-1" required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></label>
          <label className="block text-sm">Screens <span className="text-slate-400">(new screens get a default 8 x 10 seat layout; existing screens are never removed)</span><input className="input mt-1" type="number" min="1" max="20" value={form.screens} onChange={(e) => setForm({ ...form, screens: e.target.value })} /></label>
          <label className="block text-sm">Facilities (comma separated)<input className="input mt-1" value={form.facilities} onChange={(e) => setForm({ ...form, facilities: e.target.value })} /></label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.active !== false} onChange={(e) => setForm({ ...form, active: e.target.checked })} />Active (visible to customers)</label>
          <div className="mt-2 flex justify-end gap-2"><button type="button" className="btn-ghost" onClick={() => setForm(null)}>Cancel</button><button className="btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save theatre'}</button></div>
        </form>}
      </Modal>
      <ConfirmDialog open={!!del} onClose={() => setDel(null)} onConfirm={remove} busy={busy} title="Remove theatre" body={`Remove "${del?.name}" together with its screens and seats? A theatre that still has shows can't be removed - mark it inactive instead.`} />
    </div>
  );
}
