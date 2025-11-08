import api from './api';

export const reportService = {
  getDashboardStats: async () => {
    const response = await api.get('/reports/dashboard');
    return response.data;
  },

  getRevenueReport: async (fromDate, toDate, pitchId = null) => {
    const response = await api.get('/reports/revenue', {
      params: { fromDate, toDate, pitchId }
    });
    return response.data;
  },

  getPitchUsageStats: async () => {
    const response = await api.get('/reports/pitch-usage');
    return response.data;
  },

  getTopCustomers: async (limit = 10) => {
    const response = await api.get('/reports/top-customers', {
      params: { limit }
    });
    return response.data;
  },

  exportReport: async (type, fromDate, toDate) => {
    const response = await api.get('/reports/export', {
      params: { type, fromDate, toDate },
      responseType: 'blob'
    });
    
    // Download file
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${type}_report.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};
