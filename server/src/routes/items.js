const express = require('express');
const router = express.Router();
const { supabase } = require('../supabase');

// GET /api/items/by-shortname/:shortName
router.get('/by-shortname/:shortName', async (req, res) => {
  console.log(`🔍 GET /api/items/by-shortname/${req.params.shortName}`);
  
  try {
    const { shortName } = req.params;
    const { region_code } = req.query;
    
    console.log('📦 Params:', { shortName, region_code });
    
    let query = supabase
      .from('items')
      .select(`
        *,
        item_regions!left(
          id,
          region_code,
          price,
          stock,
          is_active
        )
      `)
      .eq('product_short_name', shortName)
      .eq('is_active', true);
    
    if (region_code) {
      query = query.eq('item_regions.region_code', region_code);
    }
    
    const { data, error } = await query.order('sort_order', { ascending: true });
    
    if (error) {
      console.error('❌ Supabase error:', error);
      throw error;
    }
    
    console.log(`✅ Found ${data?.length || 0} items for ${shortName}`);
    
    // Filter item_regions yang null/empty
    const formattedData = data?.map(item => ({
      ...item,
      item_regions: item.item_regions?.filter(ir => ir !== null) || []
    })) || [];
    
    res.json({
      success: true,
      data: formattedData
    });
    
  } catch (error) {
    console.error('❌ Error in /by-shortname:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET /api/items/:itemId/regions
router.get('/:itemId/regions', async (req, res) => {
  try {
    const { itemId } = req.params;
    
    const { data, error } = await supabase
      .from('item_regions')
      .select('*')
      .eq('item_id', itemId)
      .eq('is_active', true);
    
    if (error) throw error;
    
    res.json({
      success: true,
      data: data || []
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;