import React, { useState } from 'react';
import { FaGem } from 'react-icons/fa6';
import { useTranslation } from '../../context/TranslationContext';
import '../styles/global.css'; // Import CSS yang dah diberi

const PromoBanner = () => {
  const { t, language } = useTranslation();
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleClose = (e) => {
    e.stopPropagation();
    setIsVisible(false);
  };

  // Content based on language
  const content = {
    en: {
      title: 'Special Promo Today!',
      subtitle: 'Discounts up to 50% for all popular games'
    },
    my: {
      title: 'Promo Istimewa Hari Ini!',
      subtitle: 'Diskaun sehingga 50% untuk semua game popular'
    }
  };

  const currentContent = content[language] || content.my;

  return (
    <div 
      className="promo-banner touch-feedback"
      onClick={() => alert(t('promo.banners.claim'))}
      style={{ position: 'relative' }} // Untuk close button
    >
      {/* Close Button */}
      <button 
        onClick={handleClose}
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          background: 'rgba(255,255,255,0.1)',
          border: 'none',
          color: '#fff',
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: '12px',
          zIndex: 2
        }}
      >
      </button>

      <div className="promo-icon">
        <FaGem />
      </div>
      <div className="promo-text">
        <h4>{currentContent.title}</h4>
        <p>{currentContent.subtitle}</p>
      </div>
    </div>
  );
};

export default PromoBanner;