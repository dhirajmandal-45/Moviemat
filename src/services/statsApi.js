import http from './http';

export const statsApi = {
  get: async () => {
    const [bookingsRes, moviesRes, theatresRes, usersRes] = await Promise.all([
      http.get('/api/admin/bookings'),
      http.get('/api/admin/movies'),
      http.get('/api/admin/theatres'),
      http.get('/api/admin/users'),
    ]);
    const bookings = bookingsRes.data || [];
    const movies = moviesRes.data || [];
    const theatres = theatresRes.data || [];
    const users = usersRes.data || [];
    const valid = bookings.filter((b) => b.status === 'CONFIRMED' || b.status === 'COMPLETED');
    const totalRevenue = valid.reduce((sum, b) => sum + Number(b.totalAmount ?? b.amount ?? 0), 0);
    const byDate = {};
    valid.forEach((b) => { const d = b.showDate || b.date; if (d) byDate[d] = (byDate[d] || 0) + Number(b.totalAmount ?? b.amount ?? 0); });
    const byGenre = {};
    movies.forEach((m) => { const g = m.genre || 'Other'; byGenre[g] = (byGenre[g] || 0) + 1; });
    const byMovie = {};
    valid.forEach((b) => { const name = b.movieTitle || b.movie?.title || 'Unknown'; byMovie[name] = (byMovie[name] || 0) + Number(b.totalSeats || (b.seats || []).length || 0); });
    return {
      totalRevenue,
      totalBookings: valid.length,
      activeMovies: movies.filter((m) => m.status === 'NOW_SHOWING' && m.active !== false).length,
      totalUsers: users.length,
      totalTheatres: theatres.length,
      cancelRate: Math.round((bookings.filter((b) => b.status === 'CANCELLED').length / (bookings.length || 1)) * 100),
      revenueSeries: Object.entries(byDate).sort(([a], [b]) => a.localeCompare(b)).map(([date, amount]) => ({ date: date.slice(5), amount })),
      genreSeries: Object.entries(byGenre).map(([name, value]) => ({ name, value })),
      topMovies: Object.entries(byMovie).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, tickets]) => ({ name, tickets })),
    };
  },
};
