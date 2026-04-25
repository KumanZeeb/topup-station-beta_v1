// client/src/pages/PromoPage.jsx
import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import ProductCard from '../components/UI/ProductCard';
import FlashSale from '../components/UI/FlashSale';

// Import icon dari Font Awesome 5
import {
  FaTag,
  FaPercent,
  FaGift,
  FaFire,
  FaCoins,
  FaGamepad,
  FaChevronRight,
  FaTicketAlt,
  FaArrowRight
} from 'react-icons/fa';

import './../components/styles/PromoPage.css';

const PromoPage = ({ products = [], isLoading = false }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [promoProducts, setPromoProducts] = useState([]);
  const [activePromo, setActivePromo] = useState(null);

  // Filter produk yang punya promo
  useEffect(() => {
    if (products.length > 0) {
      // Filter produk dengan diskon, flash sale, atau featured
      const filtered = products.filter(p => 
        p.discount > 0 || 
        p.is_flash_sale === true || 
        p.is_featured === true ||
        p.is_popular === true
      );
      setPromoProducts(filtered);
      
      // Set active promo pertama
      if (filtered.length > 0) {
        setActivePromo(filtered[0]);
      }
    }
  }, [products]);

  // Kategori promo
  const promoCategories = [
    { id: 'all', label: 'Semua Promo', icon: <FaTag />, color: '#ff69b4' },
    { id: 'flash', label: 'Flash Sale', icon: <FaFire />, color: '#ef4444' },
    { id: 'discount', label: 'Diskon', icon: <FaPercent />, color: '#10b981' },
    { id: 'cashback', label: 'Cashback', icon: <FaCoins />, color: '#f59e0b' },
    { id: 'voucher', label: 'Voucher', icon: <FaTicketAlt />, color: '#8b5cf6' }
  ];

  // Dummy data banner promo
  const promoBanners = [
    {
      id: 1,
      title: 'Cashback 50%',
      subtitle: 'Khusus game Mobile Legends',
      discount: '50%',
      code: 'MLBB50',
      color: 'linear-gradient(145deg, #ff69b4, #ff1493)',
      icon: '🎮'
    },
    {
      id: 2,
      title: 'Free Fire Week',
      subtitle: 'Diskon up to 40%',
      discount: '40%',
      code: 'FF40',
      color: 'linear-gradient(145deg, #ef4444, #b91c1c)',
      icon: '🔥'
    },
    {
      id: 3,
      title: 'New User Bonus',
      subtitle: 'Top up pertama dapat 20%',
      discount: '20%',
      code: 'NEWBIE20',
      color: 'linear-gradient(145deg, #10b981, #059669)',
      icon: '🎁'
    }
  ];

  const handleProductClick = (slug) => {
    window.location.href = `/game/${slug}`;
  };

  const formatCurrency = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Filter produk berdasarkan kategori
  const getFilteredProducts = () => {
    if (selectedCategory === 'all') return promoProducts;
    if (selectedCategory === 'flash') return promoProducts.filter(p => p.is_flash_sale);
    if (selectedCategory === 'discount') return promoProducts.filter(p => p.discount > 0);
    return promoProducts;
  };

  const filteredProducts = getFilteredProducts();

  return (
    <Layout>
      {/* Flash Sale Section */}
      <FlashSale />

      {/* Hero Banner */}
      <div className="promo-hero">
        <div className="promo-hero-content">
          <h1>🎁 Promo Spesial</h1>
          <p>Dapatkan diskon dan cashback hingga 50% untuk top up game favoritmu!</p>
        </div>
      </div>

      {/* Promo Banner Cards */}
      <div className="promo-banners">
        {promoBanners.map((banner) => (
          <div 
            key={banner.id} 
            className="promo-banner-card"
            style={{ background: banner.color }}
          >
            <div className="promo-banner-icon">{banner.icon}</div>
            <div className="promo-banner-info">
              <h3>{banner.title}</h3>
              <p>{banner.subtitle}</p>
              <div className="promo-code">
                <span>Kode: </span>
                <strong>{banner.code}</strong>
              </div>
            </div>
            <button className="promo-claim-btn">
              Klaim <FaChevronRight />
            </button>
          </div>
        ))}
      </div>

      {/* Category Filter */}
      <div className="promo-categories">
        <h2 className="section-title">Kategori Promo</h2>
        <div className="category-filter">
          {promoCategories.map((category) => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
              style={selectedCategory === category.id ? { 
                background: `${category.color}20`,
                borderColor: category.color,
                color: category.color 
              } : {}}
            >
              <span className="category-icon" style={{ color: category.color }}>
                {category.icon}
              </span>
              <span className="category-label">{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Promo Highlight */}
      {activePromo && (
        <div className="active-promo-highlight">
          <div className="highlight-badge">🔥 HOT PROMO</div>
          <div className="highlight-content">
            <div className="highlight-game">
              <div className="highlight-icon">
                {activePromo.icon_url ? (
                  <img src={activePromo.icon_url} alt={activePromo.name} />
                ) : (
                  <FaGamepad />
                )}
              </div>
              <div className="highlight-info">
                <h3>{activePromo.name}</h3>
                <p>{activePromo.developer || 'Official'}</p>
                <div className="highlight-price">
                  <span className="original-price">
                    {formatCurrency(activePromo.price * 1.5)}
                  </span>
                  <span className="discount-price">
                    {formatCurrency(activePromo.price)}
                  </span>
                  <span className="discount-badge">
                    {activePromo.discount || 30}% OFF
                  </span>
                </div>
              </div>
            </div>
            <button className="highlight-claim-btn">
              Claim Now <FaArrowRight />
            </button>
          </div>
        </div>
      )}

      {/* Product Grid */}
      <div className="promo-grid-container">
        <div className="grid-header">
          <h2 className="section-title">
            {selectedCategory === 'all' && 'Semua Promo'}
            {selectedCategory === 'flash' && 'Flash Sale'}
            {selectedCategory === 'discount' && 'Diskon Spesial'}
            {selectedCategory === 'cashback' && 'Cashback'}
            {selectedCategory === 'voucher' && 'Voucher'}
          </h2>
          <span className="product-count">
            {filteredProducts.length} produk
          </span>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="promo-grid">
            {[...Array(8)].map((_, i) => (
              <ProductCard key={i} isLoading={true} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredProducts.length === 0 && (
          <div className="no-promo">
            <div className="empty-icon">🎁</div>
            <h3>Belum Ada Promo</h3>
            <p>Promo untuk kategori ini akan segera hadir!</p>
          </div>
        )}

        {/* Promo Grid */}
        {!isLoading && filteredProducts.length > 0 && (
          <div className="promo-grid">
            {filteredProducts.map((product) => (
              <div key={product.id} className="promo-product-wrapper">
                <ProductCard
                  product_id={product.id}
                  short_name={product.slug || product.short_name}
                  name={product.name}
                  developer={product.developer || 'Official'}
                  icon_url={product.icon_url || product.image_path}
                  price={product.price}
                  is_featured={product.is_featured}
                  is_flash_sale={product.is_flash_sale}
                  is_popular={product.is_popular}
                  onProductClick={handleProductClick}
                />
                {product.discount > 0 && (
                  <div className="promo-discount-badge">
                    <FaPercent />
                    {product.discount}%
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="promo-info-section">
        <div className="info-card">
          <FaGift className="info-icon" />
          <h4>Cara Mendapatkan Promo</h4>
          <ol>
            <li>Pilih game yang ingin di-top up</li>
            <li>Masukkan User ID</li>
            <li>Pilih nominal top up</li>
            <li>Masukkan kode promo (jika ada)</li>
            <li>Lakukan pembayaran</li>
          </ol>
        </div>
        <div className="info-card">
          <FaCoins className="info-icon" />
          <h4>Syarat & Ketentuan</h4>
          <ul>
            <li>Promo berlaku untuk pengguna baru & lama</li>
            <li>Tidak dapat digabung dengan promo lain</li>
            <li>Periode promo terbatas</li>
            <li>Cashback masuk ke dompet dalam 1x24 jam</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default PromoPage;