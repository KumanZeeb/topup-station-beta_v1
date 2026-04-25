import React from 'react';

const HeroBanner = ({ product }) => {
  // Default image kalo banner_url gak ada
  const defaultBanner = "https://images.unsplash.com/photo-1633368448195-0627e57d5b5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
  
  // Default icon kalo icon_url gak ada
  const defaultIcon = "https://via.placeholder.com/60x60?text=Game";
  
  // Ambil banner_url dan icon_url dari product
  const bannerImage = product?.banner_url || defaultBanner;
  const iconImage = product?.icon_url || defaultIcon;

  return (
    <div className="hero-banner">
      <img 
        src={bannerImage}
        alt={product?.name || 'Product Banner'}
        onError={(e) => {
          e.target.src = defaultBanner;
        }}
      />
      <div className="hero-overlay">
        <div className="hero-icon">
          <img 
            src={iconImage}
            alt={product?.name || 'Game Icon'}
            onError={(e) => {
              e.target.src = defaultIcon;
            }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              borderRadius: '16px' // Biar persegi dengan sudut agak melengkung
            }}
          />
        </div>
        <div className="hero-text">
          <h1>{product?.name || 'Mobile Legends Top Up'}</h1>
          <p>{product?.developer || 'Moonton'} • Instant • 100% Safe</p>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;