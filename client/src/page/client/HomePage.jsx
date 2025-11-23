// ================================================================
// HOME PAGE - Trang chủ
// ================================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { pitchAPI } from '../services/api';

const HomePage = () => {
  const [pitches, setPitches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPitches();
  }, []);

  const fetchPitches = async () => {
    try {
      const response = await pitchAPI.getAll({ status: 'active' });
      setPitches(response.data.pitches.slice(0, 6)); // Lấy 6 sân đầu
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-success text-white py-5">
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-3">
            Đặt Sân Bóng Mini Online
          </h1>
          <p className="lead mb-4">
            Nhanh chóng - Tiện lợi - Uy tín
          </p>
          <Link to="/pitches" className="btn btn-light btn-lg">
            Tìm sân ngay
          </Link>
        </div>
      </section>

      {/* Featured Pitches */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-4">Sân bóng nổi bật</h2>

          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="row">
              {pitches.map((pitch) => (
                <div key={pitch.id} className="col-md-4 mb-4">
                  <div className="card h-100 shadow-sm">
                    <img
                      src={`https://via.placeholder.com/400x250?text=${pitch.name}`}
                      className="card-img-top"
                      alt={pitch.name}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{pitch.name}</h5>
                      <p className="text-muted">
                        <i className="bi bi-geo-alt"></i> {pitch.location}
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="badge bg-success">{pitch.type}</span>
                        <span className="fw-bold text-success">
                          {parseInt(pitch.price_per_hour).toLocaleString()}đ/giờ
                        </span>
                      </div>
                    </div>
                    <div className="card-footer bg-white">
                      <Link
                        to={`/pitches/${pitch.id}`}
                        className="btn btn-outline-success w-100"
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-4">
            <Link to="/pitches" className="btn btn-success">
              Xem tất cả sân bóng
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-light py-5">
        <div className="container">
          <h2 className="text-center mb-5">Tại sao chọn chúng tôi?</h2>
          <div className="row">
            <div className="col-md-4 text-center mb-4">
              <div className="mb-3">
                <i className="bi bi-clock-history text-success" style={{ fontSize: '3rem' }}></i>
              </div>
              <h4>Đặt sân nhanh</h4>
              <p className="text-muted">
                Chỉ 3 bước đơn giản để hoàn tất đặt sân
              </p>
            </div>
            <div className="col-md-4 text-center mb-4">
              <div className="mb-3">
                <i className="bi bi-check-circle text-success" style={{ fontSize: '3rem' }}></i>
              </div>
              <h4>Đảm bảo chất lượng</h4>
              <p className="text-muted">
                Sân được kiểm tra và đánh giá thường xuyên
              </p>
            </div>
            <div className="col-md-4 text-center mb-4">
              <div className="mb-3">
                <i className="bi bi-headset text-success" style={{ fontSize: '3rem' }}></i>
              </div>
              <h4>Hỗ trợ 24/7</h4>
              <p className="text-muted">
                Đội ngũ hỗ trợ nhiệt tình, sẵn sàng giúp đỡ
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
