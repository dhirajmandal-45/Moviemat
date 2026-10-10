import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Spinner } from './Loading';
// Any logged-in account (customer or admin) may pass.
export function RequireAuth({ children }) {
  const { user, loading } = useAuth(); const loc = useLocation();
  if (loading) return <Spinner />;
  return user ? children : <Navigate to="/login" state={{ from: loc.pathname + loc.search }} replace />;
}
// Admin panel: only role ADMIN may pass. A logged-in customer is sent home, not to /login.
export function RequireAdmin({ children }) {
  const { user, loading, isAdmin } = useAuth(); const loc = useLocation();
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" state={{ from: loc.pathname + loc.search }} replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}
