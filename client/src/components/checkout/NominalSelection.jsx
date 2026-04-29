import React from 'react';

const NominalSelection = ({ items, selectedNominal, onSelect, region, productShortName, translations }) => {
  
  // Fungsi untuk dapatkan unit
  const getUnit = (shortName) => {
    const units = {
      'mlbb': 'Diamonds',
      'mlbb_special': 'Diamonds',
      'mlbb_premium': 'Diamonds',
      'mlbb_weekly': 'Diamonds',
      'hok': 'Token',
      'hok_special': 'Token',
      'pubgm': 'UC',
      'pubgm_special': 'UC',
      'codm_sgmy': 'CP',
      'freefire': 'Diamonds',
      'gi': 'Genesis Crystals',
      'valo': 'VP',
      'steam': 'Wallet'
    };
    return units[shortName?.toLowerCase()] || '';
  };

  // Fungsi buat bersihin underscore jadi spasi
  const formatName = (name) => {
    if (!name) return '';
    return name.replace(/_/g, ' ');
  };

  // Fungsi buat dapetin status stok
  const getStockStatus = (stock) => {
    if (stock === -1) {
      return {
        label: 'Unlimited Stock',
        className: 'stock-unlimited'
      };
    }
    
    if (stock === 0) {
      return {
        label: 'Out of Stock',
        className: 'stock-out'
      };
    }
    
    if (stock < 100) {
      return {
        label: `Almost Gone - ${stock} left`,
        className: 'stock-low'
      };
    }
    
    if (stock < 500) {
      return {
        label: `Best Seller - ${stock} sold`,
        className: 'stock-bestseller'
      };
    }
    
    if (stock < 1000) {
      return {
        label: `${stock} in stock`,
        className: 'stock-available'
      };
    }
    
    return {
      label: 'Plenty of Stock',
      className: 'stock-plenty'
    };
  };

  if (!items || items.length === 0) {
    return (
      <div className="nominal-section">
        <h3>{translations?.nominal?.title || 'Pilih Nominal'}</h3>
        <div className="nominal-empty">
          <p>{translations?.nominal?.empty || `No nominals available for region ${region}`}</p>
        </div>
      </div>
    );
  }

  const availableItems = items.filter(item => item.price > 0);

  return (
    <div className="nominal-section">
      <h3>{translations?.nominal?.title || 'Pilih Nominal'}</h3>
      
      <div className="nominal-grid">
        {availableItems.map(item => {
          const unit = getUnit(productShortName || item.product_short_name);
          const isMembership = item.amount === 1;
          const stockStatus = getStockStatus(item.stock);
          const isOutOfStock = item.stock === 0;
          
          return (
            <div 
              key={item.id}
              className={`nominal-card ${selectedNominal?.id === item.id ? 'selected' : ''} ${isOutOfStock ? 'disabled' : ''}`}
              onClick={() => !isOutOfStock && onSelect(item)}
              style={isOutOfStock ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
            >
              <div className="nominal-amount">
                {isMembership 
                  ? formatName(item.name || 'Premium Pack')
                  : `${item.amount || item.name?.match(/\d+/)?.[0] || ''} ${unit}`.trim()
                }
              </div>
              
              {isMembership && (
                <div className="nominal-name">Membership</div>
              )}
              
              <div className="nominal-price">
                {item.formattedPrice || `RM ${parseFloat(item.price).toFixed(2)}`}
              </div>
              
              {/* Stock Badge */}
              <div className={`stock-badge ${stockStatus.className}`}>
                {stockStatus.label}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Stock Legend */}
      <div className="stock-legend">
        <span className="legend-item">
          <span className="legend-dot stock-unlimited"></span> Unlimited
        </span>
        <span className="legend-item">
          <span className="legend-dot stock-plenty"></span> Plenty
        </span>
        <span className="legend-item">
          <span className="legend-dot stock-bestseller"></span> Best Seller
        </span>
        <span className="legend-item">
          <span className="legend-dot stock-low"></span> Almost Gone
        </span>
        <span className="legend-item">
          <span className="legend-dot stock-out"></span> Sold Out
        </span>
      </div>
    </div>
  );
};

export default NominalSelection;
