import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Sidebar from './components/common/Sidebar';
import ProtectedRoute from './components/common/ProtectedRoute';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Client Pages
import Home from './pages/client/Home';
import PitchDetailPage from './pages/client/PitchDetailPage';
import MyBookings from './pages/client/MyBookings';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManagePitches from './pages/admin/ManagePitches';
import ManageBookings from './pages/admin/ManageBookings';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Client Routes */}
          <Route path="/*" element={
            <>
              <Header />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/pitch/:id" element={<PitchDetailPage />} />
                  <Route path="/my-bookings" element={
                    <ProtectedRoute>
                      <MyBookings />
                    </ProtectedRoute>
                  } />
                </Routes>
              </main>
              <Footer />
            </>
          } />

          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <ProtectedRoute adminOnly={true}>
              <div className="flex">
                <Sidebar />
                <main className="flex-grow bg-gray-50">
                  <Routes>
                    <Route path="/" element={<AdminDashboard />} />
                    <Route path="/pitches" element={<ManagePitches />} />
                    <Route path="/bookings" element={<ManageBookings />} />
                  </Routes>
                </main>
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
