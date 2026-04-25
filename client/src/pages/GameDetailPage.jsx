// client/src/pages/GameDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';

// Import icon dari Font Awesome 5
import {
  FaGamepad,
  FaStar,
  FaDownload,
  FaUsers,
  FaMobile,
  FaShieldAlt,
  FaArrowLeft,
  FaChevronRight,
  FaCopy,
  FaCheckCircle,
  FaFire,
  FaDiceD20,
  FaBolt
} from 'react-icons/fa';

// ✅ PATH CSS YANG BENER!
import '../components/styles/GameDetailPage.css';

const GameDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedNominal, setSelectedNominal] = useState(null);
  const [userId, setUserId] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('topup');

  // 🔥 FETCH DETAIL GAME - PAKE API SAMA KAYAK APP.JSX!
  useEffect(() => {
    const fetchGameDetail = async () => {
      try {
        setLoading(true);
        
        // ✅ PAKE FETCH KE LOCALHOST - BUKAN SUPABASE!
        const res = await fetch('http://localhost:3001/api/products');
        const data = await res.json();
        
        // Cari game berdasarkan slug atau short_name
        const foundGame = data.find(
          item => item.slug === slug || item.short_name === slug
        );
        
        setGame(foundGame || null);
      } catch (error) {
        console.error('❌ Error fetching game detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGameDetail();
  }, [slug]);

  // Dummy data nominal top up
  const topupNominals = [
    { id: 1, amount: 50000, diamonds: 86, bonus: 0, popular: false },
    { id: 2, amount: 100000, diamonds: 172, bonus: 10, popular: true },
    { id: 3, amount: 200000, diamonds: 344, bonus: 25, popular: false },
    { id: 4, amount: 300000, diamonds: 516, bonus: 40, popular: false },
    { id: 5, amount: 500000, diamonds: 860, bonus: 70, popular: false },
    { id: 6, amount: 1000000, diamonds: 1720, bonus: 150, popular: false },
  ];

  // Dummy data payment methods
  const paymentMethods = [
    { id: 'gopay', name: 'GoPay', icon: '💚', fee: 0 },
    { id: 'ovo', name: 'OVO', icon: '💜', fee: 0 },
    { id: 'dana', name: 'DANA', icon: '💙', fee: 0 },
    { id: 'bank', name: 'Transfer Bank', icon: '🏦', fee: 2500 },
    { id: 'alfamart', name: 'Alfamart', icon: '🏪', fee: 3000 },
    { id: 'indomaret', name: 'Indomaret', icon: '🏪', fee: 3000 },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText('123456789');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCheckout = () => {
    if (!userId) {
      alert('Masukkan User ID terlebih dahulu!');
      return;
    }
    if (!selectedNominal) {
      alert('Pilih nominal top up!');
      return;
    }
    navigate(`/checkout/${slug}`, {
      state: {
        game,
        nominal: selectedNominal,
        userId
      }
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="game-detail-loading">
          <div className="loading-skeleton"></div>
        </div>
      </Layout>
    );
  }

  if (!game) {
    return (
      <Layout>
        <div className="game-not-found">
          <div className="not-found-icon">🎮</div>
          <h2>Game Tidak Ditemukan</h2>
          <p>Maaf, game yang kamu cari tidak tersedia</p>
          <button onClick={() => navigate('/games')} className="back-btn">
            <FaArrowLeft /> Kembali ke Games
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="game-detail-container">
        {/* Back Button */}
        <button className="back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Kembali
        </button>

        {/* Game Info Card */}
        <div className="game-info-card">
          <div className="game-icon-wrapper">
            {game.icon_url ? (
              <img src={game.icon_url} alt={game.name} className="game-icon" />
            ) : (
              <div className="game-icon-fallback">
                <FaGamepad />
              </div>
            )}
            {game.is_flash_sale && (
              <div className="game-badge flash">
                <FaFire /> FLASH SALE
              </div>
            )}
            {game.is_popular && (
              <div className="game-badge popular">
                <FaBolt /> POPULAR
              </div>
            )}
          </div>

          <div className="game-detail-info">
            <h1 className="game-title">{game.name}</h1>
            <p className="game-developer">{game.developer || 'Official Developer'}</p>
            
            <div className="game-stats">
              <div className="stat-item">
                <FaStar className="stat-icon star" />
                <span>4.8/5.0</span>
              </div>
              <div className="stat-item">
                <FaDownload className="stat-icon" />
                <span>10M+ Downloads</span>
              </div>
              <div className="stat-item">
                <FaUsers className="stat-icon" />
                <span>1M+ Players</span>
              </div>
              <div className="stat-item">
                <FaMobile className="stat-icon" />
                <span>Mobile</span>
              </div>
            </div>

            <div className="game-description">
              <p>{game.description || `Top up ${game.name} dengan harga termurah dan proses instan. Dapatkan bonus diamond dan reward menarik setiap melakukan top up!`}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="detail-tabs">
          <button 
            className={`tab-btn ${activeTab === 'topup' ? 'active' : ''}`}
            onClick={() => setActiveTab('topup')}
          >
            Top Up
          </button>
          <button 
            className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            Informasi Game
          </button>
          <button 
            className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Ulasan
          </button>
        </div>

        {/* Tab Content - Top Up */}
        {activeTab === 'topup' && (
          <div className="topup-section">
            {/* User ID Input */}
            <div className="input-card">
              <div className="input-header">
                <h3>User ID</h3>
                <span className="input-hint">Masukkan ID game kamu</span>
              </div>
              <div className="user-id-input-group">
                <input
                  type="text"
                  className="user-id-input"
                  placeholder="Contoh: 123456789"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                />
                <button className="copy-btn" onClick={handleCopyId}>
                  {copied ? <FaCheckCircle /> : <FaCopy />}
                  {copied ? 'Tersalin' : 'Salin'}
                </button>
              </div>
              <p className="input-note">
                <FaShieldAlt /> Pastikan User ID benar, kesalahan input bukan tanggung jawab kami
              </p>
            </div>

            {/* Nominal Top Up */}
            <div className="nominals-card">
              <div className="section-header">
                <h3>Pilih Nominal</h3>
                <span className="diamond-equivalent">≈ {selectedNominal?.diamonds || 0} Diamond</span>
              </div>
              
              <div className="nominals-grid">
                {topupNominals.map((nominal) => (
                  <div
                    key={nominal.id}
                    className={`nominal-card ${selectedNominal?.id === nominal.id ? 'selected' : ''} ${nominal.popular ? 'popular' : ''}`}
                    onClick={() => setSelectedNominal(nominal)}
                  >
                    {nominal.popular && <span className="popular-badge">Paling Laris</span>}
                    <div className="nominal-amount">
                      {formatCurrency(nominal.amount)}
                    </div>
                    <div className="nominal-details">
                      <span className="diamonds">
                        <FaDiamond /> {nominal.diamonds} Diamond
                      </span>
                      {nominal.bonus > 0 && (
                        <span className="bonus">
                          Bonus +{nominal.bonus}%
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="payment-card">
              <h3>Metode Pembayaran</h3>
              <div className="payment-grid">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="payment-item">
                    <span className="payment-icon">{method.icon}</span>
                    <span className="payment-name">{method.name}</span>
                    {method.fee > 0 ? (
                      <span className="payment-fee">+{formatCurrency(method.fee)}</span>
                    ) : (
                      <span className="payment-free">Gratis</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Checkout Button */}
            <div className="checkout-section">
              <div className="total-price">
                <span>Total Pembayaran</span>
                <strong>{selectedNominal ? formatCurrency(selectedNominal.amount) : formatCurrency(0)}</strong>
              </div>
              <button className="checkout-btn" onClick={handleCheckout}>
                Top Up Sekarang <FaChevronRight />
              </button>
            </div>
          </div>
        )}

        {/* Tab Content - Info Game */}
        {activeTab === 'info' && (
          <div className="info-section">
            <div className="info-card">
              <h3>Tentang Game</h3>
              <p>{game.description || `${game.name} adalah game online yang sangat populer di Indonesia. Nikmati berbagai fitur menarik dan kumpulkan diamond untuk membeli item eksklusif.`}</p>
              
              <div className="info-details">
                <div className="detail-row">
                  <span className="detail-label">Genre</span>
                  <span className="detail-value">{game.category || 'Mobile Game'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Developer</span>
                  <span className="detail-value">{game.developer || 'Official Developer'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Publisher</span>
                  <span className="detail-value">{game.publisher || 'Official Publisher'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Release Date</span>
                  <span className="detail-value">{game.release_date || '2024'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Platform</span>
                  <span className="detail-value">Android, iOS</span>
                </div>
              </div>
            </div>

            <div className="requirements-card">
              <h3>Spesifikasi Minimum</h3>
              <div className="requirements-list">
                <div className="requirement-item">
                  <span className="req-label">OS</span>
                  <span className="req-value">Android 6.0 / iOS 12</span>
                </div>
                <div className="requirement-item">
                  <span className="req-label">RAM</span>
                  <span className="req-value">3 GB</span>
                </div>
                <div className="requirement-item">
                  <span className="req-label">Storage</span>
                  <span className="req-value">4 GB</span>
                </div>
                <div className="requirement-item">
                  <span className="req-label">Processor</span>
                  <span className="req-value">Snapdragon 660 / Kirin 710</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content - Reviews */}
        {activeTab === 'reviews' && (
          <div className="reviews-section">
            <div className="reviews-summary">
              <div className="rating-average">
                <span className="rating-number">4.8</span>
                <div className="rating-stars">
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                </div>
                <span className="rating-total">Berdasarkan 1.2M+ ulasan</span>
              </div>
            </div>

            <div className="reviews-list">
              {[1, 2, 3].map((i) => (
                <div key={i} className="review-card">
                  <div className="reviewer">
                    <div className="reviewer-avatar">U{i}</div>
                    <div className="reviewer-info">
                      <h4>User{i}</h4>
                      <div className="review-rating">
                        <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                      </div>
                    </div>
                    <span className="review-date">1 hari lalu</span>
                  </div>
                  <p className="review-content">
                    Top up cepat, langsung masuk. Recommended banget buat yang sering main {game.name}!
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Games */}
        <div className="related-games">
          <h3>Game Lainnya</h3>
          <div className="related-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="related-card">
                <div className="related-icon">
                  <FaGamepad />
                </div>
                <div className="related-info">
                  <h4>Game {i}</h4>
                  <span>Popular Game</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GameDetailPage;