// ================================================================
// PITCH CARD COMPONENT - Hiển thị thẻ sân bóng
// ================================================================

import React from 'react';
import { Link } from 'react-router-dom';

const PitchCard = ({ pitch }) => {
  return (
    <div className="card h-100 shadow-sm">
      {/* Hình ảnh sân */}
      <img
        src={pitch.images?.[0] || `https://via.placeholder.com/400x250?text=${pitch.name}`}
        className="card-img-top"
        alt={pitch.name}
        style={{ height: '200px', objectFit: 'cover' }}
      />

      <div className="card-body">
        {/* Tên sân */}
        <h5 className="card-title">{pitch.name}</h5>

        {/* Địa điểm */}
        <p className="text-muted mb-2">
          <i className="bi bi-geo-alt me-1"></i>
          {pitch.location}
        </p>

        {/* Mô tả ngắn */}
        {pitch.description && (
          <p className="card-text text-muted small">
            {pitch.description.substring(0, 80)}...
          </p>
        )}

        {/* Thông tin */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="badge bg-success">{pitch.type}</span>
          <span className="text-muted small">
            <i className="bi bi-people me-1"></i>
            {pitch.capacity} người
          </span>
        </div>

        {/* Giá */}
        <div className="fw-bold text-success fs-5">
          {parseInt(pitch.price_per_hour).toLocaleString()}đ
          <small className="text-muted fs-6">/giờ</small>
        </div>
      </div>

      {/* Footer với button */}
      <div className="card-footer bg-white border-0">
        <Link
          to={`/pitches/${pitch.id}`}
          className="btn btn-outline-success w-100"
        >
          Xem chi tiết
        </Link>
      </div>
    </div>
  );
};

export default PitchCard;
