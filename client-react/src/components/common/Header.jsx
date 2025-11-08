import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaHome, FaCalendarAlt } from 'react-icons/fa';
import useAuthStore from '../../store/authStore';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">⚽</span>
            </div>
            <span className="text-xl font-bold text-gray-800">
              Sân Bóng Mini
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link 
              to="/" 
              className="flex items-center space-x-1 text-gray-700 hover:text-primary-600"
            >
              <FaHome />
              <span>Trang chủ</span>
            </Link>
            
            {isAuthenticated && (
              <Link 
                to="/my-bookings" 
                className="flex items-center space-x-1 text-gray-700 hover:text-primary-600"
              >
                <FaCalendarAlt />
                <span>Lịch đặt của tôi</span>
              </Link>
            )}

            {user?.role === 'admin' && (
              <Link 
                to="/admin" 
                className="flex items-center space-x-1 text-gray-700 hover:text-primary-600"
              >
                <span>Quản trị</span>
              </Link>
            )}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2">
                  <FaUser className="text-gray-600" />
                  <span className="text-gray-700">{user?.full_name || user?.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                >
                  <FaSignOutAlt />
                  <span>Đăng xuất</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary">
                  Đăng nhập
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
