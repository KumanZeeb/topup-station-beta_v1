// Import all translation files
import enAccount from './en/account.json';
import enCheckout from './en/checkout.json';
import enGameDetail from './en/gameDetail.json';
import enGame from './en/game.json';
import enPromo from './en/promo.json';
import enFooter from './en/footer.json';

import myAccount from './my/account.json';
import myCheckout from './my/checkout.json';
import myGameDetail from './my/gameDetail.json';
import myGame from './my/game.json';
import myPromo from './my/promo.json';
import myFooter from './my/footer.json';

// Combine all translations
const translations = {
  en: {
    account: enAccount,
    checkout: enCheckout,
    gameDetail: enGameDetail,
    game: enGame,
    promo: enPromo,
    footer: enFooter
  },
  my: {
    account: myAccount,
    checkout: myCheckout,
    gameDetail: myGameDetail,
    game: myGame,
    promo: myPromo,
    footer: myFooter
  }
};

// Translation class
class TranslationService {
  constructor() {
    this.currentLanguage = 'en';
    this.fallbacks = {};
    this.listeners = [];
    
    // Load saved language
    this.loadSavedLanguage();
  }

  // Get current language
  getLanguage() {
    return this.currentLanguage;
  }

  // Set language
  setLanguage(lang) {
    if (translations[lang]) {
      this.currentLanguage = lang;
      localStorage.setItem('app_language', lang);
      this.notifyListeners();
    }
  }

  // Toggle language (EN <-> MY)
  toggleLanguage() {
    const newLang = this.currentLanguage === 'en' ? 'my' : 'en';
    this.setLanguage(newLang);
    return newLang;
  }

  // Main translate function
  t(key, params = {}) {
    try {      const keys = key.split('.');
      let value = translations[this.currentLanguage];
      
      // Navigate through nested objects
      for (const k of keys) {
        value = value?.[k];
        if (value === undefined) break;
      }

      // If not found in current language, try English as fallback
      if (value === undefined) {
        value = this.getFallback(key);
      }

      // If still not found, return the key
      if (value === undefined) {
        console.warn(`Translation missing for key: ${key}`);
        return key;
      }

      // Replace parameters (e.g., "Hello {name}" -> params: {name: "John"})
      return this.replaceParams(value, params);
      
    } catch (error) {
      console.error('Translation error:', error);
      return key;
    }
  }

  // Get fallback translation (English)
  getFallback(key) {
    const keys = key.split('.');
    let value = translations.en;
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) return undefined;
    }
    
    return value;
  }

  // Replace parameters in string
  replaceParams(text, params) {
    if (!text || typeof text !== 'string') return text;
    
    return text.replace(/{([^}]+)}/g, (match, key) => {
      return params[key] || match;
    });
  }

  // Check if key exists
  has(key) {
    const keys = key.split('.');
    let value = translations[this.currentLanguage];
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) return false;
    }
    
    return true;
  }

  // Load saved language from localStorage
  loadSavedLanguage() {
    try {
      const saved = localStorage.getItem('app_language');
      if (saved && translations[saved]) {
        this.currentLanguage = saved;
      }
    } catch (error) {
      console.error('Error loading language:', error);
    }
  }

  // Add change listener
  addListener(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  // Notify all listeners
  notifyListeners() {
    this.listeners.forEach(callback => callback(this.currentLanguage));
  }

  // Get all available languages
  getLanguages() {
    return Object.keys(translations);
  }
}

// ✅ CREATE AND EXPORT THE SERVICE
const translationService = new TranslationService();

// ✅ EXPORT DEFAULT
export default translationService;

// ✅ ALSO EXPORT NAMED if needed
export { translationService };