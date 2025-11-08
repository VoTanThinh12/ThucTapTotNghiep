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

  getAvailableSlots: async (pitchId, date) => {
    return await api.get('/pitches/available-slots', {
      params: { pitch_id: pitchId, date }
    });
  }
};

export default pitchService;
