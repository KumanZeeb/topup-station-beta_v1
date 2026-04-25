// client/src/components/UI/ProductCard.jsx
import React from 'react';
import './../styles/ProductCard.css';

const ProductCard = ({
  product_id,
  short_name,
  badge,
  name,
  developer,
  icon_url,
  category,
  price, // 💰 harga topup
  is_featured = false,
  is_flash_sale = false,
  is_popular = false,
  onProductClick,
  isLoading = false
}) => {

  // 🔍 DEBUG PROPS - hapus kalau udah production
  if (process.env.NODE_ENV === 'development') {
    console.log("📦 ProductCard [Topup]:", { 
      id: product_id, 
      name, 
      price,
      icon_url: icon_url?.substring(0, 50)
    });
  }

  const handleClick = () => {
    if (!short_name) {
      console.error('❌ short_name missing:', product_id);
      return;
    }
    onProductClick?.(short_name);
  };

  /**
   * Resolve Image URL - Supabase bucket "image"
   */
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    if (path.includes('/')) return path; // path dari Supabase
    return `/images/${path}`;
  };

  if (isLoading) {
    return (
      <div className="product-card topup-card-skeleton">
        <div className="product-icon-wrapper">
          <div className="skeleton-icon"></div>
        </div>
        <div className="product-info">
          <div className="skeleton-title"></div>
          <div className="skeleton-price"></div>
        </div>
      </div>
    );
  }

  const imageUrl = getImageUrl(icon_url);

  // Format harga
  const formatPrice = (price) => {
    if (!price) return '—';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div 
      className="product-card topup-card" 
      onClick={handleClick}
      style={{
        '--shadow-color': '#ff69b4', // pink shadow variable
      }}
    >
      
      {/* 🖼 ICON WRAPPER */}
      <div className="product-icon-wrapper">
        {imageUrl ? (
          <img
            className="product-icon"
            src={imageUrl}
            alt={name}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || '?')}&background=8b5cf6&color=fff&size=128&length=2&font-size=0.5&rounded=true`;
            }}
          />
        ) : (
          <div className="product-icon-fallback">
            {(name || 'PD').slice(0, 2).toUpperCase()}
          </div>
        )}

        {/* 🏷 BADGE - Sesuai kebutuhan topup */}
        {is_flash_sale && (
          <div className="product-badge flash-sale">
            🔥 FLASH
          </div>
        )}
        {is_popular && !is_flash_sale && (
          <div className="product-badge popular">
            ⚡ POPULAR
          </div>
        )}
        {is_featured && !is_flash_sale && !is_popular && (
          <div className="product-badge featured">
            🏆 FEATURED
          </div>
        )}
      </div>

      {/* ℹ️ PRODUCT INFO - Topup Style */}
      <div className="product-info">
        <h3 className="product-title">
          {name || 'No Name'}
        </h3>
        
        {/* Developer/Category (optional) */}
        {developer && (
          <p className="product-developer">
            {developer}
          </p>
        )}
        
        {/* 💰 HARGA TOPUP - Yang paling menonjol! */}
        <div className="product-price">
          {formatPrice(price)}
        </div>

        {/* DEBUG SLUG - hidden di production */}
        {process.env.NODE_ENV === 'development' && (
          <small style={{ opacity: 0.3, fontSize: 10, color: '#94a3b8' }}>
            {short_name || 'NO_SLUG'}
          </small>
        )}
      </div>

    </div>
  );
};

export default ProductCard;