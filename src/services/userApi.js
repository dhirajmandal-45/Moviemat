import http from './http';

const normalizeUser = (u) => ({
  ...u,
  status: u.status || (u.active === false ? 'BLOCKED' : 'ACTIVE'),
  joined: u.joined || u.createdAt,
});

export const adminUserApi = {
  list: (params) => http.get('/api/admin/users', { params }).then((r) => (r.data || []).map(normalizeUser)),
  update: (id, body) => http.put(`/api/admin/users/${id}`, { active: body.status ? body.status === 'ACTIVE' : body.active }).then((r) => normalizeUser(r.data)),
};
