// ================================================================
// APP.JSX - Main Application Component
// ================================================================

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import HomePage from "./pages/client/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        <Header />

        <main className="flex-grow-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<div>Register Page</div>} />
            <Route path="/pitches" element={<div>Pitches List Page</div>} />
            <Route path="/pitches/:id" element={<div>Pitch Detail Page</div>} />

            {/* Protected Routes */}
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute>
                  <div>My Bookings Page</div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <div>Profile Page</div>
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/pitches"
              element={
                <ProtectedRoute adminOnly={true}>
                  <div>Admin Pitches Management</div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <ProtectedRoute adminOnly={true}>
                  <div>Admin Bookings Management</div>
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route
              path="*"
              element={
                <div className="container mt-5 text-center">
                  <h2>404 - Page Not Found</h2>
                </div>
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
