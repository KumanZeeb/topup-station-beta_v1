import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from '../context/TranslationContext';

import Header from './../components/layout/Header';
import HeroBanner from '../components/Checkout/HeroBanner';
import ProductMetrics from '../components/Checkout/ProductMetrics';
import DescriptionSection from '../components/Checkout/DescriptionSection';
import AccountForm from '../components/Checkout/AccountForm';
import NominalSelection from '../components/Checkout/NominalSelection';
import ContactForm from '../components/Checkout/ContactForm';
import OrderSummary from '../components/Checkout/OrderSummary';
import CheckoutSkeleton from '../components/skeletons/CheckoutSkeleton';

import '../components/styles/checkout.css';

const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : (window.API_URL || '/api');
const WHATSAPP_NUMBER = window.WHATSAPP_NUMBER || '601173807270';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
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
        
        console.log(`Fetching product with shortname: ${productSlug}`);
        
        const productRes = await api.get(`/products/shortname/${productSlug}`);
        
        const productData = productRes.data.data;
        console.log('Product found:', productData);
        
        // FILTER REGION: Hanya MY, SG, ID (buang PH dan lainnya)
        if (productData.regions && productData.regions.length > 0) {
          const allowedRegions = ['MY', 'SG', 'ID'];
          productData.regions = productData.regions.filter(r => allowedRegions.includes(r));
          console.log('Filtered regions:', productData.regions);
        }
        
        setProduct(productData);
        
        if (productData.regions && productData.regions.length > 0) {
          setRegion(productData.regions[0]);
          setOrderData(prev => ({ ...prev, region: productData.regions[0] }));
        }
        
        if (productData) {
          await fetchItemsByShortNamePrefix(productData.short_name, productData.regions[0] || 'MY');
        }
        
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(t('checkout.error.productNotFound'));
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndItems();
  }, [productSlug, t]);

  const fetchItemsByShortNamePrefix = async (shortNamePrefix, regionCode) => {
    try {
      console.log(`Fetching items with prefix: ${shortNamePrefix} in region ${regionCode}`);
      
      let itemsData = [];
      
      try {
        console.log('Trying /items/all endpoint...');
        const res = await api.get(`/items/all`, {
          params: { region_code: regionCode }
        });
        itemsData = res.data.data || [];
        console.log(`Fetched ${itemsData.length} total items`);
        
        itemsData = itemsData.filter(item => 
          item.product_short_name?.toLowerCase().startsWith(shortNamePrefix.toLowerCase())
        );
        console.log(`Filtered to ${itemsData.length} items with prefix ${shortNamePrefix}`);
        
      } catch (allErr) {
        console.log('/items/all not available, trying /items/by-shortname...');
        
        const exactRes = await api.get(`/items/by-shortname/${shortNamePrefix}`, {
          params: { region_code: regionCode }
        });
        itemsData = exactRes.data.data || [];
        console.log(`Found ${itemsData.length} items via exact match`);
      }
      
      if (itemsData.length === 0) {
        console.warn(`No items found for prefix: ${shortNamePrefix}`);
        setItems([]);
        setChangingRegion(false);
        return;
      }
      
      const itemsWithPrice = itemsData.map(item => {
        const itemRegion = item.item_regions?.find(
          ir => ir.region_code === regionCode
        );
        
        const originalPrice = itemRegion?.price ? parseFloat(itemRegion.price) : 0;
        const markedUpPrice = originalPrice * 1.10;
        
        return {
          ...item,
          amount: item.amount,
          originalPrice: originalPrice,
          price: markedUpPrice,
          stock: itemRegion?.stock || 0,
          region_data: itemRegion,
          formattedPrice: markedUpPrice > 0 
            ? `RM ${markedUpPrice.toFixed(2)}`
            : t('nominal.price')
        };
      });
      
      const validItems = itemsWithPrice.filter(item => item.price > 0);
      const sortedItems = validItems.sort((a, b) => (a.amount || 0) - (b.amount || 0));
      setItems(sortedItems);
      
      console.log(`Final items count: ${sortedItems.length}`);
      if (sortedItems.length > 0) {
        console.log(`First item: ${sortedItems[0].name} - price: RM ${sortedItems[0].price?.toFixed(2)}`);
      }

      if (sortedItems.length > 0) {
        handleNominalSelect(sortedItems[0]);
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
      console.error('Error fetching items:', err);
      setItems([]);
    } finally {
      setChangingRegion(false);
    }
  };

  const handleRegionChange = async (newRegion) => {
    setChangingRegion(true);
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

  // UPDATE: Function buat ambil amount atau nama item (khusus amount=1)
  const getAmountOrName = () => {
    if (!selectedNominal) return '';
    
    // Kalo amount = 1, return nama itemnya (spasi diganti underscore buat WA format)
    if (selectedNominal.amount === 1) {
      // Bersihin nama: underscore ke spasi dulu, trus spasi balik ke underscore
      // Atau langsung akses name asli dari DB (biasanya udah pake underscore)
      return selectedNominal.name?.replace(/\s+/g, '_') || '';
    }
    
    // Kalo amount > 1, return angkanya
    if (selectedNominal.amount) return selectedNominal.amount;
    
    // Fallback: ambil angka dari nama
    const match = selectedNominal.name?.match(/\d+/);
    return match ? match[0] : '';
  };

  // UPDATE: Function buat ngecek apakah produk MLBB
  const isMLBB = () => {
    const shortName = product?.short_name?.toLowerCase();
    return shortName === 'mlbb' || shortName === 'mobilelegends' || shortName?.includes('mlbb');
  };

  const sendToWhatsApp = () => {
    // Validasi beda berdasarkan game
    if (isMLBB()) {
      if (!orderData.gameId || !orderData.serverId) {
        alert(t('checkout.forms.account.gameId.error'));
        return;
      }
    } else {
      // Untuk game lain, mungkin hanya butuh gameId
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
    const amountOrName = getAmountOrName(); // Pake function baru
    const actualShortName = selectedNominal?.product_short_name || product?.short_name;

    // UPDATE: Format ID & Server (khusus MLBB digabung tanpa spasi)
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
      <div className="checkout-error">
        <h2>{error}</h2>
        <button onClick={() => navigate('/')}>{t('checkout.error.backToHome')}</button>
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
                {reg}
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