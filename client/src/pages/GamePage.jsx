// client/src/pages/GamePage.jsx
import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import ProductCard from '../components/UI/ProductCard';
import PopularGames from '../components/sections/PopularGames';
import './../components/styles/ProductCard.css';

// ✅ HARDCODED API URL - Langsung ke worker
const API_URL = 'https://topup-station-api-v2.maakunn470.workers.dev/api';

const GamePage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log(`🔄 Fetching products from: ${API_URL}/products`);
        
        const res = await fetch(`${API_URL}/products`);
        
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        
        const responseData = await res.json();
        console.log("✅ Products response:", responseData);
        
        // Response format: { success: true, data: [...], count: n }
        if (responseData.success && Array.isArray(responseData.data)) {
          setProducts(responseData.data);
          console.log(`✅ Loaded ${responseData.data.length} products`);
        } else if (Array.isArray(responseData)) {
          // Fallback kalo response langsung array
          setProducts(responseData);
          console.log(`✅ Loaded ${responseData.length} products (array format)`);
        } else {
          console.warn("⚠️ Unexpected response format:", responseData);
          setProducts([]);
        }
      } catch (err) {
        console.error("❌ Fetch error:", err.message);
        setError(err.message);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter hanya yang category-nya 'game' atau nggak ada filter (tampilin semua)
  const games = Array.isArray(products) 
    ? products.filter(p => p.category === 'mobile' || p.category === 'pc' || !p.category)
    : [];

  const handleProductClick = (shortName) => {
    console.log('🎮 Clicked game:', shortName);
    // Pake short_name buat routing, bukan slug
    window.location.href = `/${shortName}`;
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
        {/* Loading State */}
        {isLoading && (
          <div className="topup-grid" style={styles.grid}>
            {[...Array(8)].map((_, i) => (
              <ProductCard key={i} isLoading={true} />
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>⚠️</div>
            <h3 style={styles.emptyTitle}>Gagal Memuat Game</h3>
            <p style={styles.emptyText}>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              style={styles.retryButton}
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && games.length === 0 && (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🎮</div>
            <h3 style={styles.emptyTitle}>Belum Ada Game</h3>
            <p style={styles.emptyText}>Game akan segera hadir. Stay tuned!</p>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && !error && games.length > 0 && (
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
                  price={parseFloat(game.min_price) * 15000 || 50000}
                  is_flash_sale={game.is_flash_sale || false}
                  is_popular={game.meta_data?.popularity > 80}
                  onProductClick={() => handleProductClick(game.short_name)}
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
  retryButton: {
    marginTop: '16px',
    padding: '10px 24px',
    background: '#ff69b4',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600'
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
