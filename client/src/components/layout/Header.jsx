// Header.jsx - WITH LANGUAGE BUTTON
import React, { useState } from 'react';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('en'); // 'en' atau 'my'

  const handleLogoClick = () => {
    navigate('/'); // Navigasi ke halaman utama
  };

  const handleSearchClick = () => {
    alert('Search');
  };

  const toggleLanguage = () => {
    setLanguage(prevLang => prevLang === 'en' ? 'my' : 'en');
    // Nanti kat sini boleh tambah logic untuk update content
    // Contoh: dispatch action, update context, etc.
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 16px',
      height: '60px',
      background: '#000',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000
    }}>
      {/* Logo - Klik bisa ke home */}
      <img 
        src="/img/amira.png" 
        alt="Logo"
        onClick={handleLogoClick}
        style={{
          height: '36px',
          width: 'auto',
          maxWidth: '120px',
          cursor: 'pointer',
          transition: 'opacity 0.2s ease'
        }}
        onMouseEnter={(e) => e.target.style.opacity = '0.8'}
        onMouseLeave={(e) => e.target.style.opacity = '1'}
      />
      
      {/* Right side items - search + language */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
      }}>
        {/* Language Switch Button */}
        <button
          onClick={toggleLanguage}
          style={{
            background: 'transparent',
            border: '2px solid pink',
            borderRadius: '20px',
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 192, 203, 0.1)';
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.transform = 'scale(1)';
          }}
        >
          <span style={{
            color: language === 'en' ? 'pink' : '#fff',
            fontWeight: language === 'en' ? 'bold' : 'normal',
            transition: 'all 0.3s ease'
          }}>
            EN
          </span>
          <span style={{
            width: '4px',
            height: '4px',
            background: 'pink',
            borderRadius: '50%',
            display: 'inline-block'
          }}></span>
          <span style={{
            color: language === 'my' ? 'pink' : '#fff',
            fontWeight: language === 'my' ? 'bold' : 'normal',
            transition: 'all 0.3s ease'
          }}>
            MY
          </span>
        </button>

        {/* Search icon */}
        <FaMagnifyingGlass 
          style={{
            color: 'pink',
            fontSize: '20px',
            cursor: 'pointer',
            transition: 'transform 0.2s ease'
          }}
          onClick={handleSearchClick}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        />
      </div>
    </div>
  );
};

export default Header;