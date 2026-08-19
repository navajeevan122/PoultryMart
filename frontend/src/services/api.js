import axios from 'axios';

// Support production custom backend domain (VITE_API_URL) or relative /api proxy
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Interceptor to add Authorization Bearer token automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('poultrymart_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
