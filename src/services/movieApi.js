import http from './http';

const statusToBackend = { now: 'NOW_SHOWING', soon: 'UPCOMING', ended: 'ENDED' };
const statusToUi = { NOW_SHOWING: 'now', UPCOMING: 'soon', ENDED: 'ended' };

const durationLabel = (minutes) => {
  const n = Number(minutes);
  if (!Number.isFinite(n)) return '';
  const h = Math.floor(n / 60); const m = n % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
};

export const normalizeMovie = (m) => ({
  ...m,
  status: statusToUi[m.status] || m.status,
  rating: Number(m.rating || 0),
  duration: m.duration || durationLabel(m.durationMinutes),
  release: m.release || m.releaseDate,
  posterUrl: m.posterUrl || m.poster_url || '',
  color: m.color || '#5b3df5',
  cast: Array.isArray(m.cast) ? m.cast : (m.cast ? String(m.cast).split(',').map((x) => x.trim()).filter(Boolean) : []),
  formats: Array.isArray(m.formats) && m.formats.length ? m.formats : (m.format ? [m.format] : []),
});

const parseDurationMinutes = (value) => {
  if (value == null || value === '') return 0;
  if (typeof value === 'number') return value;
  const text = String(value).trim();
  if (/^\d+$/.test(text)) return Number(text);
  const m = text.match(/(?:(\d+)\s*h)?\s*(?:(\d+)\s*m)?/i);
  if (!m) return 0;
  return Number(m[1] || 0) * 60 + Number(m[2] || 0);
};

const toBackendMovie = (body) => ({
  title: body.title,
  description: body.description,
  durationMinutes: parseDurationMinutes(body.durationMinutes ?? body.duration),
  language: body.language,
  genre: body.genre,
  releaseDate: body.releaseDate ?? body.release,
  posterUrl: body.posterUrl ?? undefined,
  bannerUrl: body.bannerUrl ?? undefined,
  trailerUrl: body.trailerUrl ?? undefined,
  color: body.color || undefined,
  status: statusToBackend[body.status] || body.status,
  active: body.active ?? true,
  rating: Number(body.rating || 0),
  director: body.director ?? undefined,
  cast: Array.isArray(body.cast) ? body.cast.join(', ') : (body.cast ?? undefined),
});

export const movieApi = {
  list: (params = {}) => {
    const p = { ...params, status: statusToBackend[params.status] || params.status };
    return http.get('/api/movies', { params: p }).then((r) => (r.data || []).map(normalizeMovie));
  },
  get: (id) => http.get(`/api/movies/${id}`).then((r) => normalizeMovie(r.data)),
  reviews: (id) => http.get(`/api/movies/${id}/reviews`).then((r) => r.data || []),
  addReview: (id, body) => http.post(`/api/movies/${id}/reviews`, body).then((r) => r.data),
};

export const adminMovieApi = {
  list: (params = {}) => {
    const p = { ...params, status: statusToBackend[params.status] || params.status };
    return http.get('/api/admin/movies', { params: p }).then((r) => (r.data || []).map(normalizeMovie));
  },
  create: (body) => http.post('/api/admin/movies', toBackendMovie(body)).then((r) => normalizeMovie(r.data)),
  update: (id, body) => http.put(`/api/admin/movies/${id}`, toBackendMovie(body)).then((r) => normalizeMovie(r.data)),
  remove: (id) => http.delete(`/api/admin/movies/${id}`).then((r) => r.data),
  uploadPoster: (id, file) => {
    const form = new FormData(); form.append('file', file);
    return http.post(`/api/admin/movies/${id}/poster`, form, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => normalizeMovie(r.data));
  },
};
