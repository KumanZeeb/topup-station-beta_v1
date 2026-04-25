// client/src/utils/imageUtils.js - NEW FILE
/**
 * Helper function untuk mendapatkan URL gambar dari Supabase Storage
 */

export const getSupabaseImageUrl = (filename, bucket = 'product-icons') => {
  if (!filename) return null;
  
  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
  
  // Debug logging (hapus di production)
  if (process.env.NODE_ENV === 'development') {
    console.log('Image Utils - Input:', { filename, bucket });
  }
  
  // Jika sudah full URL, return as is (backward compatibility)
  if (filename.startsWith('http')) {
    return filename;
  }
  
  // Jika path sudah include bucket name
  if (filename.startsWith(`${bucket}/`)) {
    return `${supabaseUrl}/storage/v1/object/public/${filename}`;
  }
  
  // Jika hanya filename, tambahkan bucket
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${filename}`;
};

/**
 * Fallback untuk gambar error
 */
export const getFallbackAvatar = (name, size = 128) => {
  const initials = name 
    ? name.substring(0, 2).toUpperCase() 
    : 'PD';
  
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=667eea&color=fff&bold=true&size=${size}`;
};

/**
 * Validasi apakah URL gambar valid
 */
export const isValidImageUrl = async (url) => {
  if (!url) return false;
  
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok && response.headers.get('content-type')?.startsWith('image/');
  } catch {
    return false;
  }
};