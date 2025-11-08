import { create } from 'zustand';
import authService from '../services/authService';

const useAuthStore = create((set) => ({
  user: authService.getCurrentUser(),
  isAuthenticated: authService.isAuthenticated(),
  loading: false,

  login: async (username, password) => {
    set({ loading: true });
    try {
      const response = await authService.login(username, password);
      set({ user: response.user, isAuthenticated: true, loading: false });
      return response;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  register: async (data) => {
    set({ loading: true });
    try {
      const response = await authService.register(data);
      set({ user: response.user, isAuthenticated: true, loading: false });
      return response;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  logout: () => {
    authService.logout();
    set({ user: null, isAuthenticated: false });
  },

  updateUser: (userData) => {
    set({ user: userData });
    localStorage.setItem('user', JSON.stringify(userData));
  }
}));

export default useAuthStore;
