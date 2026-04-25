import React, { useState } from 'react';

const AccountForm = ({ data, onChange, translations, isMLBB = false }) => {
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
      case 'gameId':
        if (!value.trim()) {
          error = 'ID Game wajib diisi';
        } else if (!/^\d+$/.test(value)) {
          error = 'ID Game hanya boleh angka';
        } else if (value.length < 5) {
          error = 'ID Game minimal 5 digit';
        }
        break;
        
      case 'serverId':
        // Server ID hanya wajib untuk MLBB
        if (isMLBB) {
          if (!value.trim()) {
            error = 'Server ID wajib diisi';
          } else if (!/^\d+$/.test(value)) {
            error = 'Server ID hanya boleh angka';
          } else if (value.length < 3) {
            error = 'Server ID minimal 3 digit';
          }
        } else {
          // Untuk game lain, server ID optional
          if (value.trim() && !/^\d+$/.test(value)) {
            error = 'Server ID hanya boleh angka';
          }
        }
        break;
        
      case 'region':
        if (!value.trim()) {
          error = 'Region wajib diisi';
        }
        break;
        
      case 'playerName':
        // Optional, gak perlu validasi
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

  // Format data untuk WhatsApp
  const formatForWhatsApp = () => {
    let serverField = '';
    if (isMLBB) {
      serverField = `🆔 Server: ${data.serverId || '-'}\n`;
    }
    
    return `
*DATA AKUN GAME*
📱 ID Game: ${data.gameId || '-'}
${serverField}🌏 Region: ${data.region || '-'}
👤 Player Name: ${data.playerName || '-'}
    `.trim();
  };

  return (
    <div className="form-section">
      <div className="section-title">
        <i className="fa-solid fa-user"></i>
        <h3>Data Akun Game</h3>
      </div>
      
      <div className="account-form">
        {/* ID Game */}
        <div className="form-group">
          <label className="form-label">
            ID Game <span className="required">*</span>
          </label>
          <input 
            type="text" 
            name="gameId"
            value={data.gameId || ''}
            className={`form-input ${errors.gameId ? 'error' : ''}`}
            onChange={handleChange}
            placeholder="Contoh: 12345678" 
            maxLength="20"
          />
          {errors.gameId && (
            <div className="error-message">{errors.gameId}</div>
          )}
          <div className="form-note">
            ID dapat ditemukan di menu profile game (pojok kiri atas)
          </div>
        </div>
        
        {/* Server ID - HANYA TAMPIL UNTUK MLBB */}
        {isMLBB && (
          <div className="form-group">
            <label className="form-label">
              Server ID <span className="required">*</span>
            </label>
            <input 
              type="text" 
              name="serverId"
              value={data.serverId || ''}
              className={`form-input ${errors.serverId ? 'error' : ''}`}
              onChange={handleChange}
              placeholder="Contoh: 1234" 
              maxLength="10"
            />
            {errors.serverId && (
              <div className="error-message">{errors.serverId}</div>
            )}
            <div className="form-note">
              Server ID 4 digit terakhir setelah ID game (ID: 12345678 Server: 1234)
            </div>
          </div>
        )}
        
        {/* Region */}
        <div className="form-group">
          <label className="form-label">
            Region <span className="required">*</span>
          </label>
          <input 
            type="text" 
            name="region"
            value={data.region || ''}
            className={`form-input ${errors.region ? 'error' : ''}`}
            onChange={handleChange}
            placeholder="Contoh: Malaysia" 
            maxLength="20"
          />
          {errors.region && (
            <div className="error-message">{errors.region}</div>
          )}
          <div className="form-note">
            Region akun game (Malaysia, Indonesia, dll)
          </div>
        </div>
        
        {/* Player Name (Optional) */}
        <div className="form-group">
          <label className="form-label">
            Nama Pemain (Optional)
          </label>
          <input 
            type="text" 
            name="playerName"
            value={data.playerName || ''}
            className="form-input"
            onChange={handleChange}
            placeholder="Contoh: ProPlayer123" 
            maxLength="30"
          />
          <div className="form-note">
            Nama karakter di game (untuk verifikasi)
          </div>
        </div>

        {/* Hidden preview untuk debugging (optional) */}
        <div className="whatsapp-preview" style={{ display: 'none' }}>
          {formatForWhatsApp()}
        </div>
      </div>
    </div>
  );
};

export default AccountForm;