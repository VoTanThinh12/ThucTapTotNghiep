// ================================================================
// FOOTER COMPONENT
// ================================================================

import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3">
            <h5>Về SoccerHub</h5>
            <p className="text-muted">
              Hệ thống quản lý và đặt sân bóng mini trực tuyến.
              Đặt sân nhanh chóng, tiện lợi, uy tín.
            </p>
          </div>

          <div className="col-md-4 mb-3">
            <h5>Liên kết</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/" className="text-muted text-decoration-none">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/pitches" className="text-muted text-decoration-none">
                  Tìm sân
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted text-decoration-none">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted text-decoration-none">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-md-4 mb-3">
            <h5>Liên hệ</h5>
            <p className="text-muted mb-1">
              <i className="bi bi-telephone me-2"></i>
              0901234567
            </p>
            <p className="text-muted mb-1">
              <i className="bi bi-envelope me-2"></i>
              info@soccerhub.com
            </p>
            <p className="text-muted">
              <i className="bi bi-geo-alt me-2"></i>
              TP. Hồ Chí Minh
            </p>
          </div>
        </div>

        <hr className="my-3 bg-secondary" />

        <div className="text-center text-muted">
          <p className="mb-0">
            © 2025 SoccerHub. Đồ án tốt nghiệp - Võ Tấn Thịnh
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
