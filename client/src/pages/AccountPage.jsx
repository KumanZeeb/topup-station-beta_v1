import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { useTranslation } from '../context/TranslationContext';

// ✅ IMPORT DARI FONT AWESOME 5 (fa) - DIJAMIN AMAN!
import { 
  FaHistory,
  FaWallet, 
  FaGift, 
  FaHeadset, 
  FaCog,
  FaSignOutAlt,
  FaChevronRight,
  FaGamepad,
  FaStar,
  FaClock,
  FaCreditCard,
  FaUserCircle,
  FaEnvelope,
  FaCalendarAlt,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaFacebook,
  FaApple,
  FaSpinner
} from 'react-icons/fa';

import './../components/styles/AccountPage.css';

const AccountPage = () => {
  const { t, language } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // State untuk login form
  const [showLogin, setShowLogin] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [loginErrors, setLoginErrors] = useState({});
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Simulasi fetch user data (ngecek token/login status)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        
        // Cek apakah ada token di localStorage
        const token = localStorage.getItem('auth_token');
        
        if (!token) {
          // Belum login, tampilkan form login
          setShowLogin(true);
          setLoading(false);
          return;
        }
        
        // Simulasi fetch user data dari API
        setTimeout(() => {
          setUser({
            id: 1,
            name: 'Aku User hehe',
            email: 'aduhai@gmail.com',
            avatar: null,
            balance: 150000,
            points: 1250,
            level: 'Gold',
            joinDate: '2026-01-15'
          });
          setShowLogin(false);
          setLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error("Error fetching user:", error);
        setLoading(false);
        setShowLogin(true);
      }
    };

    fetchUser();
  }, []);

  // Handle login form input
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (loginErrors[name]) {
      setLoginErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate login form
  const validateLoginForm = () => {
    const errors = {};
    
    if (!loginData.email.trim()) {
      errors.email = t('account.login.errors.emailRequired') || 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      errors.email = t('account.login.errors.emailInvalid') || 'Email tidak valid';
    }
    
    if (!loginData.password) {
      errors.password = t('account.login.errors.passwordRequired') || 'Password wajib diisi';
    } else if (loginData.password.length < 6) {
      errors.password = t('account.login.errors.passwordMin') || 'Password minimal 6 karakter';
    }
    
    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle login submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateLoginForm()) return;
    
    setIsLoggingIn(true);
    
    try {
      // Simulasi API call login
      // Ganti dengan API call asli lu nanti
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulasi response sukses
      const mockUser = {
        id: 1,
        name: 'Aku User hehe',
        email: loginData.email,
        avatar: null,
        balance: 150000,
        points: 1250,
        level: 'Gold',
        joinDate: new Date().toISOString().split('T')[0]
      };
      
      // Simpan token ke localStorage
      localStorage.setItem('auth_token', 'mock_token_12345');
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      setUser(mockUser);
      setShowLogin(false);
      
    } catch (error) {
      console.error('Login error:', error);
      setLoginErrors({
        general: t('account.login.errors.invalidCredentials') || 'Email atau password salah'
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setUser(null);
    setShowLogin(true);
    setLoginData({ email: '', password: '' });
  };

  // Handle social login
  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
    // Implementasi social login di sini
    alert(`Login with ${provider} (coming soon)`);
  };

  // ✅ MENU ITEMS - Dengan translations
  const menuItems = [
    {
      id: 'history',
      icon: <FaHistory />,
      label: t('account.menu.history.label'),
      desc: t('account.menu.history.desc'),
      color: '#3b82f6'
    },
    {
      id: 'wallet',
      icon: <FaWallet />,
      label: t('account.menu.wallet.label'),
      desc: t('account.menu.wallet.desc'),
      color: '#8b5cf6'
    },
    {
      id: 'games',
      icon: <FaGamepad />,
      label: t('account.menu.games.label'),
      desc: t('account.menu.games.desc'),
      color: '#ff69b4'
    },
    {
      id: 'rewards',
      icon: <FaGift />,
      label: t('account.menu.rewards.label'),
      desc: t('account.menu.rewards.desc'),
      color: '#f59e0b'
    },
    {
      id: 'support',
      icon: <FaHeadset />,
      label: t('account.menu.support.label'),
      desc: t('account.menu.support.desc'),
      color: '#10b981'
    },
    {
      id: 'settings',
      icon: <FaCog />,
      label: t('account.menu.settings.label'),
      desc: t('account.menu.settings.desc'),
      color: '#64748b'
    }
  ];

  // Recent transactions
  const recentTransactions = [
    { id: 1, game: 'Mobile Legends', amount: 50000, date: '2024-01-20', status: 'success' },
    { id: 2, game: 'Free Fire', amount: 20000, date: '2024-01-19', status: 'success' },
    { id: 3, game: 'PUBG Mobile', amount: 35000, date: '2024-01-18', status: 'pending' }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat(language === 'en' ? 'en-US' : 'ms-MY', {
      style: 'currency',
      currency: language === 'en' ? 'USD' : 'MYR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Loading Skeleton
  if (loading) {
    return (
      <Layout>
        <div className="account-container">
          <div className="account-loading">
            <div className="skeleton-profile"></div>
            <div className="skeleton-balance"></div>
            <div className="skeleton-menu"></div>
            <p>{t('account.loading.profile')}</p>
          </div>
        </div>
      </Layout>
    );
  }

  // FORM LOGIN (belum login)
  if (showLogin) {
    return (
      <Layout>
        <div className="account-container">
          <div className="login-container">
            <div className="login-card">
              <div className="login-header">
                <div className="login-logo">
                  <FaUserCircle />
                </div>
                <h2>{t('account.login.title') || 'Selamat Datang Kembali'}</h2>
                <p>{t('account.login.subtitle') || 'Login untuk mengakses akun Anda'}</p>
              </div>

              {loginErrors.general && (
                <div className="login-error-general">
                  {loginErrors.general}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="login-form">
                <div className="form-group">
                  <label htmlFor="email">
                    <FaEnvelope /> {t('account.login.email') || 'Email'}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    placeholder={t('account.login.emailPlaceholder') || 'contoh@email.com'}
                    className={loginErrors.email ? 'error' : ''}
                  />
                  {loginErrors.email && (
                    <span className="error-message">{loginErrors.email}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="password">
                    <FaLock /> {t('account.login.password') || 'Password'}
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      placeholder={t('account.login.passwordPlaceholder') || '••••••••'}
                      className={loginErrors.password ? 'error' : ''}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {loginErrors.password && (
                    <span className="error-message">{loginErrors.password}</span>
                  )}
                </div>

                <div className="form-options">
                  <label className="remember-me">
                    <input type="checkbox" />
                    {t('account.login.rememberMe') || 'Ingat Saya'}
                  </label>
                  <a href="#" className="forgot-password">
                    {t('account.login.forgotPassword') || 'Lupa Password?'}
                  </a>
                </div>

                <button 
                  type="submit" 
                  className="login-btn"
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? (
                    <>
                      <FaSpinner className="spinner" /> 
                      {t('account.login.loggingIn') || 'Login...'}
                    </>
                  ) : (
                    t('account.login.button') || 'Login'
                  )}
                </button>
              </form>

              <div className="login-divider">
                <span>{t('account.login.or') || 'atau'}</span>
              </div>

              <div className="social-login">
                <button 
                  className="social-btn google"
                  onClick={() => handleSocialLogin('Google')}
                >
                  <FaGoogle /> Google
                </button>
                <button 
                  className="social-btn facebook"
                  onClick={() => handleSocialLogin('Facebook')}
                >
                  <FaFacebook /> Facebook
                </button>
                <button 
                  className="social-btn apple"
                  onClick={() => handleSocialLogin('Apple')}
                >
                  <FaApple /> Apple
                </button>
              </div>

              <div className="register-link">
                <p>
                  {t('account.login.noAccount') || 'Belum punya akun?'}{' '}
                  <a href="#">
                    {t('account.login.register') || 'Daftar Sekarang'}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // ========== USER SUDAH LOGIN - TAMPILKAN DASHBOARD ==========
  return (
    <Layout>
      <div className="account-container">
        {/* ========== PROFILE SECTION ========== */}
        <div className="profile-section">
          <div className="profile-cover">
            <div className="cover-gradient"></div>
          </div>
          
          <div className="profile-info">
            <div className="profile-avatar">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                <div className="avatar-fallback">
                  <FaUserCircle />
                </div>
              )}
              <div className="avatar-badge">
                <FaStar />
              </div>
            </div>
            
            <div className="profile-detail">
              <h1 className="profile-name">{user?.name || 'User'}</h1>
              <p className="profile-email">
                <FaEnvelope />
                {user?.email || 'email@example.com'}
              </p>
              <div className="profile-level">
                <span className="level-badge">{user?.level || t('account.profile.level')}</span>
                <span className="join-date">
                  <FaCalendarAlt />
                  {t('account.profile.joined')} {user?.joinDate || '2024'}
                </span>
              </div>
            </div>
          </div>

          {/* ========== BALANCE CARD ========== */}
          <div className="balance-card">
            <div className="balance-header">
              <FaWallet className="balance-icon" />
              <span className="balance-label">{t('account.profile.balance')}</span>
            </div>
            <div className="balance-amount">
              {formatCurrency(user?.balance || 0)}
            </div>
            <div className="balance-points">
              <FaGift />
              <span>{user?.points || 0} {t('account.profile.points')}</span>
            </div>
            <button className="topup-balance-btn">
              <FaCreditCard /> {t('account.profile.topup')}
            </button>
          </div>
        </div>

        {/* ========== MENU GRID ========== */}
        <div className="menu-section">
          <h2 className="section-title">{t('account.sections.services')}</h2>
          <div className="menu-grid">
            {menuItems.map((item) => (
              <div key={item.id} className="menu-card">
                <div className="menu-icon" style={{ background: `${item.color}15`, color: item.color }}>
                  {item.icon}
                </div>
                <div className="menu-content">
                  <h3>{item.label}</h3>
                  <p>{item.desc}</p>
                </div>
                <FaChevronRight className="menu-arrow" />
              </div>
            ))}
          </div>
        </div>

        {/* ========== RECENT TRANSACTIONS ========== */}
        <div className="transactions-section">
          <div className="section-header">
            <h2 className="section-title">{t('account.sections.recentTransactions')}</h2>
            <button className="view-all-btn">
              {t('account.sections.viewAll')} <FaChevronRight />
            </button>
          </div>

          <div className="transactions-list">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="transaction-item">
                <div className="transaction-icon">
                  <FaGamepad />
                </div>
                <div className="transaction-info">
                  <h4>{tx.game}</h4>
                  <span className="transaction-date">
                    <FaClock /> {tx.date}
                  </span>
                </div>
                <div className="transaction-amount">
                  <span className="amount">{formatCurrency(tx.amount)}</span>
                  <span className={`status ${tx.status}`}>
                    {t(`account.transactions.status.${tx.status}`)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========== LOGOUT BUTTON ========== */}
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt />
          {t('account.buttons.logout')}
        </button>

        {/* App Version */}
        <div className="app-version">
          {t('account.version')} 1.0.0
        </div>
      </div>
    </Layout>
  );
};

export default AccountPage;