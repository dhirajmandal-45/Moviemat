// Single mock REST API shared by the customer site and the admin panel.
// Movies, theatres, shows, bookings and users all live in one store, so changes
// made in the admin panel are immediately visible on the customer site and vice versa.
// Swap VITE_USE_MOCK=false in .env to call a real Spring Boot API instead.
import { MOVIES, THEATRES, CITY_AREAS, CITY_STATE, USERS, REVIEWS, buildSeedShows } from './mockData';

const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const seeded = (k, seed) => { if (localStorage.getItem(k) === null) save(k, typeof seed === 'function' ? seed() : seed); return load(k); };
class ApiError extends Error { constructor(status, message) { super(message); this.response = { status, data: { message } }; } }

function buildSeedBookings() {
  const movies = MOVIES.filter((m) => m.status === 'now'); const customers = USERS.filter((u) => u.role === 'CUSTOMER');
  return Array.from({ length: 16 }, (_, i) => {
    const movie = movies[i % movies.length]; const th = THEATRES[i % THEATRES.length]; const user = customers[i % customers.length];
    const seatIds = ['A1', 'A2', 'B3'].slice(0, (i % 3) + 1); const base = 180 + (i % 3) * 20;
    const seats = seatIds.map((id) => ({ id, price: base }));
    const amount = Math.round(seats.reduce((s, x) => s + x.price, 0) + seats.length * 30 * 1.18);
    const dayOffset = -(1 + (i % 18)); const d = new Date(); d.setDate(d.getDate() + dayOffset); const date = d.toLocaleDateString('en-CA');
    return {
      id: `MM${(10000 + i).toString(36).toUpperCase()}`, userId: user.id, userEmail: user.email, userName: user.name,
      movieId: movie.id, theatreId: th.id, date, time: ['10:00 AM', '01:15 PM', '04:30 PM', '07:45 PM'][i % 4],
      seats, amount, status: i % 9 === 0 ? 'CANCELLED' : dayOffset < -2 ? 'COMPLETED' : 'CONFIRMED',
      paymentMethod: ['Card', 'UPI', 'Net Banking', 'Wallet'][i % 4], createdAt: `${date}T1${i % 9}:30:00`,
    };
  });
}
const db = {
  movies: () => seeded('mm_movies', MOVIES),
  theatres: () => seeded('mm_theatres', THEATRES),
  shows: () => seeded('mm_shows', buildSeedShows),
  users: () => seeded('mm_users', USERS),
  bookings: () => seeded('mm_bookings', buildSeedBookings),
};
const nextNumId = (list) => Math.max(0, ...list.map((x) => Number(x.id) || 0)) + 1;
const nextPrefixedId = (list, prefix) => prefix + (Math.max(0, ...list.map((x) => Number(String(x.id).replace(prefix, '')) || 0)) + 1);

const authedUser = (cfg) => {
  const t = cfg.headers?.Authorization?.replace('Bearer ', '');
  const email = t && atob(t);
  const u = db.users().find((x) => x.email === email);
  if (!u) throw new ApiError(401, 'Please log in to continue');
  return u;
};
const requireAdmin = (cfg) => { const u = authedUser(cfg); if (u.role !== 'ADMIN') throw new ApiError(403, 'Admin access required'); return u; };
const safeUser = (u) => { const { password, ...rest } = u; return rest; };

