// client/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // ✅ TETAP DI SINI!
import App from './App';

// ========== PAGES ==========
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import PromoPage from './pages/PromoPage';
import AccountPage from './pages/AccountPage';
import CheckoutPage from './pages/CheckoutPage';
import GameDetailPage from './pages/GameDetailPage';

// ========== STYLES ==========
import './components/styles/global.css';
import './components/styles/ProductCard.css';
import './components/styles/AccountPage.css';
import './components/styles/PromoPage.css';
import './components/styles/GamePage.css';
import './components/styles/GameDetailPage.css';
import './components/styles/FlashSale.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* ✅ CUMA 1! */}
      <Routes>
        <Route path="/*" element={<App />} /> {/* ✅ GINI AJA! */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);