const express = require('express');
const router = express.Router();
const { supabase } = require('../supabase');

// ============================================
// EXISTING ENDPOINTS (PRODUCTS)
// ============================================

// GET /api/products
router.get('/', async (req, res) => {
  console.log('🔍 ===== GET /api/products =====');

  try {
    // TEST 1: ambil semua products
    const { data: allProducts, error: allError } = await supabase
      .from('products')
      .select('*');

    console.log('🧪 ALL PRODUCTS:', {
      error: allError?.message,
      count: allProducts?.length
    });

    // TEST 2: hanya yang aktif
    const { data: activeProducts, error: activeError } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    console.log('🧪 ACTIVE PRODUCTS:', {
      error: activeError?.message,
      count: activeProducts?.length
    });

    if (activeError) throw activeError;

    // FINAL RESPONSE FORMAT
    const response = (activeProducts || []).map(p => ({
      id: p.id,
      name: p.name,
      short_name: p.short_name,
      product_code: p.product_code,
      description: p.description,
      developer: p.developer,
      category: p.category,
      icon_url: p.icon_url || null,
      banner_url: p.banner_url || null,
      color_code: p.color_code || '#000000',
      currency: p.currency,
      regions: p.regions,
      meta_data: p.meta_data,
      is_active: p.is_active,
      is_featured: p.is_featured,
      sort_order: p.sort_order,
      created_at: p.created_at,
      updated_at: p.updated_at
    }));

    console.log('✅ SEND PRODUCTS:', response.length);
    console.log('🔍 ===== END =====\n');

    res.json({
      success: true,
      count: response.length,
      data: response
    });

  } catch (error) {
    console.error('❌ ERROR /api/products:', error.message);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/products/shortname/:shortName
router.get('/shortname/:shortName', async (req, res) => {
  console.log(`🔍 ===== GET /api/products/shortname/${req.params.shortName} =====`);
  
  try {
    const { shortName } = req.params;
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('short_name', shortName)
      .eq('is_active', true)
      .single();
    
    if (error) {
      console.error('❌ Supabase error:', error);
      
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      
      throw error;
    }
    
    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Format response biar konsisten
    const formattedData = {
      id: data.id,
      name: data.name,
      short_name: data.short_name,
      product_code: data.product_code,
      description: data.description,
      developer: data.developer,
      category: data.category,
      icon_url: data.icon_url || null,
      banner_url: data.banner_url || null,
      color_code: data.color_code || '#000000',
      currency: data.currency,
      min_price: data.min_price,
      max_price: data.max_price,
      regions: data.regions || [],
      meta_data: data.meta_data,
      is_active: data.is_active,
      is_featured: data.is_featured,
      sort_order: data.sort_order,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
    
    console.log('✅ Product found:', formattedData.name);
    console.log('🔍 ===== END =====\n');
    
    res.json({
      success: true,
      data: formattedData
    });
    
  } catch (error) {
    console.error('❌ ERROR /api/products/shortname:', error.message);
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/products/code/:code (pake product_code)
router.get('/code/:code', async (req, res) => {
  console.log(`🔍 ===== GET /api/products/code/${req.params.code} =====`);
  
  try {
    const { code } = req.params;
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('product_code', code)
      .eq('is_active', true)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      throw error;
    }
    
    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    const formattedData = {
      id: data.id,
      name: data.name,
      short_name: data.short_name,
      product_code: data.product_code,
      description: data.description,
      developer: data.developer,
      category: data.category,
      icon_url: data.icon_url || null,
      banner_url: data.banner_url || null,
      color_code: data.color_code || '#000000',
      currency: data.currency,
      min_price: data.min_price,
      max_price: data.max_price,
      regions: data.regions || [],
      meta_data: data.meta_data,
      is_active: data.is_active,
      is_featured: data.is_featured,
      sort_order: data.sort_order,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
    
    res.json({
      success: true,
      data: formattedData
    });
    
  } catch (error) {
    console.error('❌ ERROR /api/products/code:', error.message);
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/products/:id (by ID)
router.get('/:id', async (req, res) => {
  console.log(`🔍 ===== GET /api/products/${req.params.id} =====`);
  
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      throw error;
    }
    
    res.json({
      success: true,
      data
    });
    
  } catch (error) {
    console.error('❌ ERROR /api/products/:id:', error.message);
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// ✅ NEW ENDPOINTS FOR ITEMS
// ============================================

// GET /api/items/by-shortname-prefix/:prefix
// Ambil semua items yang product_short_name nya DIMULAI DENGAN prefix
// Contoh: /api/items/by-shortname-prefix/mlbb?region_code=MY
// Bakal ambil: mlbb, mlbb_special, mlbb_promo_manual, dll
router.get('/items/by-shortname-prefix/:prefix', async (req, res) => {
  console.log(`🔍 ===== GET /api/items/by-shortname-prefix/${req.params.prefix} =====`);
  
  try {
    const { prefix } = req.params;
    const { region_code } = req.query;
    
    console.log(`📦 Prefix: ${prefix}, Region: ${region_code}`);
    
    // Query dengan ILIKE untuk ambil semua short_name yang dimulai dengan prefix
    let query = supabase
      .from('items')
      .select(`
        *,
        item_regions!inner(*)
      `)
      .ilike('product_short_name', `${prefix}%`)
      .eq('is_active', true)
      .order('amount', { ascending: true });
    
    // Filter by region kalo ada
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
    
    // Log semua short_name yang ditemukan untuk debugging
    if (itemsData && itemsData.length > 0) {
      const uniqueShortNames = [...new Set(itemsData.map(item => item.product_short_name))];
      console.log(`📦 Short names found: ${uniqueShortNames.join(', ')}`);
    }
    
    // Format response
    const formattedItems = (itemsData || []).map(item => {
      const itemRegions = item.item_regions || [];
      
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
        item_regions: itemRegions.map(ir => ({
          id: ir.id,
          region_code: ir.region_code,
          price: ir.price,
          stock: ir.stock,
          is_active: ir.is_active
        }))
      };
    });
    
    console.log(`✅ Sending ${formattedItems.length} items`);
    console.log('🔍 ===== END =====\n');
    
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
// Ambil items dengan exact match short_name
router.get('/items/by-shortname/:shortName', async (req, res) => {
  console.log(`🔍 ===== GET /api/items/by-shortname/${req.params.shortName} =====`);
  
  try {
    const { shortName } = req.params;
    const { region_code } = req.query;
    
    console.log(`📦 ShortName: ${shortName}, Region: ${region_code}`);
    
    // Query exact match
    let query = supabase
      .from('items')
      .select(`
        *,
        item_regions!inner(*)
      `)
      .eq('product_short_name', shortName)
      .eq('is_active', true)
      .order('amount', { ascending: true });
    
    // Filter by region kalo ada
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
    
    // Format response
    const formattedItems = (itemsData || []).map(item => {
      const itemRegions = item.item_regions || [];
      
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
        item_regions: itemRegions.map(ir => ({
          id: ir.id,
          region_code: ir.region_code,
          price: ir.price,
          stock: ir.stock,
          is_active: ir.is_active
        }))
      };
    });
    
    console.log(`✅ Sending ${formattedItems.length} items`);
    console.log('🔍 ===== END =====\n');
    
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

// GET /api/items/all (semua items)
// Ambil semua items (bisa difilter by region)
router.get('/items/all', async (req, res) => {
  console.log(`🔍 ===== GET /api/items/all =====`);
  
  try {
    const { region_code } = req.query;
    
    console.log(`📦 Region: ${region_code}`);
    
    let query = supabase
      .from('items')
      .select(`
        *,
        item_regions!inner(*)
      `)
      .eq('is_active', true)
      .order('amount', { ascending: true });
    
    // Filter by region kalo ada
    if (region_code) {
      query = query.eq('item_regions.region_code', region_code)
                   .eq('item_regions.is_active', true);
    }
    
    const { data: itemsData, error } = await query;
    
    if (error) {
      console.error('❌ Supabase error:', error);
      throw error;
    }
    
    console.log(`✅ Found ${itemsData?.length || 0} total items`);
    
    // Format response
    const formattedItems = (itemsData || []).map(item => {
      const itemRegions = item.item_regions || [];
      
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
        item_regions: itemRegions.map(ir => ({
          id: ir.id,
          region_code: ir.region_code,
          price: ir.price,
          stock: ir.stock,
          is_active: ir.is_active
        }))
      };
    });
    
    console.log(`✅ Sending ${formattedItems.length} items`);
    console.log('🔍 ===== END =====\n');
    
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

module.exports = router;