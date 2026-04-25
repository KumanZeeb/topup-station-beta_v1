import React from 'react';

const OrderSummary = ({ product, orderData, selectedNominal, onSubmit }) => {
  // Hitung total tanpa kode unik
  const calculateTotal = () => {
    const subtotal = selectedNominal?.price || 0;
    const serviceFee = orderData.serviceFee || 0;
    return (subtotal + serviceFee).toFixed(2);
  };
  
  return (
    <div className="order-summary-section">
      <div className="section-title">
        <i className="fa-solid fa-receipt"></i>
        <h3>Ringkasan Pesanan</h3>
      </div>
      
      <div className="order-summary">
        <div className="summary-row">
          <span>Game:</span>
          <span className="summary-value">{product?.name}</span>
        </div>
        
        <div className="summary-row">
          <span>Nominal:</span>
          <span className="summary-value">
            {selectedNominal?.name || 'Belum dipilih'}
          </span>
        </div>
        
        <div className="summary-row">
          <span>Harga:</span>
          <span className="summary-value">
            RM {selectedNominal?.price?.toFixed(2) || '0.00'}
          </span>
        </div>
        
        <div className="summary-row">
          <span>ID Game:</span>
          <span className="summary-value">{orderData.gameId || '-'}</span>
        </div>
        
        <div className="summary-row">
          <span>Server:</span>
          <span className="summary-value">{orderData.serverId || '-'}</span>
        </div>
        
        <div className="summary-row">
          <span>WhatsApp:</span>
          <span className="summary-value">+{orderData.whatsapp || '-'}</span>
        </div>
        
        <div className="summary-divider"></div>
        
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>RM {selectedNominal?.price?.toFixed(2) || '0.00'}</span>
        </div>
        
        <div className="summary-row">
          <span>Service Fee:</span>
          <span>RM {orderData.serviceFee?.toFixed(2) || '0.00'}</span>
        </div>
        
        {/* Kode Unik - Hanya Display, Tidak Masuk Perhitungan */}
        <div className="summary-row highlight-row">
          <span>Kode Unik:</span>
          <span className="unique-code">{orderData.uniqueCode}</span>
        </div>
        
        <div className="summary-total">
          <span>Total:</span>
          <span className="total-price">RM {calculateTotal()}</span>
        </div>
        
        <button 
          className="submit-order-btn"
          onClick={onSubmit}
        >
          <i className="fa-brands fa-whatsapp"></i>
          ORDER NOW
        </button>

        {/* Info kecil bahwa kode unik untuk verifikasi */}
        <div className="unique-code-info">
          *Kode unik untuk verifikasi pesanan
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;