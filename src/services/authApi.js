import http from './http';

const normalizeAuth = (data) => {
  if (!data) return data;
  if (data.user) return data;
  return {
    token: data.token,
    user: {
      id: data.userId,
      name: data.name,
      email: data.email,
      role: data.role,
    },
    role: data.role,
  };
};

export const authApi = {
  login: (body) => http.post('/api/auth/login', body).then((r) => normalizeAuth(r.data)),
  signup: (body) => http.post('/api/auth/signup', body).then((r) => normalizeAuth(r.data)),
  me: () => http.get('/api/users/me').then((r) => r.data),
};
