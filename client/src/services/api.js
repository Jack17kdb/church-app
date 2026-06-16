import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('churchToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('churchToken');
      localStorage.removeItem('churchUser');
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updatePassword: (data) => api.put('/auth/password', data),
  getUsers: () => api.get('/auth/users'),
  createUser: (data) => api.post('/auth/users', data)
};

// Members
export const memberAPI = {
  register: (data) => api.post('/members/register', data),
  getAll: (params) => api.get('/members', { params }),
  getOne: (id) => api.get(`/members/${id}`),
  update: (id, data) => api.put(`/members/${id}`, data),
  delete: (id) => api.delete(`/members/${id}`),
  getStats: () => api.get('/members/stats')
};

// Payments/Donations
export const donationAPI = {
  initiate: (data) => api.post('/payments/stkpush', data),
  getAll: (params) => api.get('/payments', { params }),
  getStats: () => api.get('/payments/stats'),
  checkStatus: (id) => api.get(`/payments/${id}/status`),
  update: (id, data) => api.put(`/payments/${id}`, data)
};

// Settings
export const settingsAPI = {
  get: () => api.get('/settings'),
  update: (data) => api.put('/settings', data),
  addCategory: (category) => api.post('/settings/categories', { category }),
  removeCategory: (category) => api.delete(`/settings/categories/${encodeURIComponent(category)}`),
  addMinistry: (ministry) => api.post('/settings/ministries', { ministry }),
  removeMinistry: (ministry) => api.delete(`/settings/ministries/${encodeURIComponent(ministry)}`)
};

// Notifications
export const notificationAPI = {
  getPublic: () => api.get('/notifications/public'),
  getAll: (params) => api.get('/notifications', { params }),
  create: (data) => api.post('/notifications', data),
  update: (id, data) => api.put(`/notifications/${id}`, data),
  delete: (id) => api.delete(`/notifications/${id}`),
  togglePublish: (id) => api.patch(`/notifications/${id}/publish`)
};

// Reports
export const reportsAPI = {
  donations: (params) => api.get('/reports/donations', { params }),
  members: () => api.get('/reports/members')
};

export default api;
