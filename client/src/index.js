// ================================================================
// INDEX.JS - Entry Point
// ================================================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Import custom styles (nếu có)
import './styles/main.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
