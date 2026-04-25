import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaFilter,
  FaDownload,
  FaGamepad,
  FaTag,
  FaMobileAlt,
} from 'react-icons/fa';
import DataTable from '../../components/Tables/DataTable';
import { adminApi } from '../../utils/api';
import { formatCurrency } from '../../utils/formatters';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: '',
  });

  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await adminApi.get('/products', { params: filters });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await adminApi.delete(`/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;

    if (
      window.confirm(`Delete ${selectedProducts.length} selected products?`)
    ) {
      try {
        await adminApi.post('/products/bulk-delete', { ids: selectedProducts });
        setSelectedProducts([]);
        fetchProducts();
      } catch (error) {
        console.error('Error bulk deleting:', error);
      }
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await adminApi.patch(`/products/${id}/status`, { status });
      fetchProducts();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const columns = [
    {
      key: 'select',
      header: (
        <input
          type="checkbox"
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedProducts(products.map((p) => p.id));
            } else {
              setSelectedProducts([]);
            }
          }}
          checked={
            selectedProducts.length === products.length && products.length > 0
          }
        />
      ),
      render: (product) => (
        <input
          type="checkbox"
          checked={selectedProducts.includes(product.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedProducts([...selectedProducts, product.id]);
            } else {
              setSelectedProducts(
                selectedProducts.filter((id) => id !== product.id)
              );
            }
          }}
        />
      ),
      width: '50px',
    },
    {
      key: 'product',
      header: 'Product',
      render: (product) => (
        <div className="product-cell">
          <div className="product-image">
            {product.icon_url ? (
              <img src={product.icon_url} alt={product.name} />
            ) : (
              <div className="product-icon">
                <FaGamepad />
              </div>
            )}
          </div>
          <div className="product-info">
            <h6 className="product-name">{product.name}</h6>
            <p className="product-code">{product.product_code}</p>
            <div className="product-categories">
              <span className="badge bg-primary">{product.category}</span>
              {product.is_featured && (
                <span className="badge bg-warning">Featured</span>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'price',
      header: 'Price Range',
      render: (product) => (
        <div>
          <div className="price-range">
            {formatCurrency(product.min_price)} -{' '}
            {formatCurrency(product.max_price)}
          </div>
          <small className="text-muted">{product.currency}</small>
        </div>
      ),
    },
    {
      key: 'variants',
      header: 'Variants',
      render: (product) => (
        <span className="badge bg-info">
          {product.variants_count || 0} variants
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (product) => (
        <div className="status-cell">
          <span
            className={`status-badge ${
              product.is_active ? 'active' : 'inactive'
            }`}
          >
            {product.is_active ? 'Active' : 'Inactive'}
          </span>
          <select
            className="form-select form-select-sm status-select"
            value={product.is_active ? 'active' : 'inactive'}
            onChange={(e) =>
              handleStatusChange(product.id, e.target.value === 'active')
            }
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      ),
    },
    {
      key: 'sales',
      header: 'Sales',
      render: (product) => (
        <div>
          <div className="sales-count">{product.total_sales || 0}</div>
          <div className="sales-revenue">
            {formatCurrency(product.total_revenue || 0)}
          </div>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (product) => (
        <div className="action-buttons">
          <Link
            to={`/admin/products/${product.id}`}
            className="btn btn-sm btn-outline-primary"
            title="View"
          >
            <FaEye />
          </Link>
          <Link
            to={`/admin/products/edit/${product.id}`}
            className="btn btn-sm btn-outline-success"
            title="Edit"
          >
            <FaEdit />
          </Link>
          <button
            className="btn btn-sm btn-outline-danger"
            title="Delete"
            onClick={() => handleDelete(product.id)}
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="product-list">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Products</h1>
        <div className="page-actions">
          <Link to="/admin/products/new" className="btn btn-primary">
            <FaPlus /> Add New Product
          </Link>
          <button className="btn btn-outline-secondary">
            <FaDownload /> Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="col-md-3">
              <select
                className="form-select"
                value={filters.category}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }
              >
                <option value="">All Categories</option>
                <option value="games">Games</option>
                <option value="voucher">Vouchers</option>
                <option value="pulsa">Pulsa</option>
                <option value="ewallet">E-Wallet</option>
              </select>
            </div>

            <div className="col-md-3">
              <select
                className="form-select"
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="col-md-2">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() =>
                  setFilters({ search: '', category: '', status: '' })
                }
              >
                <FaFilter /> Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="bulk-actions-bar mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <span className="selected-count">
                {selectedProducts.length} product(s) selected
              </span>
            </div>
            <div className="bulk-buttons">
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={handleBulkDelete}
              >
                <FaTrash /> Delete Selected
              </button>
              <button className="btn btn-sm btn-outline-secondary">
                <FaTag /> Add Tags
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="card">
        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-5">
              <h5>No products found</h5>
              <p className="text-muted">
                Try adjusting your filters or add a new product
              </p>
              <Link to="/admin/products/new" className="btn btn-primary">
                <FaPlus /> Add First Product
              </Link>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={products}
              keyExtractor={(item) => item.id}
              pagination
              pageSize={10}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
