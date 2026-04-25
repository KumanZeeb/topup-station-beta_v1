// components/sections/CalculateWr.jsx
import React, { useState } from 'react';

const CalculateWr = () => {
  const [totalMatches, setTotalMatches] = useState('');
  const [currentWr, setCurrentWr] = useState('');
  const [targetWr, setTargetWr] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [timeEst, setTimeEst] = useState('');

  const calcWR = () => {
    const m = parseFloat(totalMatches);
    const c = parseFloat(currentWr);
    const t = parseFloat(targetWr);

    setError('');
    
    if (!m || isNaN(c) || isNaN(t)) {
      setError("Please fill all fields.");
      return;
    }
    
    if (t <= c) {
      setError("Target WR must be higher than current WR.");
      return;
    }
    
    if (t >= 100) {
      setError("Target WR must be below 100%.");
      return;
    }
    
    const w = m * (c / 100);
    const tr = t / 100;
    const res = Math.ceil(((tr * m) - w) / (1 - tr));
    
	if (res > 5000) {
	  setError(`Target is too high to realistically reach! But if you can, here we come: ${res.toLocaleString('en-US')} wins`);
	  return;
	}
    
    const totalHours = Math.round((res * 15) / 60);
    const totalDays = Math.floor(totalHours / 24);
    const remainingHours = totalHours % 24;
    
    let timeText = '';
    if (totalDays > 0) {
      timeText = `${totalDays} day${totalDays > 1 ? 's' : ''} ${remainingHours > 0 ? `& ${remainingHours} hours` : ''}`;
    } else {
      timeText = `${totalHours} hours`;
    }
    
    setResult(res.toLocaleString('en-US'));
    setTimeEst(`Need ${res.toLocaleString('en-US')} consecutive wins (${timeText} gameplay, ~15 mins/match)`);
  };

  const resetCalc = () => {
    setTotalMatches('');
    setCurrentWr('');
    setTargetWr('');
    setResult(null);
    setError('');
    setTimeEst('');
  };

  const ranks = [
    { name: "Warrior", sub: "III - I", requirement: "3 Stars / Tier", tierClass: "t-warrior" },
    { name: "Elite", sub: "IV - I", requirement: "4 Stars / Tier", tierClass: "t-elite" },
    { name: "Master", sub: "IV - I", requirement: "4 Stars / Tier", tierClass: "t-master" },
    { name: "Grandmaster", sub: "V - I", requirement: "5 Stars / Tier", tierClass: "t-gm" },
    { name: "Epic", sub: "V - I", requirement: "5 Stars / Tier", tierClass: "t-epic" },
    { name: "Legend", sub: "V - I", requirement: "5 Stars / Tier", tierClass: "t-legend" },
    { name: "Mythic", sub: "Placement", requirement: "0 - 24 Stars", tierClass: "t-mythic" },
    { name: "Mythical Honor", sub: "Blue Dragon", requirement: "25 - 49 Stars", tierClass: "t-mythic", textColor: "#ff69b4" },
    { name: "Mythical Glory", sub: "Pink Dragon", requirement: "50 - 99 Stars", tierClass: "t-mythic", textColor: "#ff1493" },
    { name: "Mythical Immortal", sub: "Ultimate Rank", requirement: "100+ Stars", tierClass: "t-mythic", textColor: "#ff69b4" }
  ];

  return (
    <div className="form-section">
      <div className="section-title">
        <h3>MLBB Win Rate Calculator</h3>
      </div>
      
      <div className="account-form">
        <div className="form-group">
          <label className="form-label">
            Total Matches <span className="required">*</span>
          </label>
          <input 
            type="number"
            value={totalMatches}
            onChange={(e) => setTotalMatches(e.target.value)}
            className="form-input"
            placeholder="e.g., 350"
          />
          <div className="form-note">
            Total matches played (Profile > Battlefield > Statistics)
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              Current WR (%) <span className="required">*</span>
            </label>
            <input 
              type="number"
              step="0.1"
              value={currentWr}
              onChange={(e) => setCurrentWr(e.target.value)}
              className="form-input"
              placeholder="e.g., 48.5"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">
              Target WR (%) <span className="required">*</span>
            </label>
            <input 
              type="number"
              step="0.1"
              value={targetWr}
              onChange={(e) => setTargetWr(e.target.value)}
              className="form-input"
              placeholder="e.g., 60.0"
            />
          </div>
        </div>

        <button onClick={calcWR} className="submit-btn">
          Calculate
        </button>

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        {result && (
          <div className="result-card">
            <div className="result-label">Win Streak Needed</div>
            <div className="result-number">{result}</div>
            <div className="result-desc">{timeEst}</div>
            <button onClick={resetCalc} className="reset-btn">
              Calculate Again
            </button>
          </div>
        )}
      </div>

      {/* Rank Table */}
      <div className="rank-section">
        <h4 className="rank-title">MLBB Ranks (S31+)</h4>
        
        <table className="rank-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Requirement</th>
            </tr>
          </thead>
          <tbody>
            {ranks.map((rank, idx) => (
              <tr key={idx} className={`rank-row ${rank.tierClass}`}>
                <td>
                  <span className="rank-name" style={rank.textColor ? {color: rank.textColor} : {}}>
                    {rank.name}
                  </span>
                  <span className="rank-sub">{rank.sub}</span>
                </td>
                <td className="rank-req">{rank.requirement}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="rank-footer">
          <div className="rank-footer-title">How Ranking Works</div>
          <ul className="rank-footer-list">
            <li>Win = +1 Star, Lose = -1 Star</li>
            <li>Fill all stars in a tier to promote</li>
            <li>Mythic: After 10 placement matches, rank based on total stars</li>
          </ul>
        </div>
      </div>

      {/* Info Sections */}
      <div className="info-section">
        <h4 className="info-title">How to Use This Calculator</h4>
        <p className="info-text">
          This calculator uses the standard WR formula used by Moonton.
        </p>
        <ul className="info-list">
          <li><strong>Total Matches:</strong> Enter total games played (Ranked + Classic + Brawl)</li>
          <li><strong>Current WR:</strong> Enter your current win rate percentage</li>
          <li><strong>Target WR:</strong> Enter your goal percentage</li>
        </ul>
        <p className="info-note">
          The result shows consecutive wins needed without a single loss.
        </p>
      </div>

      <div className="info-section">
        <h4 className="info-title">What is MLBB Win Rate Calculator?</h4>
        <p className="info-text">
          Stuck at 48% and trying to reach 60%? This calculator tells exactly how many consecutive wins you need to hit your target WR.
        </p>
        <p className="info-text">
          Whether fixing your account WR or grinding hero MMR for leaderboard, this tool does the math instantly.
        </p>
      </div>

      <div className="info-section">
        <h4 className="info-title">Glossary of Terms</h4>
        <ul className="info-list">
          <li><strong>Total Matches:</strong> Sum of all Ranked, Classic, and Brawl games played</li>
          <li><strong>Win Streak:</strong> Consecutive victories without losing</li>
          <li><strong>Decimals:</strong> MLBB rounds win rates (59.9% shows as 60%)</li>
        </ul>
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

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .form-label {
          font-size: 13px;
          font-weight: 500;
          color: #a1a1aa;
        }

        .required {
          color: #ff1493;
        }

        .form-input {
          padding: 12px 16px;
          background: #1a1a1a;
          border: 1px solid #27272a;
          border-radius: 8px;
          font-size: 14px;
          color: #f1f5f9;
          transition: all 0.2s;
        }

        .form-input:focus {
          outline: none;
          border-color: #ff1493;
          box-shadow: 0 0 5px rgba(255, 20, 147, 0.3);
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

        .error-box {
          margin-top: 16px;
          padding: 12px;
          background: #2a0a1a;
          color: #ff69b4;
          border: 1px solid #ff1493;
          border-radius: 8px;
          font-size: 13px;
        }

        .result-card {
          margin-top: 24px;
          padding: 20px;
          background: #1a1a1a;
          border-radius: 12px;
          text-align: center;
          border: 1px solid #27272a;
        }

        .result-label {
          font-size: 11px;
          text-transform: uppercase;
          color: #71717a;
          margin-bottom: 8px;
        }

        .result-number {
          font-size: 48px;
          font-weight: 800;
          background: linear-gradient(135deg, #ff1493, #ff69b4);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          margin: 8px 0;
        }

        .result-desc {
          font-size: 12px;
          color: #a1a1aa;
          margin-bottom: 16px;
        }

        .reset-btn {
          padding: 10px 20px;
          background: transparent;
          color: #ff1493;
          border: 1px solid #ff1493;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 12px;
          transition: all 0.2s;
        }

        .reset-btn:hover {
          background: rgba(255, 20, 147, 0.1);
        }

        .cta-link {
          display: block;
          padding: 10px;
          background: #1a1a1a;
          border: 1px solid #27272a;
          border-radius: 6px;
          color: #ff69b4;
          text-decoration: none;
          font-size: 12px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .cta-link:hover {
          border-color: #ff1493;
        }

        .rank-section {
          margin-top: 32px;
        }

        .rank-title {
          font-size: 16px;
          font-weight: 600;
          color: #f1f5f9;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid #27272a;
        }

        .rank-table {
          width: 100%;
          border-collapse: collapse;
        }

        .rank-table th {
          text-align: left;
          padding: 10px 8px;
          font-size: 12px;
          font-weight: 600;
          color: #71717a;
          border-bottom: 1px solid #27272a;
        }

        .rank-table td {
          padding: 10px 8px;
          border-bottom: 1px solid #1a1a1a;
        }

        .rank-row {
          border-left: 3px solid transparent;
        }

        .rank-row.t-warrior { border-left-color: #a0522d; }
        .rank-row.t-elite { border-left-color: #c0c0c0; }
        .rank-row.t-master { border-left-color: #ffd700; }
        .rank-row.t-gm { border-left-color: #00ced1; }
        .rank-row.t-epic { border-left-color: #20b2aa; }
        .rank-row.t-legend { border-left-color: #dc143c; }
        .rank-row.t-mythic { border-left-color: #ff1493; }

        .rank-name {
          display: block;
          font-weight: 700;
          font-size: 14px;
          color: #f1f5f9;
        }

        .rank-sub {
          font-size: 10px;
          color: #71717a;
        }

        .rank-req {
          font-size: 13px;
          color: #a1a1aa;
          text-align: right;
        }

        .rank-footer {
          margin-top: 20px;
          padding: 16px;
          background: #1a1a1a;
          border-radius: 8px;
          border: 1px solid #27272a;
        }

        .rank-footer-title {
          font-weight: 700;
          font-size: 12px;
          color: #ff69b4;
          margin-bottom: 8px;
        }

        .rank-footer-list {
          margin: 0;
          padding-left: 20px;
          font-size: 12px;
          color: #a1a1aa;
        }

        .rank-footer-list li {
          margin: 4px 0;
        }

        .info-section {
          margin-top: 24px;
          padding: 20px;
          background: #1a1a1a;
          border-radius: 12px;
          border: 1px solid #27272a;
        }

        .info-title {
          font-size: 15px;
          font-weight: 600;
          color: #ff69b4;
          margin-bottom: 12px;
        }

        .info-text {
          font-size: 13px;
          color: #a1a1aa;
          line-height: 1.5;
          margin-bottom: 12px;
        }

        .info-list {
          margin: 0;
          padding-left: 20px;
          font-size: 13px;
          color: #a1a1aa;
        }

        .info-list li {
          margin: 6px 0;
        }

        .info-note {
          margin-top: 12px;
          font-size: 12px;
          color: #ff69b4;
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default CalculateWr;