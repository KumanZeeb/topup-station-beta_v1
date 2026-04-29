import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { TranslationProvider, useTranslation } from './context/TranslationContext';

// Layout
import Layout from './components/layout/Layout';

// Pages
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import PromoPage from './pages/PromoPage';
import AccountPage from './pages/AccountPage';
import GameDetailPage from './pages/GameDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import ToolsPage from './pages/ToolsPage';

// Components
import Banner from './components/sections/Banner';
import FlashSale from './components/sections/FlashSale';
import QuickActions from './components/sections/QuickActions';
import PromoBanner from './components/sections/PromoBanner';
import PopularGames from './components/sections/PopularGames';
import Tabs from './components/sections/Tabs';
import ProductGrid from './components/sections/ProductGrid';

// ✅ CONSTANTS API URL
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://topup-station-api-v2.maakunn470.workers.dev/api'
  : 'http://localhost:3001/api';

// =======================
// HOME COMPONENT (FIXED)
// =======================
const Home = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("Fetching products from:", API_URL);
        const res = await fetch(`${API_URL}/products`);
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <Banner />
      <FlashSale />
      <QuickActions />
      <PromoBanner />
      <PopularGames />
      <Tabs />
      <ProductGrid products={products} isLoading={isLoading} />
    </>
  );
};

// =======================
// APP CONTENT
// =======================
const AppContent = () => {
  const { language } = useTranslation();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("Fetching products for all pages from:", API_URL);
        const res = await fetch(`${API_URL}/products`);
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // List path yang pake Layout + BottomNav
  const layoutPaths = ['/', '/home', '/games', '/promo', '/account', '/tools'];
  const shouldUseLayout = layoutPaths.includes(location.pathname);

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = language === 'en' ? 'AmiraStore - Game Top Up' : 'AmiraStore - Top Up Game';
  }, [language]);

  if (shouldUseLayout) {
    return (
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/games" element={<GamePage products={products} isLoading={isLoading} />} />
          <Route path="/promo" element={<PromoPage products={products} isLoading={isLoading} />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/tools" element={<ToolsPage />} />
        </Routes>
      </Layout>
    );
  }

  return (
    <Routes>
      <Route path="/game/:slug" element={<GameDetailPage />} />
      <Route path="/checkout/:slug" element={<CheckoutPage />} />
      <Route path="/:productSlug" element={<CheckoutPage />} />
    </Routes>
  );
};

// =======================
// MAIN APP
// =======================
const App = () => {
  return (
    <TranslationProvider>
      <AppContent />
    </TranslationProvider>
  );
};

export default App;
