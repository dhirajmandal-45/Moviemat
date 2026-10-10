import { Link } from 'react-router-dom';
export default function Footer() {
  return (
    <footer className="mt-16 bg-ink pb-24 pt-10 text-slate-300 md:pb-10">
      <div className="wrap grid gap-8 sm:grid-cols-3">
        <div><p className="text-xl font-bold text-white">MOVIE<span className="text-gold">MAT</span></p><p className="mt-2 text-sm">Pick a movie, pick a seat, walk in.</p></div>
        <div className="text-sm"><p className="mb-2 font-semibold text-white">Explore</p><ul className="space-y-1"><li><Link to="/movies">Movies</Link></li><li><Link to="/theatres">Theatres</Link></li><li><Link to="/location">Cities</Link></li></ul></div>
        <div className="text-sm"><p className="mb-2 font-semibold text-white">Account</p><ul className="space-y-1"><li><Link to="/bookings">My bookings</Link></li><li><Link to="/profile">Profile</Link></li></ul></div>
      </div>
      <p className="wrap mt-8 text-xs text-slate-500">© {new Date().getFullYear()} MOVIEMAT. Demo project.</p>
    </footer>
  );
}
