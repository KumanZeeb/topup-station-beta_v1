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

  if (!items || items.length === 0) {
    return (
      <div className="nominal-section">
        <h3>{translations?.nominal?.title || 'Pilih Nominal'}</h3>
        <div className="nominal-empty">
          <p>{translations?.nominal?.empty || `Tidak ada nominal tersedia untuk region ${region}`}</p>
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
          
          return (
            <div 
              key={item.id}
              className={`nominal-card ${selectedNominal?.id === item.id ? 'selected' : ''}`}
              onClick={() => onSelect(item)}
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
                {item.formattedPrice || `RM ${item.price.toFixed(2)}`}
              </div>
              
              {item.stock === 0 && (
                <div className="nominal-stock">{translations?.nominal?.outOfStock || 'Stok Habis'}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NominalSelection;
