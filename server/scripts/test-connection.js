// server/scripts/test-connection.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

console.log('🔗 Testing Supabase Connection...\n');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Environment Variables:');
console.log('- SUPABASE_URL:', supabaseUrl ? '✅ Loaded' : '❌ MISSING');
console.log('- SUPABASE_KEY:', supabaseKey ? '✅ Loaded (' + supabaseKey.substring(0, 20) + '...)' : '❌ MISSING');

if (!supabaseUrl || !supabaseKey) {
  console.error('\n❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('\n🧪 Test 1: Basic connection test...');
    
    // Test 1: List tables
    const { data: tables, error: tablesError } = await supabase
      .from('products')
      .select('count')
      .limit(1);
    
    if (tablesError) {
      console.log('❌ Error accessing products table:', tablesError.message);
      
      // Coba list semua tables
      console.log('\n🧪 Trying to list all tables...');
      const { data: allTables, error } = await supabase
        .from('_tables') // Ini cara cek tables di Supabase
        .select('*')
        .limit(5);
      
      if (error) {
        console.log('❌ Cannot list tables:', error.message);
      } else {
        console.log('📋 Available tables:', allTables);
      }
    } else {
      console.log('✅ Successfully connected to products table');
    }

    // Test 2: Try raw query
    console.log('\n🧪 Test 2: Raw SQL query...');
    const { data: rawData, error: rawError } = await supabase
      .from('products')
      .select('*')
      .limit(2);
    
    if (rawError) {
      console.log('❌ Raw query error:', rawError.message);
    } else {
      console.log(`✅ Raw query successful, found ${rawData?.length || 0} products`);
      if (rawData && rawData.length > 0) {
        console.log('Sample product:', {
          id: rawData[0].id,
          name: rawData[0].name,
          product_code: rawData[0].product_code
        });
      }
    }

    // Test 3: Check project info
    console.log('\n🧪 Test 3: Checking project info...');
    console.log('Connected to:', supabaseUrl);
    console.log('Supabase URL structure:');
    console.log('- Project ID:', supabaseUrl.split('//')[1]?.split('.')[0] || 'Unknown');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
  }
}

testConnection();