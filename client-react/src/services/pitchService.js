import api from './api';

export const pitchService = {
  getAllPitches: async () => {
    const response = await api.get('/pitches');
    return response.data;
  },

  getPitchById: async (id) => {
    const response = await api.get(`/pitches/${id}`);
    return response.data;
  },

  createPitch: async (pitchData) => {
    const response = await api.post('/pitches', pitchData);
    return response.data;
  },

  updatePitch: async (id, pitchData) => {
    const response = await api.put(`/pitches/${id}`, pitchData);
    return response.data;
  },

  deletePitch: async (id) => {
    const response = await api.delete(`/pitches/${id}`);
    return response.data;
  },
};
