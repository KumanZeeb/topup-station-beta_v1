import React, { useState } from 'react';
import {
  FaGamepad,
  FaGem,
  FaWallet,
  FaTag,
  FaMobileScreen,
} from 'react-icons/fa6';

const Tabs = () => {
  const [activeTab, setActiveTab] = useState('Games');

  const tabs = [
    { id: 'Games', icon: <FaGamepad />, label: 'Games' },
    { id: 'Premium', icon: <FaGem />, label: 'App Premium' },
  ];

  return (
    <div className="tabs-container">
      <div className="tabs-scroll">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab touch-feedback ${
              activeTab === tab.id ? 'active' : ''
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} {tab.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
