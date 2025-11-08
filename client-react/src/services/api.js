import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: parseInt(process.env.REACT_APP_API_TIMEOUT) || 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - Add token to headers
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

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // Handle 401 - Unauthorized
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      
      // Return error message from server
      return Promise.reject(error.response.data);
    } else if (error.request) {
      return Promise.reject({ message: 'Không thể kết nối đến server' });
    } else {
      return Promise.reject({ message: error.message });
    }
  }
);

export default api;
