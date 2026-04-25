// pages/tools.jsx - versi neon pink
import React, { useState } from 'react';
import CalculateWr from '../components/sections/CalculateWr';
import GameIdChecker from '../components/shared/GameIdChecker';

const ToolsPage = () => {
  const [activeTool, setActiveTool] = useState('winrate');

  return (
    <div className="tools-container">
      <div className="tools-header">
        <h1 className="tools-title">Gaming Tools</h1>
        <p className="tools-subtitle">Win Rate Calculator & Game ID Validator</p>
      </div>

      <div className="tools-tabs">
        <button
          onClick={() => setActiveTool('winrate')}
          className={`tab-btn ${activeTool === 'winrate' ? 'active' : ''}`}
        >
          Win Rate Calculator
        </button>
        <button
          onClick={() => setActiveTool('checker')}
          className={`tab-btn ${activeTool === 'checker' ? 'active' : ''}`}
        >
          Game ID Checker
        </button>
      </div>

      <div className="tools-content">
        {activeTool === 'winrate' ? <CalculateWr /> : <GameIdChecker />}
      </div>

      <style jsx>{`
        .tools-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          min-height: 100vh;
          background: #0a0a0a;
        }

        .tools-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .tools-title {
          font-size: 32px;
          font-weight: 800;
          background: linear-gradient(135deg, #ff69b4, #ff1493, #ff69b4);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: shine 3s linear infinite;
          margin-bottom: 8px;
        }

        @keyframes shine {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        .tools-subtitle {
          font-size: 14px;
          color: #a1a1aa;
        }

        .tools-tabs {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          border-bottom: 1px solid #27272a;
          padding-bottom: 12px;
        }

        .tab-btn {
          padding: 10px 20px;
          background: transparent;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          color: #a1a1aa;
          transition: all 0.2s;
          position: relative;
        }

        .tab-btn.active {
          background: linear-gradient(135deg, #ff1493, #ff69b4);
          color: #0a0a0a;
          box-shadow: 0 0 15px rgba(255, 20, 147, 0.4);
        }

        .tab-btn:hover:not(.active) {
          color: #ff69b4;
          background: #1a1a1a;
        }

        .tools-content {
          min-height: 500px;
        }
      `}</style>
    </div>
  );
};

export default ToolsPage;