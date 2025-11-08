import React from 'react';
import { FaFacebook, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">Sân Bóng Mini</h3>
            <p className="text-gray-400">
              Hệ thống quản lý và đặt sân bóng đá mini chuyên nghiệp, 
              tiện lợi và nhanh chóng.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">Liên hệ</h3>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-center space-x-2">
                <FaPhone />
                <span>0123 456 789</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaEnvelope />
                <span>contact@sanbongmini.vn</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaMapMarkerAlt />
                <span>123 Đường ABC, Quận XYZ, TP.HCM</span>
              </div>
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-xl font-bold mb-4">Mạng xã hội</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-2xl hover:text-primary-400">
                <FaFacebook />
              </a>
              <a href="#" className="text-2xl hover:text-primary-400">
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; 2025 Sân Bóng Mini. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
