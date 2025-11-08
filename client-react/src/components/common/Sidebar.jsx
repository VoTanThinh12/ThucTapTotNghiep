import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaFutbol, 
  FaCalendarCheck, 
  FaUsers,
  FaChartBar 
} from 'react-icons/fa';

const Sidebar = () => {
  const menuItems = [
    { path: '/admin', icon: FaTachometerAlt, label: 'Dashboard', exact: true },
    { path: '/admin/pitches', icon: FaFutbol, label: 'Quản lý sân' },
    { path: '/admin/bookings', icon: FaCalendarCheck, label: 'Quản lý booking' },
    { path: '/admin/customers', icon: FaUsers, label: 'Quản lý khách hàng' },
    { path: '/admin/reports', icon: FaChartBar, label: 'Báo cáo' }
  ];

  return (
    <aside className="w-64 bg-white shadow-md min-h-screen">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800">Quản trị</h2>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-6 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors ${
                isActive ? 'bg-primary-50 text-primary-600 border-r-4 border-primary-600' : ''
              }`
            }
          >
            <item.icon className="text-xl" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
