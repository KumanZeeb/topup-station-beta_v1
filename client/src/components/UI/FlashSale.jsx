// client/src/components/UI/FlashSale.jsx
import React, { useState, useEffect } from 'react';
import { FaBolt, FaArrowRight, FaFire } from 'react-icons/fa6';
import './../styles/FlashSale.css';

const FlashSale = () => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);

  // Dummy data flash sale products
  const flashProducts = [
    { id: 1, name: 'Mobile Legends', discount: '50%', icon: '🎮', price: 'Rp 25.000', original: 'Rp 50.000' },
    { id: 2, name: 'Free Fire', discount: '40%', icon: '🔥', price: 'Rp 12.000', original: 'Rp 20.000' },
    { id: 3, name: 'PUBG Mobile', discount: '30%', icon: '🪖', price: 'Rp 35.000', original: 'Rp 50.000' },
    { id: 4, name: 'Valorant', discount: '25%', icon: '🔫', price: 'Rp 45.000', original: 'Rp 60.000' },
    { id: 5, name: 'Genshin Impact', discount: '20%', icon: '🌟', price: 'Rp 80.000', original: 'Rp 100.000' },
  ];

  // 🔥 Reset jam 12 malam
  const getNextMidnight = () => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    return midnight.getTime();
  };

  useEffect(() => {
    const calculateEndTime = () => {
      const savedEnd = localStorage.getItem('flashSaleEnd');
      const now = Date.now();
      const nextMidnight = getNextMidnight();

      if (!savedEnd || Number(savedEnd) < now) {
        const newEnd = nextMidnight;
        localStorage.setItem('flashSaleEnd', newEnd);
        return newEnd;
      }
      return Number(savedEnd);
    };

    const endTime = calculateEndTime();

    const updateTimer = () => {
      const diff = endTime - Date.now();
      setTimeLeft(diff > 0 ? diff : 0);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, []);

  // Cek midnight tiap menit
  useEffect(() => {
    const checkMidnight = setInterval(() => {
      const savedEnd = localStorage.getItem('flashSaleEnd');
      if (savedEnd && Number(savedEnd) < Date.now()) {
        const newEnd = getNextMidnight();
        localStorage.setItem('flashSaleEnd', newEnd);
        setTimeLeft(newEnd - Date.now());
      }
    }, 60000);
    return () => clearInterval(checkMidnight);
  }, []);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % flashProducts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  const format = (n) => String(n).padStart(2, '0');

  return (
    <div className="flash-sale-container">
      {/* HEADER */}
      <div className="flash-sale-header">
        <div className="flash-sale-title">
          <div className="flash-icon">
            <FaFire />
          </div>
          <div className="flash-text">
            <h2>FLASH SALE</h2>
            <span className="flash-subtitle">Diskon spesial hari ini!</span>
          </div>
        </div>
        
        {/* TIMER */}
        <div className="flash-timer">
          <div className="timer-box">
            <span className="timer-value">{format(hours)}</span>
            <span className="timer-label">Jam</span>
          </div>
          <span className="timer-separator">:</span>
          <div className="timer-box">
            <span className="timer-value">{format(minutes)}</span>
            <span className="timer-label">Menit</span>
          </div>
          <span className="timer-separator">:</span>
          <div className="timer-box">
            <span className="timer-value">{format(seconds)}</span>
            <span className="timer-label">Detik</span>
          </div>
        </div>
        
        <div className="view-all-btn">
          <span>Lihat Semua</span>
          <FaArrowRight />
        </div>
      </div>

      {/* PRODUCT SLIDER */}
      <div className="flash-sale-slider">
        {flashProducts.map((product, index) => (
          <div 
            key={product.id}
            className={`flash-product-card ${index === activeSlide ? 'active' : ''}`}
            style={{ 
              transform: `translateX(-${activeSlide * 100}%)`,
              opacity: index === activeSlide ? 1 : 0.7
            }}
          >
            <div className="product-discount-badge">
              <FaBolt />
              {product.discount}
            </div>
            <div className="product-icon">
              {product.icon}
            </div>
            <div className="product-info">
              <h4>{product.name}</h4>
              <div className="product-price">
                <span className="current-price">{product.price}</span>
                <span className="original-price">{product.original}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DOTS INDICATOR */}
      <div className="slider-dots">
        {flashProducts.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === activeSlide ? 'active' : ''}`}
            onClick={() => setActiveSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default FlashSale;