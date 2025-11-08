import api from './api';

const bookingService = {
  getAllBookings: async (params = {}) => {
    return await api.get('/bookings', { params });
  },

  getMyBookings: async (params = {}) => {
    return await api.get('/bookings/my-bookings', { params });
  },

  getBookingById: async (id) => {
    return await api.get(`/bookings/${id}`);
  },

  createBooking: async (data) => {
    return await api.post('/bookings', data);
  },

  updateBooking: async (id, data) => {
    return await api.put(`/bookings/${id}`, data);
  },

  cancelBooking: async (id) => {
    return await api.post(`/bookings/${id}/cancel`);
  },

  getBookingStats: async (params = {}) => {
    return await api.get('/bookings/stats', { params });
  }
};

export default bookingService;
