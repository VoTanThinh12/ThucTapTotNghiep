const reportingService = require('../services/reportingService');

exports.getDashboardStats = async (req, res) => {
  try {
    const stats = await reportingService.getDashboardStats();
    res.json({ data: stats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRevenueReport = async (req, res) => {
  try {
    const { fromDate, toDate, pitchId } = req.query;
    
    if (!fromDate || !toDate) {
      return res.status(400).json({ message: 'Thiếu thông tin ngày' });
    }
    
    const data = await reportingService.getRevenueByDate(fromDate, toDate, pitchId);
    res.json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPitchUsageStats = async (req, res) => {
  try {
    const data = await reportingService.getPitchUsageStats();
    res.json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTopCustomers = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const data = await reportingService.getTopCustomers(parseInt(limit));
    res.json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.exportReport = async (req, res) => {
  try {
    const { type, fromDate, toDate } = req.query;
    
    let data = [];
    let filename = '';
    
    if (type === 'revenue') {
      data = await reportingService.getRevenueByDate(fromDate, toDate);
      filename = `revenue_${fromDate}_${toDate}.csv`;
    } else if (type === 'usage') {
      data = await reportingService.getPitchUsageStats();
      filename = 'pitch_usage.csv';
    } else if (type === 'customers') {
      data = await reportingService.getTopCustomers(100);
      filename = 'top_customers.csv';
    }
    
    const csv = reportingService.exportToCSV(data, filename);
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
