import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaClock, FaStar } from 'react-icons/fa';
import { formatCurrency } from '../../utils/formatters';
import { PITCH_TYPES } from '../../utils/constants';

const PitchCard = ({ pitch }) => {
  const images = Array.isArray(pitch.images) ? pitch.images : [];
  const defaultImage = 'https://via.placeholder.com/400x300?text=Sân+Bóng';

  return (
    <div className="card hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
        <img
          src={images[0] || defaultImage}
          alt={pitch.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className="badge badge-success">
            {PITCH_TYPES[pitch.type]}
          </span>
        </div>
      </div>

      {/* Content */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{pitch.name}</h3>
        
        <div className="flex items-center text-gray-600 mb-2">
          <FaMapMarkerAlt className="mr-2" />
          <span className="text-sm">{pitch.location}</span>
        </div>

        <div className="flex items-center text-gray-600 mb-2">
          <FaClock className="mr-2" />
          <span className="text-sm">
            {pitch.open_time} - {pitch.close_time}
          </span>
        </div>

        <div className="flex items-center text-yellow-500 mb-4">
          <FaStar className="mr-1" />
          <span className="font-semibold">{pitch.rating}</span>
          <span className="text-gray-500 ml-1">({pitch.reviews} đánh giá)</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-primary-600">
              {formatCurrency(pitch.min_price)}
            </span>
            <span className="text-gray-500 text-sm"> - {formatCurrency(pitch.max_price)}</span>
          </div>
          <Link
            to={`/pitch/${pitch.id}`}
            className="btn btn-primary"
          >
            Đặt sân
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PitchCard;
