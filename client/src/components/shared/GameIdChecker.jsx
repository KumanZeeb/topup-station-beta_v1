// components/shared/GameIdChecker.jsx
import React, { useState } from 'react';

const GameIdChecker = () => {
  const [selectedGame, setSelectedGame] = useState('ml');
  const [playerId, setPlayerId] = useState('');
  const [serverId, setServerId] = useState('');
  const [serverName, setServerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [playerData, setPlayerData] = useState(null);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  const games = [
    { id: 'ml', name: 'Mobile Legends', requiresServer: true, serverLabel: 'ZONE ID', serverPlaceholder: '13486', idPlaceholder: '1114917746' },
    { id: 'ff', name: 'Free Fire', requiresServer: false, idPlaceholder: '225009777' },
    { id: 'gi', name: 'Genshin Impact', requiresServer: false, idPlaceholder: '600000000' },
    { id: 'hi', name: 'Honkai Impact 3rd', requiresServer: false, idPlaceholder: '10000001' },
    { id: 'hsr', name: 'Honkai Star Rail', requiresServer: false, idPlaceholder: '600000001' },
    { id: 'zzz', name: 'Zenless Zone Zero', requiresServer: false, idPlaceholder: '1000000100' },
    { id: 'aov', name: 'Arena of Valor', requiresServer: false, idPlaceholder: '124590895269021' },
    { id: 'cod', name: 'Call of Duty Mobile', requiresServer: false, idPlaceholder: '243402956362890880' },
    { id: 'valo', name: 'Valorant', requiresServer: false, idPlaceholder: 'yuyun%23123' },
    { id: 'pgr', name: 'Punishing Gray Raven', requiresServer: true, serverLabel: 'Server (AP/EU/NA)', serverPlaceholder: 'AP', idPlaceholder: '16746755' },
    { id: 'la', name: 'LifeAfter', requiresServer: true, serverLabel: 'Server Name', serverPlaceholder: 'milestone', idPlaceholder: '22512309' },
    { id: 'mcgg', name: 'Magic Chess Go Go', requiresServer: true, serverLabel: 'ZONE ID', serverPlaceholder: '1001', idPlaceholder: '10100' },
    { id: 'ld', name: 'Love and Deepspace', requiresServer: false, idPlaceholder: '81001445172' },
    { id: 'sm', name: 'Sausage Man', requiresServer: false, idPlaceholder: '5sn9jf' },
    { id: 'sus', name: 'Super Sus', requiresServer: false, idPlaceholder: '15916600' },
    { id: 'pb', name: 'Point Blank', requiresServer: false, idPlaceholder: 'wakwaw55' }
  ];

  const currentGame = games.find(g => g.id === selectedGame);

  const validateField = (name, value) => {
    let errorMsg = '';
    
    switch(name) {
      case 'playerId':
        if (!value.trim()) errorMsg = 'Player ID wajib diisi';
        break;
      case 'serverId':
      case 'serverName':
        if (!value.trim()) errorMsg = `${currentGame.serverLabel} wajib diisi`;
        else if (selectedGame === 'pgr') {
          const upper = value.trim().toUpperCase();
          if (!['AP', 'EU', 'NA'].includes(upper)) errorMsg = 'Server harus AP, EU, atau NA';
        }
        break;
    }
    
    setErrors(prev => ({ ...prev, [name]: errorMsg }));
    return !errorMsg;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'playerId') setPlayerId(value);
    if (name === 'serverId') setServerId(value);
    if (name === 'serverName') setServerName(value);
    validateField(name, value);
  };

  const checkPlayer = async () => {
    let isValid = true;
    
    if (!playerId.trim()) {
      setErrors(prev => ({ ...prev, playerId: 'Player ID wajib diisi' }));
      isValid = false;
    }
    
    if (currentGame?.requiresServer) {
      const serverValue = serverId || serverName;
      if (!serverValue.trim()) {
        const fieldName = selectedGame === 'la' ? 'serverName' : 'serverId';
        setErrors(prev => ({ ...prev, [fieldName]: `${currentGame.serverLabel} wajib diisi` }));
        isValid = false;
      }
    }
    
    if (!isValid) return;

    setLoading(true);
    setError('');
    setPlayerData(null);

    try {
      let url = `https://validator.orenjiijussuu.workers.dev/nickname/${selectedGame}?id=${encodeURIComponent(playerId.trim())}`;
      
      if (currentGame?.requiresServer) {
        const serverValue = serverId || serverName;
        url += `&server=${encodeURIComponent(serverValue.trim())}`;
      }
      
      url += `&decode=false`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success && data.name) {
        let playerName = data.name;
        try { playerName = decodeURIComponent(data.name); } catch(e) {}
        
        // ✅ Region/Country diambil dari response API
        // Beberapa game mungkin kasih region di response
        const playerRegion = data.region || data.country || data.server_region || 'Unknown';
        
        setPlayerData({
          name: playerName,
          id: data.id || playerId,
          server: data.server || serverId || serverName || 'N/A',
          game: data.game || currentGame?.name,
          region: playerRegion,  // ✅ Region dari endpoint
          rawData: data
        });
      } else {
        setError(data.message || 'Player not found.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setPlayerId('');
    setServerId('');
    setServerName('');
    setPlayerData(null);
    setError('');
    setErrors({});
  };

  return (
    <div className="form-section">
      <div className="section-title">
        <h3>Multi-Game ID Checker</h3>
      </div>
      
      <div className="account-form">
        <div className="form-group">
          <label className="form-label">
            Pilih Game <span className="required">*</span>
          </label>
          <select 
            value={selectedGame}
            onChange={(e) => {
              setSelectedGame(e.target.value);
              resetForm();
            }}
            className="form-select"
          >
            {games.map(game => (
              <option key={game.id} value={game.id}>{game.name}</option>
            ))}
          </select>
          <div className="form-note">
            Contoh ID: {currentGame?.idPlaceholder}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            Player ID <span className="required">*</span>
          </label>
          <input 
            type="text"
            name="playerId"
            value={playerId}
            onChange={handleChange}
            className={`form-input ${errors.playerId ? 'error' : ''}`}
            placeholder={currentGame?.idPlaceholder || 'Masukkan Player ID'}
          />
          {errors.playerId && <div className="error-message">{errors.playerId}</div>}
          <div className="form-note">
            Masukkan ID player dari game yang dipilih
          </div>
        </div>

        {currentGame?.requiresServer && (
          <div className="form-group">
            <label className="form-label">
              {currentGame.serverLabel} <span className="required">*</span>
            </label>
            <input 
              type="text"
              name={currentGame.id === 'la' ? 'serverName' : 'serverId'}
              value={currentGame.id === 'la' ? serverName : serverId}
              onChange={handleChange}
              className={`form-input ${errors.serverId || errors.serverName ? 'error' : ''}`}
              placeholder={currentGame.serverPlaceholder}
            />
            {(errors.serverId || errors.serverName) && (
              <div className="error-message">{errors.serverId || errors.serverName}</div>
            )}
            <div className="form-note">
              {selectedGame === 'pgr' && 'Server options: AP, EU, NA'}
              {selectedGame === 'la' && 'Server name sesuai region akun Anda'}
              {(selectedGame === 'ml' || selectedGame === 'mcgg') && 'Server ID setelah ID player'}
            </div>
          </div>
        )}

        <button 
          onClick={checkPlayer}
          disabled={loading}
          className="submit-btn"
        >
          {loading ? 'Checking...' : `Check ${currentGame?.name}`}
        </button>

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        {playerData && (
          <div className="success-card">
            <div className="success-title">Player Verified!</div>
            <div className="player-info">
              <div className="info-row">
                <span className="info-label">Game:</span>
                <span className="info-value">{playerData.game}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Nickname:</span>
                <span className="info-value highlight">{playerData.name}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Player ID:</span>
                <span className="info-value">{playerData.id}</span>
              </div>
              {playerData.server !== 'N/A' && (
                <div className="info-row">
                  <span className="info-label">Server:</span>
                  <span className="info-value">{playerData.server}</span>
                </div>
              )}
              {/* ✅ Region dari endpoint */}
              <div className="info-row">
                <span className="info-label">Region:</span>
                <span className="info-value highlight">{playerData.region}</span>
              </div>
            </div>
            <button onClick={resetForm} className="reset-btn">
              Check Another ID
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .form-section {
          background: #0a0a0a;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
          border: 1px solid #27272a;
        }

        .section-title {
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid #27272a;
        }

        .section-title h3 {
          font-size: 18px;
          font-weight: 600;
          color: #f1f5f9;
          margin: 0;
        }

        .account-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          font-size: 13px;
          font-weight: 500;
          color: #a1a1aa;
        }

        .required {
          color: #ff1493;
        }

        .form-input, .form-select {
          padding: 12px 16px;
          background: #1a1a1a;
          border: 1px solid #27272a;
          border-radius: 8px;
          font-size: 14px;
          color: #f1f5f9;
        }

        .form-select {
          cursor: pointer;
        }

        .form-input:focus, .form-select:focus {
          outline: none;
          border-color: #ff1493;
          box-shadow: 0 0 5px rgba(255, 20, 147, 0.3);
        }

        .form-input.error, .form-select.error {
          border-color: #ff1493;
        }

        .error-message {
          font-size: 12px;
          color: #ff69b4;
        }

        .form-note {
          font-size: 11px;
          color: #71717a;
        }

        .submit-btn {
          padding: 14px;
          background: linear-gradient(135deg, #ff1493, #ff69b4);
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #0a0a0a;
          cursor: pointer;
          transition: all 0.2s;
        }

        .submit-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(255, 20, 147, 0.4);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .error-box {
          margin-top: 16px;
          padding: 12px;
          background: #2a0a1a;
          color: #ff69b4;
          border: 1px solid #ff1493;
          border-radius: 8px;
          font-size: 13px;
        }

        .success-card {
          margin-top: 20px;
          padding: 20px;
          background: #0a1a0a;
          border: 1px solid #ff1493;
          border-radius: 12px;
        }

        .success-title {
          font-size: 18px;
          font-weight: 700;
          color: #ff69b4;
          text-align: center;
          margin-bottom: 16px;
        }

        .player-info {
          background: #0a0a0a;
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 16px;
          border: 1px solid #27272a;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #27272a;
        }

        .info-row:last-child {
          border-bottom: none;
        }

        .info-label {
          font-weight: 600;
          color: #71717a;
        }

        .info-value {
          color: #e2e8f0;
        }

        .info-value.highlight {
          color: #ff69b4;
          font-weight: 500;
        }

        .reset-btn {
          width: 100%;
          padding: 12px;
          background: transparent;
          color: #ff1493;
          border: 1px solid #ff1493;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .reset-btn:hover {
          background: rgba(255, 20, 147, 0.1);
        }
      `}</style>
    </div>
  );
};

export default GameIdChecker;