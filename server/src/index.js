const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3001;

/* =========================
   CORS CONFIG - SUPPORT NGROK
========================= */
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3001',
  /\.ngrok\.io$/,
  /\.ngrok\.free\.app$/,
  /^https?:\/\/[a-zA-Z0-9-]+\.ngrok\.io$/,
  /^https?:\/\/[a-zA-Z0-9-]+\.ngrok-free\.app$/
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    const isAllowed = allowedOrigins.some(pattern => {
      if (pattern instanceof RegExp) {
        return pattern.test(origin);
      }
      return false;
    });

    if (isAllowed) {
      console.log('✅ Ngrok origin allowed:', origin);
      return callback(null, true);
    }

    console.log('❌ CORS blocked origin:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.options('*', cors());

/* =========================
   MIDDLEWARE
========================= */
app.use(express.json());

app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.url} - Origin: ${req.headers.origin || 'no-origin'}`);
  next();
});

/* =========================
   ROUTES
========================= */
const productsRoutes = require('./routes/products');
const itemsRoutes = require('./routes/items');

app.use('/api/products', productsRoutes);
app.use('/api/items', itemsRoutes);

// ============================================
// ✅ TAMBAHIN DIRECT ITEMS ROUTES DISINI
// ============================================

// GET /api/items/all
app.get('/api/items/all', async (req, res) => {
  console.log('🔍 ===== GET /api/items/all =====');
  
  try {
    const { supabase } = require('./supabase');
    const { region_code } = req.query;
    
    console.log(`📦 Region: ${region_code}`);
    
    let query = supabase
      .from('items')
      .select(`
        *,
        item_regions (*)
      `)
      .eq('is_active', true);
    
    if (region_code) {
      query = query.eq('item_regions.region_code', region_code)
                   .eq('item_regions.is_active', true);
    }
    
    const { data: itemsData, error } = await query;
    
    if (error) {
      console.error('❌ Supabase error:', error);
      throw error;
    }
    
    console.log(`✅ Found ${itemsData?.length || 0} items`);
    
    const formattedItems = (itemsData || []).map(item => {
      const itemRegions = item.item_regions || [];
      const regionData = itemRegions.find(ir => ir.region_code === region_code) || itemRegions[0] || {};
      
      return {
        id: item.id,
        product_short_name: item.product_short_name,
        name: item.name,
        amount: item.amount,
        currency: item.currency,
        base_price: item.base_price,
        is_active: item.is_active,
        sort_order: item.sort_order,
        created_at: item.created_at,
        price: regionData.price || 0,
        stock: regionData.stock || -1,
        item_regions: itemRegions
      };
    });
    
    res.json({
      success: true,
      count: formattedItems.length,
      data: formattedItems
    });
    
  } catch (error) {
    console.error('❌ ERROR /api/items/all:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/items/by-shortname-prefix/:prefix
app.get('/api/items/by-shortname-prefix/:prefix', async (req, res) => {
  console.log(`🔍 ===== GET /api/items/by-shortname-prefix/${req.params.prefix} =====`);
  
  try {
    const { supabase } = require('./supabase');
    const { prefix } = req.params;
    const { region_code } = req.query;
    
    console.log(`📦 Prefix: ${prefix}, Region: ${region_code}`);
    
    let query = supabase
      .from('items')
      .select(`
        *,
        item_regions (*)
      `)
      .ilike('product_short_name', `${prefix}%`)
      .eq('is_active', true);
    
    if (region_code) {
      query = query.eq('item_regions.region_code', region_code)
                   .eq('item_regions.is_active', true);
    }
    
    const { data: itemsData, error } = await query;
    
    if (error) {
      console.error('❌ Supabase error:', error);
      throw error;
    }
    
    console.log(`✅ Found ${itemsData?.length || 0} items with prefix '${prefix}'`);
    
    if (itemsData && itemsData.length > 0) {
      const uniqueShortNames = [...new Set(itemsData.map(item => item.product_short_name))];
      console.log(`📦 Short names found: ${uniqueShortNames.join(', ')}`);
    }
    
    const formattedItems = (itemsData || []).map(item => {
      const itemRegions = item.item_regions || [];
      const regionData = itemRegions.find(ir => ir.region_code === region_code) || itemRegions[0] || {};
      
      return {
        id: item.id,
        product_short_name: item.product_short_name,
        name: item.name,
        amount: item.amount,
        currency: item.currency,
        base_price: item.base_price,
        is_active: item.is_active,
        sort_order: item.sort_order,
        created_at: item.created_at,
        price: regionData.price || 0,
        stock: regionData.stock || -1,
        item_regions: itemRegions
      };
    });
    
    res.json({
      success: true,
      count: formattedItems.length,
      data: formattedItems
    });
    
  } catch (error) {
    console.error('❌ ERROR /api/items/by-shortname-prefix:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/items/by-shortname/:shortName (exact match)
app.get('/api/items/by-shortname/:shortName', async (req, res) => {
  console.log(`🔍 ===== GET /api/items/by-shortname/${req.params.shortName} =====`);
  
  try {
    const { supabase } = require('./supabase');
    const { shortName } = req.params;
    const { region_code } = req.query;
    
    console.log(`📦 ShortName: ${shortName}, Region: ${region_code}`);
    
    let query = supabase
      .from('items')
      .select(`
        *,
        item_regions (*)
      `)
      .eq('product_short_name', shortName)
      .eq('is_active', true);
    
    if (region_code) {
      query = query.eq('item_regions.region_code', region_code)
                   .eq('item_regions.is_active', true);
    }
    
    const { data: itemsData, error } = await query;
    
    if (error) {
      console.error('❌ Supabase error:', error);
      throw error;
    }
    
    console.log(`✅ Found ${itemsData?.length || 0} items with exact shortName '${shortName}'`);
    
    const formattedItems = (itemsData || []).map(item => {
      const itemRegions = item.item_regions || [];
      const regionData = itemRegions.find(ir => ir.region_code === region_code) || itemRegions[0] || {};
      
      return {
        id: item.id,
        product_short_name: item.product_short_name,
        name: item.name,
        amount: item.amount,
        currency: item.currency,
        base_price: item.base_price,
        is_active: item.is_active,
        sort_order: item.sort_order,
        created_at: item.created_at,
        price: regionData.price || 0,
        stock: regionData.stock || -1,
        item_regions: itemRegions
      };
    });
    
    res.json({
      success: true,
      count: formattedItems.length,
      data: formattedItems
    });
    
  } catch (error) {
    console.error('❌ ERROR /api/items/by-shortname:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/* =========================
   API HEALTH CHECK
========================= */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    database: 'Connected',
    timestamp: new Date().toISOString()
  });
});

/* =========================
   SERVE STATIC FILES - FRONTEND
========================= */

const clientBuildPath = path.resolve(__dirname, '../../client/build');
app.use(express.static(clientBuildPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

/* =========================
   404 HANDLER (untuk API routes aja)
========================= */
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `API Route ${req.originalUrl} not found`
  });
});

/* =========================
   ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err.message);
  console.error('Stack:', err.stack);
  
  if (err.message.includes('Not allowed by CORS')) {
    return res.status(403).json({
      success: false,
      error: 'CORS error: Origin not allowed',
      origin: req.headers.origin
    });
  }
  
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
  console.log('==============================');
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 API Base URL: http://localhost:${PORT}`);
  console.log(`📦 Products: http://localhost:${PORT}/api/products`);
  console.log(`🔍 Products by Shortname: http://localhost:${PORT}/api/products/shortname/MLBB`);
  console.log(`💰 Items by Shortname: http://localhost:${PORT}/api/items/by-shortname/MLBB?region_code=MY`);
  console.log(`🔍 Items by Prefix: http://localhost:${PORT}/api/items/by-shortname-prefix/mlbb?region_code=MY`);
  console.log(`📋 All Items: http://localhost:${PORT}/api/items/all?region_code=MY`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
  console.log('==============================');
  console.log('🚀 CORS configured for:');
  console.log('   - Localhost origins');
  console.log('   - Ngrok domains (*.ngrok.io, *.ngrok-free.app)');
  console.log('==============================');
  console.log('📱 Frontend:');
  console.log(`   - Development: http://localhost:5173 (jalankan "cd client && npm start")`);
  console.log(`   - Production: http://localhost:${PORT} (setelah build)`);
  console.log('==============================');
});