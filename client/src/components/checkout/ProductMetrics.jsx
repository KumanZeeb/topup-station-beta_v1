import React from 'react';
import { FaBolt, FaShieldAlt, FaUsers } from 'react-icons/fa';

const ProductMetrics = ({ product }) => {
  // Map icon components
  const getIcon = (iconName) => {
    const icons = {
      'fa-solid fa-bolt': <FaBolt />,
      'fa-solid fa-shield-alt': <FaShieldAlt />,
      'fa-solid fa-users': <FaUsers />,
      // Tambahin mapping lain sesuai kebutuhan
    };
    return icons[iconName] || <FaBolt />; // Default fallback
  };

  const metrics = product?.metrics || [
    { icon: 'fa-solid fa-bolt', value: 'Instant', label: 'Delivery' },
    { icon: 'fa-solid fa-shield-alt', value: '100%', label: 'Safe' },
    { icon: 'fa-solid fa-users', value: '50K+', label: 'Customers' }
  ];

  return (
    <div className="product-metrics">
      {metrics.map((metric, index) => (
        <div key={index} className="metric-card">
          <div className="metric-icon">
            {getIcon(metric.icon)}
          </div>
          <div className="metric-value">{metric.value}</div>
          <div className="metric-label">{metric.label}</div>
        </div>
      ))}
    </div>
  );
};

export default ProductMetrics;