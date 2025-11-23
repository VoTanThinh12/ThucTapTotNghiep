// ================================================================
// HEADER COMPONENT - Thanh điều hướng
// ================================================================

import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="bi bi-dribbble me-2"></i>
          SoccerHub
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Trang chủ
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/pitches">
                Tìm sân
              </Link>
            </li>

            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/my-bookings">
                    Đơn đặt của tôi
                  </Link>
                </li>

                {user?.role === "admin" && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin">
                      Quản trị
                    </Link>
                  </li>
                )}

                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="/"
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                  >
                    {user?.full_name}
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        Tài khoản
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        Đăng xuất
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Đăng nhập
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-light btn-sm ms-2" to="/register">
                    Đăng ký
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
