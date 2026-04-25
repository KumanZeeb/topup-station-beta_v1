import React, { useState } from 'react';
import { FaSearch, FaBell, FaUserCircle, FaBars } from 'react-icons/fa';

const Topbar = ({ toggleSidebar }) => {
  const [notifications] = useState([
    {
      id: 1,
      message: 'New order from customer #ML231201',
      time: '5 min ago',
      unread: true,
    },
    {
      id: 2,
      message: 'Payment verification needed',
      time: '1 hour ago',
      unread: true,
    },
    {
      id: 3,
      message: 'New support ticket opened',
      time: '2 hours ago',
      unread: false,
    },
  ]);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className="admin-topbar">
      <div className="topbar-left">
        <button className="sidebar-toggler" onClick={toggleSidebar}>
          <FaBars />
        </button>

        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search orders, products, users..."
            className="search-input"
          />
        </div>
      </div>

      <div className="topbar-right">
        {/* Notifications */}
        <div className="notification-dropdown">
          <button
            className="notification-btn"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <FaBell />
            <span className="notification-badge">3</span>
          </button>

          {showNotifications && (
            <div className="notification-dropdown-menu">
              <div className="notification-header">
                <h5>Notifications</h5>
                <span className="notification-count">3 new</span>
              </div>

              <div className="notification-list">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`notification-item ${
                      notif.unread ? 'unread' : ''
                    }`}
                  >
                    <div className="notification-content">
                      <p className="notification-message">{notif.message}</p>
                      <span className="notification-time">{notif.time}</span>
                    </div>
                    {notif.unread && <div className="notification-dot"></div>}
                  </div>
                ))}
              </div>

              <div className="notification-footer">
                <button className="view-all-btn">View All Notifications</button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="profile-dropdown">
          <button
            className="profile-btn"
            onClick={() => setShowProfile(!showProfile)}
          >
            <img
              src="https://ui-avatars.com/api/?name=Admin&background=ff5c8d&color=fff"
              alt="Admin"
              className="profile-avatar"
            />
            <span className="profile-name">Admin</span>
          </button>

          {showProfile && (
            <div className="profile-dropdown-menu">
              <div className="profile-header">
                <img
                  src="https://ui-avatars.com/api/?name=Admin&background=ff5c8d&color=fff"
                  alt="Admin"
                  className="profile-image"
                />
                <div className="profile-info">
                  <h5>Administrator</h5>
                  <p>admin@amirastore.com</p>
                </div>
              </div>

              <div className="profile-menu">
                <a href="#" className="profile-menu-item">
                  <FaUserCircle /> Profile Settings
                </a>
                <a href="#" className="profile-menu-item">
                  <FaCog /> Account Settings
                </a>
                <div className="divider"></div>
                <button
                  className="profile-menu-item logout"
                  onClick={() => {
                    localStorage.removeItem('admin_token');
                    window.location.href = '/admin/login';
                  }}
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
