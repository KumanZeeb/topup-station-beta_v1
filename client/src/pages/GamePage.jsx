// client/src/pages/GamePage.jsx
import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import ProductCard from '../components/UI/ProductCard';
import PopularGames from '../components/sections/PopularGames';
import './../components/styles/ProductCard.css';

const GamePage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("Fetching products for GamePage...");
        const res = await fetch('/api/products');
        const data = await res.json();
        console.log("Products data:", data);
        // Karena response { success, count, data }
        const productData = data.data || data;
        setProducts(Array.isArray(productData) ? productData : []);
      } catch (error) {
        console.error("Fetch error:", error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ✅ Tampilkan semua produk (karena ga ada field category)
  const games = Array.isArray(products) ? products : [];

  const handleProductClick = (slug) => {
    console.log('Clicked game:', slug);
    window.location.href = `/game/${slug}`;
  };

  return (
    <Layout>
      <div className="game-page-header" style={styles.header}>
        <h1 style={styles.title}>Game Top Up</h1>
        <p style={styles.subtitle}>
          Top up game favorit kamu dengan harga termurah dan proses instan
        </p>
      </div>

      <PopularGames />

      <div className="topup-grid-container" style={styles.gridContainer}>
        {isLoading && (
          <div className="topup-grid" style={styles.grid}>
            {[...Array(8)].map((_, i) => (
              <ProductCard key={i} isLoading={true} />
            ))}
          </div>
        )}

        {!isLoading && games.length === 0 && (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🎮</div>
            <h3 style={styles.emptyTitle}>Belum Ada Game</h3>
            <p style={styles.emptyText}>Game akan segera hadir</p>
          </div>
        )}

        {!isLoading && games.length > 0 && (
          <>
            <div className="topup-grid" style={styles.grid}>
              {games.map((game) => (
                <ProductCard
                  key={game.id}
                  product_id={game.id}
                  short_name={game.short_name || game.product_code}
                  name={game.name}
                  developer={game.developer || 'Official'}
                  icon_url={game.icon_url}
                  price={parseFloat(game.min_price) * 15000 || 50000}                  is_flash_sale={game.is_flash_sale || false}
                  is_popular={game.meta_data?.popularity > 80}
                  onProductClick={handleProductClick}
                />
              ))}
            </div>
            
            <div style={styles.gameCount}>
              Menampilkan {games.length} game
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

const styles = {
  header: {
    textAlign: 'center',
    marginBottom: '24px',
    padding: '20px 16px 0'
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#ff69b4',
    marginBottom: '8px'
  },
  subtitle: {
    fontSize: '14px',
    color: '#a1a1aa',
    margin: 0
  },
  gridContainer: {
    padding: '0 16px 80px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '16px',
    marginBottom: '20px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    background: '#1a1a1a',
    borderRadius: '16px',
    border: '1px solid #27272a'
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '16px'
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: '8px'
  },
  emptyText: {
    fontSize: '14px',
    color: '#71717a',
    margin: 0
  },
  gameCount: {
    textAlign: 'center',
    fontSize: '12px',
    color: '#71717a',
    paddingTop: '16px',
    borderTop: '1px solid #27272a'
  }
};

export default GamePage;