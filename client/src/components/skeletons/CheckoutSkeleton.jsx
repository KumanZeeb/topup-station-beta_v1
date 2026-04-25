import React from 'react';
import './Skeleton.css'; // Kita buat CSS nya nanti

const CheckoutSkeleton = () => {
  return (
    <div className="checkout-skeleton">
      {/* Header Skeleton */}
      <div className="skeleton-header">
        <div className="skeleton-logo"></div>
        <div className="skeleton-nav"></div>
      </div>

      {/* Hero Banner Skeleton */}
      <div className="skeleton-hero">
        <div className="skeleton-hero-content">
          <div className="skeleton-title"></div>
          <div className="skeleton-subtitle"></div>
        </div>
        <div className="skeleton-hero-image"></div>
      </div>

      {/* Product Metrics Skeleton */}
      <div className="skeleton-metrics">
        <div className="skeleton-metric-item"></div>
        <div className="skeleton-metric-item"></div>
        <div className="skeleton-metric-item"></div>
        <div className="skeleton-metric-item"></div>
      </div>

      {/* Description Skeleton */}
      <div className="skeleton-description">
        <div className="skeleton-description-title"></div>
        <div className="skeleton-description-line"></div>
        <div className="skeleton-description-line"></div>
        <div className="skeleton-description-line-short"></div>
      </div>

      {/* Region Selector Skeleton */}
      <div className="skeleton-region">
        <div className="skeleton-region-title"></div>
        <div className="skeleton-region-buttons">
          <div className="skeleton-region-btn"></div>
          <div className="skeleton-region-btn"></div>
          <div className="skeleton-region-btn"></div>
        </div>
      </div>

      {/* Account Form Skeleton */}
      <div className="skeleton-form">
        <div className="skeleton-form-title"></div>
        <div className="skeleton-input"></div>
        <div className="skeleton-input"></div>
        <div className="skeleton-input-short"></div>
      </div>

      {/* Nominal Selection Skeleton */}
      <div className="skeleton-nominal">
        <div className="skeleton-nominal-title"></div>
        <div className="skeleton-nominal-grid">
          <div className="skeleton-nominal-card"></div>
          <div className="skeleton-nominal-card"></div>
          <div className="skeleton-nominal-card"></div>
          <div className="skeleton-nominal-card"></div>
        </div>
      </div>

      {/* Contact Form Skeleton */}
      <div className="skeleton-contact">
        <div className="skeleton-contact-title"></div>
        <div className="skeleton-input"></div>
        <div className="skeleton-input"></div>
      </div>

      {/* Order Summary Skeleton */}
      <div className="skeleton-summary">
        <div className="skeleton-summary-title"></div>
        <div className="skeleton-summary-line"></div>
        <div className="skeleton-summary-line"></div>
        <div className="skeleton-summary-line"></div>
        <div className="skeleton-summary-button"></div>
      </div>
    </div>
  );
};

export default CheckoutSkeleton;