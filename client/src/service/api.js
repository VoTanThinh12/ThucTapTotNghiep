// ================================================================
// API SERVICE - Gọi API từ backend
// ================================================================

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Tạo axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Thêm token vào mỗi request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Xử lý response lỗi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn, logout
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ================================================================
// AUTH APIs
// ================================================================
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me')
};

// ================================================================
// PITCH APIs
// ================================================================
export const pitchAPI = {
  getAll: (params) => api.get('/pitches', { params }),
  getById: (id) => api.get(`/pitches/${id}`),
  getTimeslots: (id, date) => api.get(`/pitches/${id}/timeslots`, { params: { date } }),
  create: (data) => api.post('/pitches', data),
  update: (id, data) => api.put(`/pitches/${id}`, data),
  delete: (id) => api.delete(`/pitches/${id}`)
};

// ================================================================
// BOOKING APIs
// ================================================================
export const bookingAPI = {
  getAll: () => api.get('/bookings'),
  getById: (id) => api.get(`/bookings/${id}`),
  create: (data) => api.post('/bookings', data),
  updateStatus: (id, status) => api.put(`/bookings/${id}/status`, { status }),
  cancel: (id, reason) => api.put(`/bookings/${id}/cancel`, { cancellation_reason: reason })
};

// ================================================================
// SERVICE APIs
// ================================================================
export const serviceAPI = {
  getAll: () => api.get('/services'),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data)
};

// ================================================================
// USER APIs
// ================================================================
export const userAPI = {
  getAll: () => api.get('/users'),
  updateProfile: (data) => api.put('/users/profile', data)
};

export default api;
