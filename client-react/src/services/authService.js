import api from './api';

const authService = {
  register: async (data) => {
    const response = await api.post('/auth/register', data);
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getProfile: async () => {
    return await api.get('/auth/profile');
  },

  updateProfile: async (data) => {
    return await api.put('/auth/profile', data);
  },

  changePassword: async (data) => {
    return await api.post('/auth/change-password', data);
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user?.role === 'admin';
  }
};

export default authService;
