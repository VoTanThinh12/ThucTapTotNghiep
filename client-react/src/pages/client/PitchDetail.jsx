import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pitchService } from '../../services/pitchService';
import { toast } from 'react-toastify';

const PitchDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pitch, setPitch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [priceSlots, setPriceSlots] = useState([]);

  useEffect(() => {
    fetchPitchDetail();
  }, [id]);

  const fetchPitchDetail = async () => {
    try {
      const data = await pitchService.getPitchById(id);
      setPitch(data.data);
      
      // Fetch price slots
      const pricesData = await pitchService.getPriceSlots(id);
      setPriceSlots(pricesData.data);
    } catch (error) {
      toast.error('Không thể tải thông tin sân');
      navigate('/pitches');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Image Gallery */}
          <div className="h-96 bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
            <span className="text-9xl text-white">⚽</span>
          </div>

          <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">{pitch.name}</h1>
                <p className="text-xl text-gray-600">📍 {pitch.location}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="px-4 py-1 bg-green-100 text-green-800 rounded-full">
                    🏟️ Sân {pitch.type}
                  </span>
                  <span className="text-yellow-500">
                    ⭐ {pitch.rating} ({pitch.review_count} đánh giá)
                  </span>
                </div>
              </div>
              <button
                onClick={() => navigate(`/booking/${pitch.id}`)}
                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 text-lg font-semibold"
              >
                Đặt sân ngay
              </button>
            </div>

            {/* Operating Hours */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-lg">
                ⏰ <strong>Giờ hoạt động:</strong> {pitch.open_time} - {pitch.close_time}
              </p>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-3">📝 Mô tả</h2>
              <p className="text-gray-700 leading-relaxed">{pitch.description}</p>
            </div>

            {/* Rules */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-3">📋 Quy tắc sân</h2>
              <p className="text-gray-700 leading-relaxed">{pitch.rules}</p>
            </div>

            {/* Price Table */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-3">💰 Bảng giá</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-green-600 text-white">
                      <th className="p-4 text-left">Khung giờ</th>
                      <th className="p-4 text-right">Giá (VNĐ/giờ)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {priceSlots.map((slot, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-4">{slot.time_slot.replace('-', ':00 - ')}:00</td>
                        <td className="p-4 text-right font-bold text-green-600">
                          {slot.price.toLocaleString('vi-VN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Price Range */}
            <div className="bg-yellow-50 p-6 rounded-lg text-center">
              <p className="text-2xl font-bold text-gray-800">
                Giá từ {pitch.min_price.toLocaleString('vi-VN')} - {pitch.max_price.toLocaleString('vi-VN')} VNĐ/giờ
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PitchDetail;
