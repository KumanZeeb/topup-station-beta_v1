import React, { useState } from 'react';

const ContactForm = ({ data, onChange }) => {
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validasi langsung
    validateField(name, value);
    
    // Panggil onChange dari parent
    onChange(name, value);
  };

  const validateField = (name, value) => {
    let error = '';
    
    switch(name) {
      case 'whatsapp':
        if (!value.trim()) {
          error = 'Nomor WhatsApp wajib diisi';
        } else if (!/^[0-9]+$/.test(value)) {
          error = 'Nomor WhatsApp hanya boleh angka';
        } else if (value.length < 10) {
          error = 'Nomor WhatsApp minimal 10 digit';
        } else if (value.length > 15) {
          error = 'Nomor WhatsApp maksimal 15 digit';
        }
        break;
        
      case 'email':
        if (value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Format email tidak valid';
        }
        break;
        
      default:
        break;
    }
    
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
    
    return !error;
  };

  // Format nomor WhatsApp biar rapi
  const formatWhatsApp = (number) => {
    if (!number) return '';
    // Format: 60 123-4567-890
    const cleaned = number.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{3})(\d{4})(\d{4})$/);
    if (match) {
      return `${match[1]} ${match[2]}-${match[3]}-${match[4]}`;
    }
    return number;
  };

  return (
    <div className="form-section">
      <div className="section-title">
        <i className="fa-brands fa-whatsapp" style={{ color: '#25D366' }}></i>
        <h3>Informasi Kontak</h3>
      </div>
      
      <div className="account-form">
        {/* Nomor WhatsApp */}
        <div className="form-group">
          <label className="form-label">
            Nomor WhatsApp <span className="required">*</span>
          </label>
          <div className="whatsapp-input-wrapper">
            <span className="whatsapp-prefix">+</span>
            <input 
              type="tel" 
              name="whatsapp"
              value={data.whatsapp || ''}
              className={`form-input ${errors.whatsapp ? 'error' : ''}`}
              onChange={handleChange}
              placeholder="60123456789" 
              maxLength="15"
            />
          </div>
          {errors.whatsapp && (
            <div className="error-message">
              <i className="fa-solid fa-exclamation-circle"></i>
              {errors.whatsapp}
            </div>
          )}
          {data.whatsapp && !errors.whatsapp && (
            <div className="whatsapp-preview">
              <i className="fa-brands fa-whatsapp" style={{ color: '#25D366' }}></i>
              Format: +{formatWhatsApp(data.whatsapp)}
            </div>
          )}
          <div className="whatsapp-note">
            <i className="fa-brands fa-whatsapp" style={{ color: '#25D366' }}></i>
            Notifikasi dan instruksi pembayaran akan dikirim via WhatsApp
          </div>
          <div className="form-note">
            * Gunakan kode negara tanpa tanda + (contoh: 60 untuk Malaysia, 62 untuk Indonesia)
          </div>
        </div>
        
        {/* Email (Optional) */}
        <div className="form-group">
          <label className="form-label">
            Email (Optional)
          </label>
          <input 
            type="email" 
            name="email"
            value={data.email || ''}
            className={`form-input ${errors.email ? 'error' : ''}`}
            onChange={handleChange}
            placeholder="Contoh: email@gmail.com" 
            maxLength="50"
          />
          {errors.email && (
            <div className="error-message">
              <i className="fa-solid fa-exclamation-circle"></i>
              {errors.email}
            </div>
          )}
          <div className="form-note">
            <i className="fa-regular fa-envelope"></i>
            Untuk menerima invoice pembayaran
          </div>
        </div>

        {/* Ringkasan kontak (buat preview) */}
        {(data.whatsapp || data.email) && (
          <div className="contact-summary">
            <div className="summary-title">
              <i className="fa-regular fa-circle-check" style={{ color: '#4CAF50' }}></i>
              <span>Kontak terisi:</span>
            </div>
            {data.whatsapp && !errors.whatsapp && (
              <div className="summary-item">
                <i className="fa-brands fa-whatsapp" style={{ color: '#25D366' }}></i>
                <span>+{formatWhatsApp(data.whatsapp)}</span>
              </div>
            )}
            {data.email && !errors.email && (
              <div className="summary-item">
                <i className="fa-regular fa-envelope" style={{ color: '#666' }}></i>
                <span>{data.email}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactForm;