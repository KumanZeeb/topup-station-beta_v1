// client/src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';

// Layout
import Layout from '../components/layout/Layout';

// Components
import Banner from '../components/sections/Banner';
import FlashSale from '../components/sections/FlashSale';
import QuickActions from '../components/sections/QuickActions';
import PromoBanner from '../components/sections/PromoBanner';
import PopularGames from '../components/sections/PopularGames';
import Tabs from '../components/sections/Tabs';
import ProductGrid from '../components/sections/ProductGrid';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("🔥 Fetching products for HomePage...");
        
        // ✅ PAKE RELATIVE PATH!
        const res = await fetch('/api/products');
        
        // Kalo mau pake env (lebih fleksibel):
        // const baseUrl = process.env.REACT_APP_API_URL || '';
        // const res = await fetch(`${baseUrl}/api/products`);
        
        const data = await res.json();
        console.log("✅ Products data:", data);
        setProducts(data);
      } catch (error) {
        console.error("❌ Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Layout>
      <Banner />
      <FlashSale />
      <QuickActions />
      <PromoBanner />
      <PopularGames />
      <Tabs />
      <ProductGrid
        products={products}
        isLoading={isLoading}
      />
    </Layout>
  );
};

export default HomePage;