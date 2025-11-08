import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import pitchService from '../../services/pitchService';
import PitchCard from '../../components/client/PitchCard';
import Loading from '../../components/common/Loading';

const Home = () => {
  const [pitches, setPitches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    search: ''
  });

  useEffect(() => {
    loadPitches();
  }, [filters]);

  const loadPitches = async () => {
    try {
      setLoading(true);
      const data = await pitchService.getAllPitches(filters);
      setPitches(data.pitches || []);
    } catch (error) {
      toast.error('Không thể tải danh sách sân');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Đặt Sân Bóng Mini
          </h1>
          <p className="text-xl text-primary-100">
            Nhanh chóng - Tiện lợi - Uy tín
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-8">
        <div className="card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Tìm kiếm sân theo tên, địa chỉ..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="input"
              />
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="input"
              >
                <option value="">Tất cả loại sân</option>
                <option value="5v5">Sân 5 người</option>
                <option value="7v7">Sân 7 người</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pitches Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Danh sách sân ({pitches.length})
          </h2>

          {pitches.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Không tìm thấy sân nào</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pitches.map((pitch) => (
                <PitchCard key={pitch.id} pitch={pitch} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
