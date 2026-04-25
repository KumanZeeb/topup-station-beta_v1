import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from './../UI/ProductCard';

const ProductGrid = ({ products = [], isLoading = false }) => {
  const navigate = useNavigate();
  const productList = Array.isArray(products)
    ? products
    : Array.isArray(products?.data)
      ? products.data
      : [];

  /**
   * Handler klik product
   * Sekarang langsung pakai short_name (slug)
   */
  const handleProductClick = (slug) => {
    if (!slug) {
      console.error('❌ short_name kosong saat klik product');
      return;
    }

    navigate(`/${slug}`);
  };

  /**
   * Skeleton Loading
   */
  if (isLoading) {
    return (
      <div className="product-grid">
        {[...Array(6)].map((_, i) => (
          <ProductCard key={i} isLoading />
        ))}
      </div>
    );
  }

  /**
   * Empty State
   */
  if (!productList.length) {
    console.warn('⚠️ ProductGrid: product list kosong');
    return <div className="product-grid-empty">No products available</div>;
  }

  /**
   * Render Products
   */
  return (
    <div className="product-grid">
      {productList.map((p) => (
        <ProductCard
          key={p.id}
          product_id={p.id}
          short_name={p.short_name}
          name={p.name}
          developer={p.developer}
          icon_url={p.icon_url}
          category={p.category}
          is_featured={p.is_featured}
          is_flash_sale={p.is_flash_sale}
          onProductClick={handleProductClick}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
