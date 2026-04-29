import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from '../context/TranslationContext';

import Header from './../components/layout/Header';
import HeroBanner from '../components/checkout/HeroBanner'; // ✅ FIX: Import HeroBanner
import ProductMetrics from '../components/checkout/ProductMetrics';
import DescriptionSection from '../components/checkout/DescriptionSection';
import AccountForm from '../components/checkout/AccountForm';
import NominalSelection from '../components/checkout/NominalSelection';
import ContactForm from '../components/checkout/ContactForm';
import OrderSummary from '../components/checkout/OrderSummary';
import CheckoutSkeleton from '../components/skeletons/CheckoutSkeleton';

import '../components/styles/checkout.css';

// ✅ HARDCODE API URL langsung ke worker
const API_URL = 'https://topup-station-api-v2.maakunn470.workers.dev/api';

const WHATSAPP_NUMBER = '601173807270'; // ✅ Hardcode juga biar aman

const api = axios.create({
  baseURL: API_URL,
  withCredentials: false, // ✅ Ganti ke false karena worker nggak perlu credentials
  headers: {
    'Content-Type': 'application/json',
  }
});

const CheckoutPage = () => {
  const { t, language } = useTranslation();
  const { productSlug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [items, setItems] = useState([]);
  const [region, setRegion] = useState('MY');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNominal, setSelectedNominal] = useState(null);
  const [changingRegion, setChangingRegion] = useState(false);

  const [orderData, setOrderData] = useState({
    gameId: '',
    serverId: '',
    playerName: '',
    whatsapp: '',
    email: '',
    region: 'MY',
    nominal: null,
    subtotal: 0,
    serviceFee: 0.5,
    uniqueCode: generateUniqueCode(),
    total: 0,
    timestamp: new Date().toISOString()
  });

  useEffect(() => {
    if (!productSlug) return;

    const fetchProductAndItems = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log(`🔍 Fetching product: ${productSlug}`);
        
        // Fetch product by shortname
        const productRes = await api.get(`/products/shortname/${productSlug}`);
        
        if (!productRes.data.success || !productRes.data.data) {
          throw new Error('Product not found');
        }
        
        const productData = productRes.data.data;
        console.log('✅ Product found:', productData.name);
        
        // Filter regions (only MY, SG, ID)
        if (productData.regions && Array.isArray(productData.regions)) {
          const allowedRegions = ['MY', 'SG', 'ID'];
          productData.regions = productData.regions.filter(r => allowedRegions.includes(r));
          console.log('🌍 Regions:', productData.regions);
        }
        
        setProduct(productData);
        
        // Set default region
        const defaultRegion = productData.regions?.[0] || 'MY';
        setRegion(defaultRegion);
        setOrderData(prev => ({ ...prev, region: defaultRegion }));
        
        // Fetch items dengan filter di server (lebih efisien!)
        await fetchItemsByShortNamePrefix(productData.short_name, defaultRegion);
        
      } catch (err) {
        console.error('❌ Error:', err.message);
        setError(t('checkout.error.productNotFound') || 'Product tidak ditemukan');
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndItems();
  }, [productSlug, t]);

  const fetchItemsByShortNamePrefix = async (shortNamePrefix, regionCode) => {
    try {
      setChangingRegion(true);
      
      console.log(`🎮 Fetching items: prefix=${shortNamePrefix}, region=${regionCode}`);
      
      // ✅ LANGSUNG filter di server pake query param
      const res = await api.get('/items/all', {
        params: { 
          region_code: regionCode,
          product_short_name: shortNamePrefix  // Filter di server!
        }
      });
      
      const itemsData = res.data.data || [];
      console.log(`✅ Got ${itemsData.length} items from server`);
      
      // Debug: log sample
      if (itemsData.length > 0) {
        console.log('📋 Sample item:', {
          name: itemsData[0].name,
          amount: itemsData[0].amount,
          price: itemsData[0].price,
          region_data: itemsData[0].region_data
        });
      }
      
      if (itemsData.length === 0) {
        console.warn('⚠️ No items found');
        setItems([]);
        setSelectedNominal(null);
        return;
      }
      
      // ✅ Proses items dengan data dari worker (region_data UDAH include)
      const itemsWithPrice = itemsData.map(item => {
        // Worker udah ngasih price & region_data langsung
        const originalPrice = parseFloat(item.price) || 0;
        const markedUpPrice = originalPrice * 1.10; // Markup 10%
        
        return {
          ...item,
          amount: item.amount,
          originalPrice: originalPrice,
          price: markedUpPrice,
          stock: item.stock || 0,
          is_available: item.is_available !== false,
          region_data: item.region_data || null,
          formattedPrice: markedUpPrice > 0 
            ? `RM ${markedUpPrice.toFixed(2)}`
            : t('nominal.price')
        };
      });
      
      // Filter & sort
      const validItems = itemsWithPrice
        .filter(item => item.price > 0 && item.is_available)
        .sort((a, b) => (a.amount || 0) - (b.amount || 0));
      
      setItems(validItems);
      console.log(`✅ Final items: ${validItems.length}`);
      
      // Auto-select first item
      if (validItems.length > 0) {
        handleNominalSelect(validItems[0]);
      } else {
        setSelectedNominal(null);
        setOrderData(prev => ({
          ...prev,
          nominal: null,
          subtotal: 0,
          total: prev.serviceFee
        }));
      }
      
    } catch (err) {
      console.error('❌ Error fetching items:', err.message);
      setItems([]);
      setSelectedNominal(null);
    } finally {
      setChangingRegion(false);
    }
  };

  const handleRegionChange = async (newRegion) => {
    setRegion(newRegion);
    setOrderData(prev => ({ ...prev, region: newRegion }));
    
    if (product) {
      await fetchItemsByShortNamePrefix(product.short_name, newRegion);
    }
  };

  const handleNominalSelect = (item) => {
    const price = item.price || 0;
    setSelectedNominal(item);
    setOrderData(prev => ({
      ...prev,
      nominal: item,
      subtotal: price,
      total: price + prev.serviceFee
    }));
  };

  const getAmountOrName = () => {
    if (!selectedNominal) return '';
    
    if (selectedNominal.amount === 1) {
      return selectedNominal.name?.replace(/\s+/g, '_') || '';
    }
    
    if (selectedNominal.amount) return selectedNominal.amount;
    
    const match = selectedNominal.name?.match(/\d+/);
    return match ? match[0] : '';
  };

  const isMLBB = () => {
    const shortName = product?.short_name?.toLowerCase();
    return shortName === 'mlbb' || shortName === 'mobilelegends' || shortName?.includes('mlbb');
  };

  const sendToWhatsApp = () => {
    // Validasi
    if (isMLBB()) {
      if (!orderData.gameId || !orderData.serverId) {
        alert(t('checkout.forms.account.gameId.error'));
        return;
      }
    } else {
      if (!orderData.gameId) {
        alert('ID Game wajib diisi');
        return;
      }
    }

    if (!orderData.whatsapp) {
      alert(t('checkout.forms.contact.whatsapp.error'));
      return;
    }

    const waRegex = /^[0-9]{10,15}$/;
    if (!waRegex.test(orderData.whatsapp)) {
      alert(t('checkout.forms.contact.whatsapp.invalid'));
      return;
    }

    if (!selectedNominal) {
      alert(t('checkout.validation.selectNominal'));
      return;
    }

    const subtotal = selectedNominal.price || 0;
    const serviceFee = 0.5;
    const total = subtotal + serviceFee;
    const uniqueCode = generateUniqueCode();
    const amountOrName = getAmountOrName();
    const actualShortName = selectedNominal?.product_short_name || product?.short_name;

    let gameIdServer = orderData.gameId;
    if (isMLBB() && orderData.serverId) {
      gameIdServer = `${orderData.gameId}${orderData.serverId}`;
    }

    const message = `*AMIRASTORE - ${t('checkout.orderConfirmation.title')}*
═══════════════════════════

*${t('checkout.orderConfirmation.product')}*
${t('checkout.orderConfirmation.game')} : ${product?.name} (${actualShortName})
${t('checkout.orderConfirmation.nominal')} : ${selectedNominal?.name}
${t('checkout.nominal.price')} : RM ${(selectedNominal?.price || 0).toFixed(2)}

*${t('checkout.orderConfirmation.accountData')}*
${t('checkout.orderConfirmation.gameId')} : ${orderData.gameId}
${isMLBB() ? `${t('checkout.orderConfirmation.server')} : ${orderData.serverId}` : ''}
${t('checkout.forms.account.region.label')} : ${orderData.region}
${t('checkout.orderConfirmation.playerName')} : ${orderData.playerName || '-'}

*${t('checkout.orderConfirmation.buyerContact')}*
${t('checkout.orderConfirmation.whatsapp')} : +${orderData.whatsapp}
${t('checkout.orderConfirmation.email')} : ${orderData.email || '-'}

*${t('checkout.orderConfirmation.orderDetails')}*
${t('checkout.orderConfirmation.subtotal')} : RM ${subtotal.toFixed(2)}
${t('checkout.orderConfirmation.serviceFee')} : RM ${serviceFee.toFixed(2)}
${t('checkout.orderConfirmation.uniqueCode')} : ${uniqueCode}
${t('checkout.orderConfirmation.total')} : RM ${total.toFixed(2)}

═══════════════════════════
🕐 ${new Date().toLocaleString(language === 'en' ? 'en-US' : 'ms-MY', { 
    dateStyle: 'full',
    timeStyle: 'medium'
  })}

${t('checkout.orderConfirmation.status')}: *${t('checkout.orderConfirmation.waitingPayment')}*

═══════════════════════════
📝 ORDER FORMAT
/order ${actualShortName} ${amountOrName} ${gameIdServer}`.trim();

    const encodedMessage = encodeURIComponent(message);
    let waNumber = WHATSAPP_NUMBER.replace(/\D/g, '');
    if (waNumber.startsWith('0')) {
      waNumber = '62' + waNumber.substring(1);
    }
    const waLink = `https://wa.me/${waNumber}?text=${encodedMessage}`;
    window.open(waLink, '_blank');

    setOrderData(prev => ({
      ...prev,
      uniqueCode: uniqueCode,
      total: total
    }));
  };

  const WhatsAppFloatButton = () => {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
      const onScroll = () => setVisible(window.scrollY > 300);
      window.addEventListener('scroll', onScroll);
      return () => window.removeEventListener('scroll', onScroll);
    }, []);
    if (!visible) return null;
    const message = t('checkout.whatsapp.message', { product: product?.name || '' });
    const link = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    return (
      <div className="whatsapp-float" onClick={() => window.open(link, '_blank')}>
        <i className="fa-brands fa-whatsapp"></i>
      </div>
    );
  };

  // ===========================================
  // RENDER
  // ===========================================
  
  if (loading) {
    return (
      <div className="checkout-page">
        <Header />
        <CheckoutSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="checkout-page">
        <Header />
        <div className="checkout-error">
          <h2>{error}</h2>
          <button onClick={() => navigate('/games')}>
            {t('checkout.error.backToHome') || 'Kembali'}
          </button>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="checkout-page">
      <Header />

      <HeroBanner product={product} />

      <ProductMetrics product={product} selectedRegion={region} />

      <DescriptionSection product={product} />

      {/* Region Selector */}
      {product.regions && product.regions.length > 0 && (
        <div className="region-selector-section">
          <h3>{t('checkout.region.title')}</h3>
          <div className="region-buttons">
            {product.regions.map(reg => (
              <button
                key={reg}
                className={`region-btn ${region === reg ? 'active' : ''} ${changingRegion ? 'disabled' : ''}`}
                onClick={() => handleRegionChange(reg)}
                disabled={changingRegion}
              >
                {reg === 'MY' ? '🇲🇾 Malaysia' : 
                 reg === 'SG' ? '🇸🇬 Singapore' : 
                 reg === 'ID' ? '🇮🇩 Indonesia' : reg}
              </button>
            ))}
          </div>
          {changingRegion && (
            <div className="region-loading">
              <i className="fa-solid fa-spinner fa-spin"></i> {t('checkout.region.changing')}
            </div>
          )}
        </div>
      )}

      <AccountForm
        data={{
          gameId: orderData.gameId,
          serverId: orderData.serverId,
          region: orderData.region,
          playerName: orderData.playerName
        }}
        onChange={(name, value) => {
          setOrderData(prev => ({
            ...prev,
            [name]: value
          }));
        }}
        translations={t}
        isMLBB={isMLBB()}
      />

      <NominalSelection
        items={items}
        selectedNominal={selectedNominal}
        onSelect={handleNominalSelect}
        region={region}
        productShortName={product?.short_name}
        translations={t}
      />

      <ContactForm
        data={{
          whatsapp: orderData.whatsapp,
          email: orderData.email
        }}
        onChange={(name, value) => {
          setOrderData(prev => ({
            ...prev,
            [name]: value
          }));
        }}
        translations={t}
      />

      <OrderSummary
        product={product}
        orderData={orderData}
        selectedNominal={selectedNominal}
        onSubmit={sendToWhatsApp}
        translations={t}
      />

      <WhatsAppFloatButton />
    </div>
  );
};

function generateUniqueCode() {
  return Math.floor(Math.random() * 900 + 100);
}

export default CheckoutPage;
