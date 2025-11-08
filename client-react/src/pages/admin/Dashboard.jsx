import React, { useEffect, useState } from 'react';
import { reportService } from '../../services/reportService';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [pitchUsage, setPitchUsage] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Get dashboard stats
      const statsData = await reportService.getDashboardStats();
      setStats(statsData.data);

      // Get revenue last 7 days
      const toDate = new Date().toISOString().split('T')[0];
      const fromDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const revenueReport = await reportService.getRevenueReport(fromDate, toDate);
      setRevenueData(revenueReport.data);

      // Get pitch usage
      const usageData = await reportService.getPitchUsageStats();
      setPitchUsage(usageData.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8">Đang tải...</div>;
  }

  // Chart data
  const revenueChartData = {
    labels: revenueData.map(d => d.date),
    datasets: [{
      label: 'Doanh thu (VNĐ)',
      data: revenueData.map(d => d.revenue),
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      tension: 0.4,
    }]
  };

  const pitchUsageChartData = {
    labels: pitchUsage.map(p => p.name),
    datasets: [{
      label: 'Doanh thu (VNĐ)',
      data: pitchUsage.map(p => p.total_revenue),
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(251, 146, 60, 0.8)',
        'rgba(168, 85, 247, 0.8)',
      ],
    }]
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-gray-600 mb-2">Doanh thu hôm nay</div>
          <div className="text-3xl font-bold text-green-600">
            {stats.todayRevenue.toLocaleString('vi-VN')} đ
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-gray-600 mb-2">Đơn đặt hôm nay</div>
          <div className="text-3xl font-bold text-blue-600">
            {stats.todayBookings}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-gray-600 mb-2">Khách mới tháng này</div>
          <div className="text-3xl font-bold text-purple-600">
            {stats.newCustomers}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-gray-600 mb-2">Tỷ lệ sử dụng</div>
          <div className="text-3xl font-bold text-orange-600">
            {stats.usageRate.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Doanh thu 7 ngày qua</h2>
          <Line data={revenueChartData} options={{ responsive: true }} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Doanh thu theo sân</h2>
          <Doughnut data={pitchUsageChartData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
