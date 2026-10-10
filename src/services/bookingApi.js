import http from './http';
import { timeLabel, seatLabel } from '../utils/format';

const normalizeBooking = (b) => ({
  ...b,
  id: b.id,
  reference: b.bookingReference || String(b.id),
  movie: b.movie || { id: b.movieId, title: b.movieTitle, posterUrl: b.posterUrl },
  theatre: b.theatre || {
    id: b.theatreId,
    name: b.theatreName,
    city: b.cityName || b.city,
    area: b.theatreArea || '',
    address: b.theatreAddress || '',
  },
  screen: b.screenName || '',
  date: b.date || b.showDate,
  time: timeLabel(b.time || b.startTime),
  seats: Array.isArray(b.seats) ? b.seats.map((s) => seatLabel(s) || s.id) : [],
  amount: Number(b.amount ?? b.totalAmount ?? 0),
  status: b.status,
});

export const bookingApi = {
  create: (payload) => http.post('/api/bookings', {
    showId: Number(payload.showId),
    seatIds: (payload.seats || []).map((s) => Number(s.id ?? s.seatId)),
    customerPhone: payload.customerPhone || undefined,
    paymentMethod: payload.paymentMethod || undefined,
  }).then((r) => normalizeBooking(r.data)),
  mine: () => http.get('/api/bookings').then((r) => (r.data || []).map(normalizeBooking)),
  get: (id) => http.get(`/api/bookings/${id}`).then((r) => normalizeBooking(r.data)),
  cancel: (id) => http.put(`/api/bookings/${id}/cancel`).then((r) => normalizeBooking(r.data)),
};

export const adminBookingApi = {
  list: (params) => http.get('/api/admin/bookings', { params }).then((r) => (r.data || []).map(normalizeBooking)),
  update: (id, body) => http.put(`/api/admin/bookings/${id}/status`, null, { params: { status: body.status } }).then((r) => normalizeBooking(r.data)),
};
