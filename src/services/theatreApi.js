import http from './http';

const normalizeTheatre = (t) => ({
  ...t,
  city: t.city || t.cityName || '',
  cityId: t.cityId ?? t.city?.id,
  area: t.area || (t.address ? String(t.address).split(',')[0].trim() : ''),
  facilities: Array.isArray(t.facilities) ? t.facilities : (t.facilities ? String(t.facilities).split(',').map((x) => x.trim()).filter(Boolean) : []),
  screens: Number(t.screens || t.screenCount || 0),
  distance: t.distance || '',
});

export const theatreApi = {
  cities: () => http.get('/api/cities').then((r) => r.data || []),
  list: (params) => http.get('/api/theatres', { params }).then((r) => (r.data || []).map(normalizeTheatre)),
};

const resolveCityId = async (body) => {
  if (body.cityId != null && body.cityId !== '') return Number(body.cityId);
  const cities = await http.get('/api/admin/cities').then((r) => r.data || []);
  const city = cities.find((c) => c.name === body.city || c.id === body.city);
  if (!city?.id) throw new Error('Please select a valid city');
  return Number(city.id);
};

const toBackendTheatre = async (body) => ({
  name: body.name,
  cityId: await resolveCityId(body),
  address: body.address,
  facilities: Array.isArray(body.facilities) ? body.facilities.join(', ') : body.facilities,
  cancellationPolicy: body.cancellationPolicy || undefined,
  screens: body.screens ? Number(body.screens) : undefined,
  active: body.active ?? true,
});

export const adminTheatreApi = {
  list: (params) => http.get('/api/admin/theatres', { params }).then((r) => (r.data || []).map(normalizeTheatre)),
  create: async (body) => http.post('/api/admin/theatres', await toBackendTheatre(body)).then((r) => normalizeTheatre(r.data)),
  update: async (id, body) => http.put(`/api/admin/theatres/${id}`, await toBackendTheatre(body)).then((r) => normalizeTheatre(r.data)),
  remove: (id) => http.delete(`/api/admin/theatres/${id}`).then((r) => r.data),
};

export const adminCityApi = {
  list: () => http.get('/api/admin/cities').then((r) => r.data || []),
  create: (body) => http.post('/api/admin/cities', body).then((r) => r.data),
  update: (id, body) => http.put(`/api/admin/cities/${id}`, body).then((r) => r.data),
  remove: (id) => http.delete(`/api/admin/cities/${id}`).then((r) => r.data),
};