const showWithJoins = (s) => ({ ...s, movie: db.movies().find((m) => m.id === s.movieId), theatre: db.theatres().find((t) => t.id === s.theatreId) });
const seatsForShow = (showId) => {
  const show = db.shows().find((s) => s.id === showId); if (!show) throw new ApiError(404, 'Show not found');
  const soldFromBookings = new Set(db.bookings().filter((b) => b.showId === showId && b.status !== 'CANCELLED').flatMap((b) => b.seats.map((x) => x.id)));
  const h = [...showId].reduce((s, ch) => s + ch.charCodeAt(0), 0);
  return 'ABCDE'.split('').flatMap((row, r) => [1, 2, 3, 4, 5, 6].map((n) => {
    const premium = r >= 3; const id = `${row}${n}`;
    return { id, row, number: n, type: premium ? 'PREMIUM' : 'REGULAR', price: premium ? Math.round(show.price * 1.5) : show.price, sold: soldFromBookings.has(id) || (h + r * 7 + n * 3) % 5 === 0 };
  }));
};
const toCustomerBooking = (b) => ({ id: b.id, movie: db.movies().find((m) => m.id === b.movieId), theatre: db.theatres().find((t) => t.id === b.theatreId), date: b.date, time: b.time, seats: b.seats.map((s) => s.id), amount: b.amount, status: b.status, paymentMethod: b.paymentMethod });
const toAdminBooking = (b) => { const m = db.movies().find((x) => x.id === b.movieId); const th = db.theatres().find((x) => x.id === b.theatreId);
  return { id: b.id, movie: m?.title, movieId: b.movieId, theatre: th?.name, city: th?.city, user: b.userName, email: b.userEmail, date: b.date, time: b.time, seats: b.seats.map((s) => s.id), amount: b.amount, status: b.status, createdAt: b.createdAt }; };

