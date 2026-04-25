import React, { useState, useEffect } from 'react';
import './../styles/BannerSlider.css';

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = [
    { id: 1, image: '/img/banner.jpg' },
    { id: 2, image: '/img/banner2.png' },
    { id: 3, image: '/img/banner3.png' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [banners.length]);

  const goToSlide = (index) => setCurrentSlide(index);
  const goNext = () =>
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  const goPrev = () =>
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);

  return (
    <div className="banner-slider">
      {/* VIEWPORT (PENTING) */}
      <div className="slider-viewport">
        <div
          className="slides-container"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {banners.map((banner, index) => (
            <div className="slide" key={banner.id}>
              <img
                src={banner.image}
                alt={`Banner ${index + 1}`}
                className="slide-image"
                onError={(e) => {
                  e.target.src =
                    'https://via.placeholder.com/800x250/ff4d8d/ffffff?text=AMIRA+BANNER';
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* DOTS */}
      <div className="slider-dots">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      {/* ARROWS */}
      <button className="slider-arrow prev-arrow" onClick={goPrev}>
        ‹
      </button>
      <button className="slider-arrow next-arrow" onClick={goNext}>
        ›
      </button>
    </div>
  );
};

console.log('🔥 BANNER RENDER');

export default Banner;
