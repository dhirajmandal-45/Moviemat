import { useState } from 'react';
import toast from 'react-hot-toast';
import useFetch from '../../hooks/useFetch';
import useDebounce from '../../hooks/useDebounce';
import { adminUserApi } from '../../services/userApi';
import DataTable from '../../components/admin/DataTable';
import SearchInput from '../../components/admin/SearchInput';
import Badge from '../../components/admin/Badge';
import { initials, fmtDateShort } from '../../utils/format';
export default function Users() {
  const [q, setQ] = useState(''); const dq = useDebounce(q);
  const { data, loading, error, reload } = useFetch(() => adminUserApi.list({ q: dq }), [dq]);
  const toggle = async (u) => { try { await adminUserApi.update(u.id, { status: u.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE' }); toast.success(`${u.name} ${u.status === 'ACTIVE' ? 'blocked' : 'unblocked'}`); reload(); } catch (err) { toast.error(err?.response?.data?.message || 'Could not update user'); } };
  const columns = [
    { key: 'name', header: 'Customer', render: (u) => (<div className="flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-full bg-brand-soft text-xs font-bold text-brand">{initials(u.name)}</span><div><p className="font-semibold">{u.name}</p><p className="text-xs text-slate-500">{u.email}</p></div></div>) },
    { key: 'role', header: 'Role' }, { key: 'joined', header: 'Joined', render: (u) => fmtDateShort(u.joined) },
    { key: 'status', header: 'Status', render: (u) => <Badge status={u.status} /> },
    { key: 'actions', header: '', render: (u) => u.role === 'ADMIN' ? null : <button className={`text-xs font-semibold hover:underline ${u.status === 'ACTIVE' ? 'text-danger' : 'text-success'}`} onClick={() => toggle(u)}>{u.status === 'ACTIVE' ? 'Block' : 'Unblock'}</button> },
  ];
  return (
    <div className="space-y-4"><SearchInput value={q} onChange={setQ} placeholder="Search users by name or email" />
      <div className="card"><DataTable columns={columns} rows={data} loading={loading} error={error} onRetry={reload} emptyTitle="No users found" emptyHint="Try a different search." /></div></div>
  );
}
