import React from 'react';
import { useTranslation } from '../../context/TranslationContext';
import {
  FaInstagram,
  FaTiktok,
  FaFacebook,
  FaTelegram,
  FaWhatsapp,
  FaEnvelope,
  FaHeadset,
  FaCircleQuestion,
} from 'react-icons/fa6';

const Footer = () => {
  const { t } = useTranslation(); // ✅ Guna hook
  const currentYear = new Date().getFullYear();

  const handleSocialClick = (platform) => {
    alert(t('footer.alerts.redirect', { platform }));
  };

  const handleSupportClick = (service) => {
    alert(t('footer.alerts.open', { service }));
  };

  return (
    <footer>
      {/* Logo dan Text Sejajar */}
      <div 
        className="footer-logo-section"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          marginBottom: '20px'
        }}
      >
        <img 
          src="/img/amira.png" 
          alt="AmiraStore" 
          className="footer-logo"
          style={{
            height: '44px',
            width: 'auto',
            maxWidth: '140px',
            cursor: 'pointer',
            marginBottom: '0',
            display: 'block'
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        />
        <strong 
          className="footer-brand-name"
          style={{
            fontSize: '28px',
            fontWeight: '800',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'white',
            lineHeight: '1',
            margin: '0',
            padding: '0'
          }}
        >
          AmiraStore
        </strong>
      </div>
      
      <div className="footer-desc">
        {t('footer.description')}
      </div>

      <div className="footer-grid">
        <div className="footer-section">
          <h4>{t('footer.socialMedia.title')}</h4>
          <ul>
            <li
              className="touch-feedback"
              onClick={() => handleSocialClick('Instagram')}
            >
              <FaInstagram className="footer-icon" /> {t('footer.socialMedia.instagram')}
            </li>
            <li
              className="touch-feedback"
              onClick={() => handleSocialClick('Tiktok')}
            >
              <FaTiktok className="footer-icon" /> {t('footer.socialMedia.tiktok')}
            </li>
            <li
              className="touch-feedback"
              onClick={() => handleSocialClick('Facebook')}
            >
              <FaFacebook className="footer-icon" /> {t('footer.socialMedia.facebook')}
            </li>
            <li
              className="touch-feedback"
              onClick={() => handleSocialClick('Telegram')}
            >
              <FaTelegram className="footer-icon" /> {t('footer.socialMedia.telegram')}
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>{t('footer.support.title')}</h4>
          <ul>
            <li
              className="touch-feedback"
              onClick={() => handleSupportClick('WhatsApp')}
            >
              <FaWhatsapp className="footer-icon" /> {t('footer.support.whatsapp')}
            </li>
            <li
              className="touch-feedback"
              onClick={() => handleSupportClick('Email')}
            >
              <FaEnvelope className="footer-icon" /> {t('footer.support.email')}
            </li>
            <li
              className="touch-feedback"
              onClick={() => handleSupportClick('Live Chat')}
            >
              <FaHeadset className="footer-icon" /> {t('footer.support.liveChat')}
            </li>
            <li
              className="touch-feedback"
              onClick={() => handleSupportClick('Bantuan')}
            >
              <FaCircleQuestion className="footer-icon" /> {t('footer.support.help')}
            </li>
          </ul>
        </div>
      </div>

      <div className="copyright">
        <span className="copyright-symbol">©</span> 
        <span className="copyright-year">{currentYear}</span> 
        <span className="copyright-text"> {t('footer.copyright')}</span>
      </div>
    </footer>
  );
};

export default Footer;