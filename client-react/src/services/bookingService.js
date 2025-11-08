import api from './api';

export const bookingService = {
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  getAllBookings: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/bookings?${params}`);
    return response.data;
  },

  getBookingById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  updateBookingStatus: async (id, status) => {
    const response = await api.put(`/bookings/${id}/status`, { status });
    return response.data;
  },

  checkAvailability: async (pitchId, date, startTime, duration) => {
    const response = await api.get('/bookings/check-availability', {
      params: { pitchId, date, startTime, duration }
    });
    return response.data;
  },

  calculatePrice: async (pitchId, startTime, duration) => {
    const response = await api.get('/bookings/calculate-price', {
      params: { pitchId, startTime, duration }
    });
    return response.data;
  },
};