const route = (cfg) => {
  const method = cfg.method.toUpperCase(); const url = cfg.url; const p = cfg.params || {};
  const body = cfg.data ? JSON.parse(cfg.data) : {}; let mt;

  // ---- Auth (shared: works for both admin and customer accounts) ----
  if (method === 'POST' && url === '/api/auth/signup') {
    const users = db.users(); if (users.some((u) => u.email === body.email)) throw new ApiError(409, 'Email already registered');
    const u = { id: nextNumId(users), name: body.name, email: body.email, phone: body.phone, city: body.city || 'Jaipur', password: body.password, role: 'CUSTOMER', status: 'ACTIVE', joined: new Date().toLocaleDateString('en-CA') };
    save('mm_users', [...users, u]); return { token: btoa(u.email), user: safeUser(u) };
  }
  if (method === 'POST' && url === '/api/auth/login') {
    const u = db.users().find((x) => x.email === body.email && x.password === body.password);
    if (!u) throw new ApiError(401, 'Invalid email or password');
    if (u.status === 'BLOCKED') throw new ApiError(403, 'This account has been blocked. Contact support.');
    return { token: btoa(u.email), user: safeUser(u) };
  }
  if (method === 'GET' && url === '/api/users/me') return safeUser(authedUser(cfg));

  // ---- Public catalogue ----
  if (method === 'GET' && url === '/api/movies') {
    let l = db.movies(); if (p.status) l = l.filter((x) => x.status === p.status); if (p.q) l = l.filter((x) => x.title.toLowerCase().includes(p.q.toLowerCase())); return l;
  }
  if (method === 'GET' && (mt = url.match(/^\/api\/movies\/(\d+)$/))) { const x = db.movies().find((v) => v.id === +mt[1]); if (!x) throw new ApiError(404, 'Movie not found'); return x; }
  if (method === 'GET' && (mt = url.match(/^\/api\/movies\/(\d+)\/reviews$/))) return REVIEWS;
  if (method === 'GET' && url === '/api/cities') return Object.keys(CITY_AREAS).map((name) => ({ name, state: CITY_STATE[name], areas: CITY_AREAS[name] }));
  if (method === 'GET' && url === '/api/theatres') { let l = db.theatres(); if (p.city) l = l.filter((t) => t.city === p.city); return l; }

  // ---- Shows (customer booking flow) ----
  if (method === 'GET' && url === '/api/shows') {
    const shows = db.shows().filter((s) => (!p.city || db.theatres().find((t) => t.id === s.theatreId)?.city === p.city) && (!p.movieId || s.movieId === Number(p.movieId)) && (!p.date || s.date === p.date));
    const byTheatre = {};
    shows.forEach((s) => { (byTheatre[s.theatreId] ||= []).push({ id: s.id, time: s.time, price: s.price }); });
    return Object.keys(byTheatre).map((tid) => { const th = db.theatres().find((t) => t.id === tid);
      return { ...th, movieCount: new Set(db.shows().filter((s) => s.theatreId === tid).map((s) => s.movieId)).size, distance: `${(1.2 + Number(tid.replace('t', '')) * 1.1).toFixed(1)} km`, shows: byTheatre[tid].sort((a, b) => a.time.localeCompare(b.time)) }; });
  }
  if (method === 'GET' && (mt = url.match(/^\/api\/shows\/([^/]+)\/seats$/))) return seatsForShow(mt[1]);
  if (method === 'GET' && (mt = url.match(/^\/api\/shows\/([^/]+)$/))) { const s = db.shows().find((x) => x.id === mt[1]); if (!s) throw new ApiError(404, 'Show not found'); return showWithJoins(s); }

  // ---- Bookings (customer) ----
  if (method === 'POST' && url === '/api/bookings') {
    const u = authedUser(cfg); const show = db.shows().find((s) => s.id === body.showId); if (!show) throw new ApiError(404, 'Show not found');
    const taken = seatsForShow(body.showId);
    if (body.seats.some((s) => taken.find((t) => t.id === s.id)?.sold)) throw new ApiError(409, 'Some seats were just taken. Please pick again.');
    const record = { id: 'MM' + Math.random().toString(36).slice(2, 9).toUpperCase(), userId: u.id, userEmail: u.email, userName: u.name, movieId: show.movieId, theatreId: show.theatreId, showId: show.id, date: show.date, time: show.time, seats: body.seats, amount: body.amount, status: 'CONFIRMED', paymentMethod: body.method, createdAt: new Date().toISOString() };
    save('mm_bookings', [...db.bookings(), record]); return toCustomerBooking(record);
  }
  if (method === 'GET' && url === '/api/bookings') { const u = authedUser(cfg); return db.bookings().filter((b) => b.userEmail === u.email).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map(toCustomerBooking); }

  // ---- Admin: dashboard stats ----
  if (method === 'GET' && url === '/api/admin/stats') {
    requireAdmin(cfg); const b = db.bookings().filter((x) => x.status !== 'CANCELLED');
    const revenue = b.reduce((s, x) => s + x.amount, 0);
    const byDay = {}; b.forEach((x) => { byDay[x.date] = (byDay[x.date] || 0) + x.amount; });
    const revenueSeries = Object.entries(byDay).sort(([a], [b2]) => a.localeCompare(b2)).map(([date, amount]) => ({ date: date.slice(5), amount }));
    const byGenre = {}; db.movies().forEach((m) => { byGenre[m.genre] = (byGenre[m.genre] || 0) + 1; });
    const genreSeries = Object.entries(byGenre).map(([name, value]) => ({ name, value }));
    const byMovie = {}; b.forEach((x) => { const t = db.movies().find((m) => m.id === x.movieId)?.title || 'Unknown'; byMovie[t] = (byMovie[t] || 0) + x.seats.length; });
    const topMovies = Object.entries(byMovie).sort((a, c) => c[1] - a[1]).slice(0, 5).map(([name, tickets]) => ({ name, tickets }));
    return { totalRevenue: revenue, totalBookings: b.length, activeMovies: db.movies().filter((m) => m.status === 'now').length, totalUsers: db.users().filter((u) => u.role === 'CUSTOMER').length, totalTheatres: db.theatres().length, cancelRate: Math.round((db.bookings().filter((x) => x.status === 'CANCELLED').length / (db.bookings().length || 1)) * 100), revenueSeries, genreSeries, topMovies };
  }

  // ---- Admin: movies CRUD ----
  if (method === 'GET' && url === '/api/admin/movies') { requireAdmin(cfg); let l = db.movies(); if (p.status) l = l.filter((x) => x.status === p.status); if (p.q) l = l.filter((x) => x.title.toLowerCase().includes(p.q.toLowerCase())); return l; }
  if (method === 'POST' && url === '/api/admin/movies') { requireAdmin(cfg); const l = db.movies(); const m = { ...body, id: nextNumId(l) }; save('mm_movies', [m, ...l]); return m; }
  if (method === 'PUT' && (mt = url.match(/^\/api\/admin\/movies\/(\d+)$/))) { requireAdmin(cfg); const l = db.movies().map((m) => (m.id === +mt[1] ? { ...m, ...body, id: m.id } : m)); save('mm_movies', l); return l.find((m) => m.id === +mt[1]); }
  if (method === 'DELETE' && (mt = url.match(/^\/api\/admin\/movies\/(\d+)$/))) { requireAdmin(cfg); save('mm_movies', db.movies().filter((m) => m.id !== +mt[1])); return { ok: true }; }

  // ---- Admin: theatres CRUD ----
  if (method === 'GET' && url === '/api/admin/theatres') { requireAdmin(cfg); let l = db.theatres(); if (p.city) l = l.filter((t) => t.city === p.city); return l; }
  if (method === 'POST' && url === '/api/admin/theatres') { requireAdmin(cfg); const l = db.theatres(); const t = { ...body, id: nextPrefixedId(l, 't') }; save('mm_theatres', [t, ...l]); return t; }
  if (method === 'PUT' && (mt = url.match(/^\/api\/admin\/theatres\/([^/]+)$/))) { requireAdmin(cfg); const l = db.theatres().map((t) => (t.id === mt[1] ? { ...t, ...body, id: t.id } : t)); save('mm_theatres', l); return l.find((t) => t.id === mt[1]); }
  if (method === 'DELETE' && (mt = url.match(/^\/api\/admin\/theatres\/([^/]+)$/))) { requireAdmin(cfg); save('mm_theatres', db.theatres().filter((t) => t.id !== mt[1])); return { ok: true }; }

  // ---- Admin: shows CRUD ----
  if (method === 'GET' && url === '/api/admin/shows') { requireAdmin(cfg); const mv = db.movies(); const th = db.theatres(); return db.shows().map((s) => ({ ...s, movieTitle: mv.find((m) => m.id === s.movieId)?.title, theatreName: th.find((t) => t.id === s.theatreId)?.name, city: th.find((t) => t.id === s.theatreId)?.city })); }
  if (method === 'POST' && url === '/api/admin/shows') { requireAdmin(cfg); const l = db.shows(); const s = { ...body, id: nextPrefixedId(l, 's') }; save('mm_shows', [s, ...l]); return s; }
  if (method === 'DELETE' && (mt = url.match(/^\/api\/admin\/shows\/([^/]+)$/))) { requireAdmin(cfg); save('mm_shows', db.shows().filter((s) => s.id !== mt[1])); return { ok: true }; }

  // ---- Admin: bookings & users ----
  if (method === 'GET' && url === '/api/admin/bookings') { requireAdmin(cfg); let l = db.bookings(); if (p.status) l = l.filter((b) => b.status === p.status);
    let out = l.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map(toAdminBooking);
    if (p.q) { const q = p.q.toLowerCase(); out = out.filter((b) => [b.id, b.movie, b.user, b.email].join(' ').toLowerCase().includes(q)); } return out; }
  if (method === 'PUT' && (mt = url.match(/^\/api\/admin\/bookings\/([^/]+)$/))) { requireAdmin(cfg); const l = db.bookings().map((b) => (b.id === mt[1] ? { ...b, ...body } : b)); save('mm_bookings', l); return toAdminBooking(l.find((b) => b.id === mt[1])); }
  if (method === 'GET' && url === '/api/admin/users') { requireAdmin(cfg); let l = db.users().filter((u) => u.role === 'CUSTOMER').map(safeUser); if (p.q) { const q = p.q.toLowerCase(); l = l.filter((u) => [u.name, u.email].join(' ').toLowerCase().includes(q)); } return l; }
  if (method === 'PUT' && (mt = url.match(/^\/api\/admin\/users\/(\d+)$/))) { requireAdmin(cfg); const l = db.users().map((u) => (u.id === +mt[1] ? { ...u, ...body } : u)); save('mm_users', l); return safeUser(l.find((u) => u.id === +mt[1])); }

  throw new ApiError(404, 'Endpoint not found');
};
export const mockAdapter = (config) => new Promise((resolve, reject) => setTimeout(() => {
  try { resolve({ data: route(config), status: 200, statusText: 'OK', headers: {}, config }); } catch (e) { reject(e); }
}, 280));
