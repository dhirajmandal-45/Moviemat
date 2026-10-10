import { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../services/authApi';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mm_user')) || null; } catch { return null; }
  });
  const [loading, setLoading] = useState(!!localStorage.getItem('mm_token'));

  useEffect(() => {
    if (!localStorage.getItem('mm_token')) { setLoading(false); return; }
    authApi.me()
      .then((u) => { setUser(u); localStorage.setItem('mm_user', JSON.stringify(u)); })
      .catch(() => { localStorage.removeItem('mm_token'); localStorage.removeItem('mm_user'); setUser(null); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const onExpired = () => setUser(null);
    window.addEventListener('mm:unauthorized', onExpired);
    return () => window.removeEventListener('mm:unauthorized', onExpired);
  }, []);

  const finish = ({ token, user: u }) => {
    if (token) localStorage.setItem('mm_token', token);
    if (u) localStorage.setItem('mm_user', JSON.stringify(u));
    setUser(u || null);
    return u;
  };

  const login = (body) => authApi.login(body).then(finish);
  const signup = (body) => authApi.signup(body).then((result) => {
    // The real backend creates USER successfully but intentionally does not issue a signup token.
    if (result?.token) return finish(result);
    return result?.user || result;
  });
  const logout = () => { localStorage.removeItem('mm_token'); localStorage.removeItem('mm_user'); setUser(null); };
  const isAdmin = user?.role === 'ADMIN';

  return <Ctx.Provider value={{ user, loading, login, signup, logout, isAdmin }}>{children}</Ctx.Provider>;
}
