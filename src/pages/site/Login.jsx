import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
export function AuthShell({ title, sub, children, foot }) {
  return (<div className="grid min-h-[80vh] place-items-center px-4 py-8"><div className="card w-full max-w-md p-6 sm:p-8">
    <p className="text-xl font-extrabold">MOVIE<span className="text-brand">MAT</span></p><h1 className="mt-4 text-2xl font-bold">{title}</h1><p className="text-sm text-slate-500">{sub}</p>{children}<p className="mt-5 text-center text-sm text-slate-500">{foot}</p></div></div>);
}
export default function Login() {
  const { user, login, isAdmin } = useAuth(); const nav = useNavigate(); const from = useLocation().state?.from;
  const [f, setF] = useState({ email: '', password: '' }); const [busy, setBusy] = useState(false);
  if (user) return <Navigate to={isAdmin ? '/admin' : (from || '/')} replace />;
  const submit = async (e) => { e.preventDefault(); setBusy(true);
    try {
      const u = await login(f); toast.success(`Welcome back, ${u.name.split(' ')[0]}`);
      // Admin accounts always land in the admin console; customer accounts go back where they came from (or home).
      nav(u.role === 'ADMIN' ? '/admin' : (from || '/'), { replace: true });
    } catch (err) { toast.error(err?.response?.data?.message || 'Login failed'); setBusy(false); } };
  return (
    <AuthShell title="Welcome back" sub="Log in to book tickets, manage the catalogue, or view your dashboard." foot={<>New here? <Link className="font-semibold text-brand" to="/signup">Create an account</Link></>}>
      <form onSubmit={submit} className="mt-5 space-y-3">
        <label className="block text-sm">Email<input className="input mt-1" type="email" required autoComplete="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></label>
        <label className="block text-sm">Password<input className="input mt-1" type="password" required minLength={6} autoComplete="current-password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /></label>
        <button className="btn-primary w-full" disabled={busy}>{busy ? 'Logging in…' : 'Log in'}</button></form>
    </AuthShell>
  );
}
