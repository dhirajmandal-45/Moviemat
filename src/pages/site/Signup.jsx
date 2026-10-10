import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { AuthShell } from './Login';
export default function Signup() {
  const { user, signup } = useAuth(); const nav = useNavigate();
  const [f, setF] = useState({ name: '', email: '', password: '' }); const [busy, setBusy] = useState(false);
  if (user) return <Navigate to="/" replace />;
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async (e) => { e.preventDefault(); setBusy(true);
    try { await signup(f); toast.success('Account created. Please log in.'); nav('/login', { replace: true }); } catch (err) { toast.error(err?.response?.data?.message || 'Signup failed'); setBusy(false); } };
  return (
    <AuthShell title="Create your account" sub="It takes less than a minute." foot={<>Already registered? <Link className="font-semibold text-brand" to="/login">Log in</Link></>}>
      <form onSubmit={submit} className="mt-5 space-y-3">
        <label className="block text-sm">Full name<input className="input mt-1" required value={f.name} onChange={set('name')} autoComplete="name" /></label>
        <label className="block text-sm">Email<input className="input mt-1" type="email" required value={f.email} onChange={set('email')} autoComplete="email" /></label>
        <label className="block text-sm">Password<input className="input mt-1" type="password" required minLength={6} value={f.password} onChange={set('password')} autoComplete="new-password" /></label>
        <button className="btn-primary w-full" disabled={busy}>{busy ? 'Creating…' : 'Sign up'}</button></form></AuthShell>
  );
}
