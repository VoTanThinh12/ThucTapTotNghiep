import api from './api';

const pitchService = {
  getAllPitches: async (params = {}) => {
    return await api.get('/pitches', { params });
  },

  getPitchById: async (id) => {
    return await api.get(`/pitches/${id}`);
  },

  createPitch: async (data) => {
    return await api.post('/pitches', data);
  },

  updatePitch: async (id, data) => {
    return await api.put(`/pitches/${id}`, data);
  },

  deletePitch: async (id) => {
    return await api.delete(`/pitches/${id}`);
  },

  // Lấy khùng gió từ một sân
  getPitchTimeSlots: async (pitchId, date = null) => {
    const params = { pitch_id: pitchId };
    if (date) {
      params.date = date;
    }
    return await api.get('/pitches/time-slots', { params });
  },

  getAvailableSlots: async (pitchId, date) => {
    return await api.get('/pitches/available-slots', {
      params: { pitch_id: pitchId, date }
    });
  }
};

export default pitchService;
