import React from 'react';
import { FaBolt, FaFire, FaCrown, FaWallet } from 'react-icons/fa6';

const QuickActions = () => {
  const actions = [
    { icon: <FaBolt />, label: 'Flash Sale' },
    { icon: <FaFire />, label: 'Trending' },
    { icon: <FaCrown />, label: 'Premium' },
  ];

  const handleActionClick = (label) => {
    alert(`Akses cepat ke: ${label}`);
  };

  return (
    <div className="quick-actions">
      {actions.map((action, index) => (
        <div
          key={index}
          className="quick-action touch-feedback"
          onClick={() => handleActionClick(action.label)}
        >
          {action.icon}
          <span>{action.label}</span>
        </div>
      ))}
    </div>
  );
};

export default QuickActions;
