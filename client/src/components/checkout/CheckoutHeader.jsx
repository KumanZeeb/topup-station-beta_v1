import React from 'react';

const CheckoutHeader = ({ product, onBack }) => {
  return (
    <header>
      <div className="logo">
        <div className="logo-text">{product?.name || 'Mobile Legends'}</div>
      </div>
    </header>
  );
};

export default CheckoutHeader;