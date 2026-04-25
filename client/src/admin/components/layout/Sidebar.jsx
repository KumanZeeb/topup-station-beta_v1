import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaGamepad,
  FaShoppingCart,
  FaCreditCard,
  FaUsers,
  FaTag,
  FaHeadset,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaBox,
  FaBell,
  FaFileInvoiceDollar,
  FaShieldAlt,
} from 'react-icons/fa';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin', icon: <FaTachometerAlt />, label: 'Dashboard' },
    {
      path: '/admin/products',
      icon: <FaGamepad />,
      label: 'Products',
      submenu: [
        { path: '/admin/products', label: 'All Products' },
        { path: '/admin/products/new', label: 'Add New' },
        { path: '/admin/products?category=games', label: 'Games' },
        { path: '/admin/products?category=voucher', label: 'Vouchers' },
      ],
    },
    {
      path: '/admin/orders',
      icon: <FaShoppingCart />,
      label: 'Orders',
      badge: '12',
    },
    {
      path: '/admin/payments',
      icon: <FaCreditCard />,
      label: 'Payments',
      submenu: [
        { path: '/admin/payments', label: 'All Payments' },
        {
          path: '/admin/payments/verification',
          label: 'Verification',
          badge: '5',
        },
        { path: '/admin/payments?status=pending', label: 'Pending' },
      ],
    },
    { path: '/admin/users', icon: <FaUsers />, label: 'Users' },
    { path: '/admin/promotions', icon: <FaTag />, label: 'Promotions' },
    {
      path: '/admin/support',
      icon: <FaHeadset />,
      label: 'Support',
      badge: '3',
    },
    {
      path: '/admin/reports',
      icon: <FaChartBar />,
      label: 'Reports',
      submenu: [
        { path: '/admin/reports/sales', label: 'Sales Report' },
        { path: '/admin/reports/products', label: 'Product Report' },
        { path: '/admin/reports/customers', label: 'Customer Report' },
      ],
    },
    {
      path: '/admin/settings',
      icon: <FaCog />,
      label: 'Settings',
      submenu: [
        { path: '/admin/settings/general', label: 'General' },
        { path: '/admin/settings/payment', label: 'Payment' },
        { path: '/admin/settings/notification', label: 'Notification' },
      ],
    },
  ];

  return (
    <aside className={`admin-sidebar ${isOpen ? 'open' : 'collapsed'}`}>
      <div className="sidebar-header">
        <div className="logo">
          <FaShieldAlt className="logo-icon" />
          {isOpen && <span className="logo-text">AmiraStore Admin</span>}
        </div>
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {isOpen ? '‹' : '›'}
        </button>
      </div>

      <div className="sidebar-user">
        <div className="user-avatar">
          <img
            src="https://ui-avatars.com/api/?name=Admin&background=ff5c8d&color=fff"
            alt="Admin"
          />
        </div>
        {isOpen && (
          <div className="user-info">
            <h4>Administrator</h4>
            <p className="user-role">Super Admin</p>
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item, index) => (
            <li key={index} className="nav-item">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''} ${
                    item.submenu ? 'has-submenu' : ''
                  }`
                }
              >
                <span className="nav-icon">{item.icon}</span>
                {isOpen && (
                  <>
                    <span className="nav-label">{item.label}</span>
                    {item.badge && (
                      <span className="nav-badge">{item.badge}</span>
                    )}
                    {item.submenu && <span className="nav-arrow">▾</span>}
                  </>
                )}
              </NavLink>

              {isOpen && item.submenu && (
                <ul className="submenu">
                  {item.submenu.map((sub, subIndex) => (
                    <li key={subIndex}>
                      <NavLink
                        to={sub.path}
                        className={({ isActive }) =>
                          `submenu-link ${isActive ? 'active' : ''}`
                        }
                      >
                        {sub.label}
                        {sub.badge && (
                          <span className="submenu-badge">{sub.badge}</span>
                        )}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
