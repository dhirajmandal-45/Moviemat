import axios from 'axios';
import { mockAdapter } from './mockServer';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
});

if (import.meta.env.VITE_USE_MOCK === 'true') {
  http.defaults.adapter = mockAdapter;
}

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('mm_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only treat 401 as "session expired" when we actually had a session
    if (error?.response?.status === 401 && localStorage.getItem('mm_token')) {
      localStorage.removeItem('mm_token');
      localStorage.removeItem('mm_user');
      window.dispatchEvent(new Event('mm:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default http;
