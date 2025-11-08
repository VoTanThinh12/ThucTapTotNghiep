import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaMapMarkerAlt, FaClock, FaStar, FaInfoCircle } from 'react-icons/fa';
import pitchService from '../../services/pitchService';
import BookingForm from '../../components/client/BookingForm';
import Loading from '../../components/common/Loading';
import useAuthStore from '../../store/authStore';
import { formatCurrency } from '../../utils/formatters';
import { PITCH_TYPES } from '../../utils/constants';

const PitchDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [pitch, setPitch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPitch();
  }, [id]);

  const loadPitch = async () => {
    try {
      setLoading(true);
      const data = await pitchService.getPitchById(id);
      setPitch(data.pitch);
    } catch (error) {
      toast.error('Không thể tải thông tin sân');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSuccess = () => {
    navigate('/my-bookings');
  };

  if (loading) {
    return <Loading />;
  }

  if (!pitch) {
    return null;
  }

  const images = Array.isArray(pitch.images) ? pitch.images : [];
  const defaultImage = 'https://via.placeholder.com/800x600?text=Sân+Bóng';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Pitch Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            <div className="card">
              <img
                src={images[0] || defaultImage}
                alt={pitch.name}
                className="w-full h-96 object-cover rounded-lg"
              />
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {images.slice(1, 5).map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`${pitch.name} ${index + 2}`}
                      className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-75"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {pitch.name}
                  </h1>
                  <span className="badge badge-success">
                    {PITCH_TYPES[pitch.type]}
                  </span>
                </div>
                <div className="flex items-center text-yellow-500">
                  <FaStar className="text-2xl mr-1" />
                  <span className="text-2xl font-bold">{pitch.rating}</span>
                  <span className="text-gray-500 ml-1">({pitch.reviews})</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <FaMapMarkerAlt className="mr-3 text-primary-600 text-xl" />
                  <span className="text-lg">{pitch.location}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <FaClock className="mr-3 text-primary-600 text-xl" />
                  <span className="text-lg">
                    {pitch.open_time} - {pitch.close_time}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Giá:</span>
                  <div>
                    <span className="text-3xl font-bold text-primary-600">
                      {formatCurrency(pitch.min_price)}
                    </span>
                    <span className="text-gray-500"> - {formatCurrency(pitch.max_price)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {pitch.description && (
              <div className="card">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <FaInfoCircle className="mr-2 text-primary-600" />
                  Mô tả
                </h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {pitch.description}
                </p>
              </div>
            )}

            {/* Rules */}
            {pitch.rules && (
              <div className="card">
                <h3 className="text-xl font-bold mb-4">Quy định</h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {pitch.rules}
                </p>
              </div>
            )}

            {/* Price Slots */}
            {pitch.price_slots && pitch.price_slots.length > 0 && (
              <div className="card">
                <h3 className="text-xl font-bold mb-4">Bảng giá theo khung giờ</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {pitch.price_slots.map((slot, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-4 rounded-lg text-center"
                    >
                      <div className="text-sm text-gray-600 mb-1">
                        {slot.time_slot}
                      </div>
                      <div className="text-lg font-bold text-primary-600">
                        {formatCurrency(slot.price)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Booking Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              {isAuthenticated ? (
                <BookingForm
                  pitchId={pitch.id}
                  onSuccess={handleBookingSuccess}
                />
              ) : (
                <div className="card text-center">
                  <h3 className="text-xl font-bold mb-4">Đặt sân ngay</h3>
                  <p className="text-gray-600 mb-6">
                    Vui lòng đăng nhập để đặt sân
                  </p>
                  <button
                    onClick={() => navigate('/login')}
                    className="btn btn-primary w-full"
                  >
                    Đăng nhập
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PitchDetailPage;
