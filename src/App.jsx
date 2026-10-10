import { Routes, Route, Link } from 'react-router-dom';
import { RequireAuth, RequireAdmin } from './components/shared/RouteGuards';
import SiteLayout from './layouts/SiteLayout';
import AdminLayout from './layouts/AdminLayout';
// customer site
import Home from './pages/site/Home';
import Movies from './pages/site/Movies';
import MovieDetails from './pages/site/MovieDetails';
import Location from './pages/site/Location';
import Theatres from './pages/site/Theatres';
import SeatSelection from './pages/site/SeatSelection';
import BookingSummary from './pages/site/BookingSummary';
import Payment from './pages/site/Payment';
import BookingSuccess from './pages/site/BookingSuccess';
import Bookings from './pages/site/Bookings';
import Profile from './pages/site/Profile';
import Login from './pages/site/Login';
import Signup from './pages/site/Signup';
// admin panel
import Dashboard from './pages/admin/Dashboard';
import AdminMovies from './pages/admin/Movies';
import AdminTheatres from './pages/admin/Theatres';
import AdminShows from './pages/admin/Shows';
import AdminBookings from './pages/admin/Bookings';
import AdminUsers from './pages/admin/Users';
const NotFound = () => <div className="py-24 text-center"><p className="text-2xl font-bold">Page not found</p><Link className="btn-primary mt-4 inline-flex" to="/">Go home</Link></div>;
export default function App() {
  return (
    <Routes>
      {/* Admin console: role ADMIN only */}
      <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
        <Route index element={<Dashboard />} />
        <Route path="movies" element={<AdminMovies />} />
        <Route path="theatres" element={<AdminTheatres />} />
        <Route path="shows" element={<AdminShows />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>
      {/* Customer site */}
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/location" element={<Location />} />
        <Route path="/theatres" element={<Theatres />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/booking/summary" element={<RequireAuth><BookingSummary /></RequireAuth>} />
        <Route path="/booking/:showId/seats" element={<RequireAuth><SeatSelection /></RequireAuth>} />
        <Route path="/payment" element={<RequireAuth><Payment /></RequireAuth>} />
        <Route path="/booking-success" element={<RequireAuth><BookingSuccess /></RequireAuth>} />
        <Route path="/bookings" element={<RequireAuth><Bookings /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
