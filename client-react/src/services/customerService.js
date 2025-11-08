import api from './api';

const customerService = {
  getAllCustomers: async (params = {}) => {
    return await api.get('/customers', { params });
  },

  getCustomerById: async (id) => {
    return await api.get(`/customers/${id}`);
  },

  updateCustomer: async (id, data) => {
    return await api.put(`/customers/${id}`, data);
  },

  getCustomerStats: async () => {
    return await api.get('/customers/stats');
  }
};

export default customerService;
