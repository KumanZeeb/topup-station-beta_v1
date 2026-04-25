// client/src/components/Layout/BottomNav.jsx
import React, { useState, useEffect } from 'react';
import { FaHouse, FaGamepad, FaBolt, FaUser, FaToolbox } from 'react-icons/fa6';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeNav, setActiveNav] = useState('Home');

  useEffect(() => {
    const path = location.pathname;
    if (path === '/' || path === '/home') {
      setActiveNav('Home');
    } else if (path.includes('/games') || path.includes('/game')) {
      setActiveNav('Games');
    } else if (path.includes('/promo')) {
      setActiveNav('Promo');
    } else if (path.includes('/account') || path.includes('/profile')) {
      setActiveNav('Account');
    } else if (path.includes('/tools')) {
      setActiveNav('Tools');
    }
  }, [location.pathname]);

  const navItems = [
    { id: 'Home', icon: <FaHouse />, label: 'Home', path: '/' },
    { id: 'Games', icon: <FaGamepad />, label: 'Games', path: '/games' },
    { id: 'Promo', icon: <FaBolt />, label: 'Promo', path: '/promo' },
    { id: 'Tools', icon: <FaToolbox />, label: 'Tools', path: '/tools' },
    { id: 'Account', icon: <FaUser />, label: 'Akun', path: '/account' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <>
      <style jsx>{`
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          justify-content: space-around;
          align-items: center;
          background: #0a0a0a;
          padding: 8px 16px 20px;
          border-top: 1px solid #27272a;
          z-index: 1000;
          backdrop-filter: blur(10px);
        }

        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 6px 16px;
          border-radius: 24px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #71717a;
          position: relative;
        }

        .nav-item svg {
          font-size: 22px;
          transition: transform 0.2s ease;
        }

        .nav-item span {
          font-size: 11px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .nav-item.active {
          color: #ff1493;
        }

        .nav-item.active svg {
          transform: translateY(-2px);
        }

        .nav-item.active span {
          font-weight: 600;
          color: #ff69b4;
        }

        .nav-item.active::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 24px;
          height: 3px;
          background: linear-gradient(90deg, #ff1493, #ff69b4);
          border-radius: 2px;
        }

        .nav-item:hover:not(.active) {
          color: #a1a1aa;
          transform: translateY(-1px);
        }

        @media (max-width: 480px) {
          .nav-item {
            padding: 6px 8px;
          }
          
          .nav-item span {
            font-size: 10px;
          }
          
          .nav-item svg {
            font-size: 20px;
          }
        }
      `}</style>

      <div className="bottom-nav">
        {navItems.map((item) => (
          <div
            key={item.id}
            className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
            onClick={() => handleNavigation(item.path)}
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default BottomNav;