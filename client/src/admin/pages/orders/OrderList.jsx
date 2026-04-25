import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaSearch,
  FaFilter,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaExclamationCircle,
  FaWhatsapp,
  FaFileExport,
} from 'react-icons/fa';
import DataTable from '../../components/Tables/DataTable';
import { adminApi } from '../../utils/api';
import {
  formatCurrency,
  formatDate,
  getStatusColor,
} from '../../utils/formatters';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    date_from: '',
    date_to: '',
  });

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    cancelled: 0,
  });

  useEffect(() => {
    fetchOrders();
    fetchOrderStats();
  }, [filters]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await adminApi.get('/orders', { params: filters });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderStats = async () => {
    try {
      const response = await adminApi.get('/orders/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching order stats:', error);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await adminApi.put(`/orders/${orderId}/status`, { status });
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FaCheckCircle className="text-success" />;
      case 'processing':
        return <FaClock className="text-warning" />;
      case 'pending':
        return <FaExclamationCircle className="text-info" />;
      case 'cancelled':
        return <FaTimesCircle className="text-danger" />;
      default:
        return <FaClock className="text-secondary" />;
    }
  };

  const columns = [
    {
      key: 'order_number',
      header: 'Order ID',
      render: (order) => (
        <div>
          <strong>{order.order_number}</strong>
          <div className="text-muted small">{formatDate(order.created_at)}</div>
        </div>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
      render: (order) => (
        <div>
          <div className="customer-info">
            <strong>{order.player_name || 'No Name'}</strong>
          </div>
          <div className="customer-contact">
            <span className="badge bg-info">
              <FaWhatsapp /> {order.whatsapp}
            </span>
          </div>
          <div className="small text-muted">
            Game ID: {order.game_id}
            {order.server_id && ` | Server: ${order.server_id}`}
          </div>
        </div>
      ),
    },
    {
      key: 'product',
      header: 'Product',
      render: (order) => (
        <div>
          <div className="product-name">{order.product?.name}</div>
          <div className="product-variant">
            <span className="badge bg-secondary">
              {order.variant?.display_name}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (order) => (
        <div>
          <div className="fw-bold">{formatCurrency(order.total_amount)}</div>
          <div className="text-muted small">Qty: {order.quantity}</div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (order) => (
        <div className="d-flex align-items-center gap-2">
          {getStatusIcon(order.order_status)}
          <select
            className="form-select form-select-sm status-select"
            value={order.order_status}
            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
            style={{
              borderColor: getStatusColor(order.order_status),
              color: getStatusColor(order.order_status),
            }}
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      ),
    },
    {
      key: 'payment',
      header: 'Payment',
      render: (order) => (
        <div>
          <div className={`payment-status ${order.payment_status}`}>
            {order.payment_status}
          </div>
          <div className="text-muted small">
            {order.payment_method || 'Not set'}
          </div>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (order) => (
        <div className="action-buttons">
          <Link
            to={`/admin/orders/${order.id}`}
            className="btn btn-sm btn-outline-primary"
            title="View Details"
          >
            <FaEye />
          </Link>
          <a
            href={`https://wa.me/${order.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-outline-success"
            title="Contact via WhatsApp"
          >
            <FaWhatsapp />
          </a>
        </div>
      ),
    },
  ];

  return (
    <div className="order-list">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Orders</h1>
        <div className="page-actions">
          <button className="btn btn-outline-primary">
            <FaFileExport /> Export Orders
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-2 col-6 mb-3">
          <div className="stats-card total">
            <h3>{stats.total}</h3>
            <p>Total Orders</p>
          </div>
        </div>
        <div className="col-md-2 col-6 mb-3">
          <div className="stats-card pending">
            <h3>{stats.pending}</h3>
            <p>Pending</p>
          </div>
        </div>
        <div className="col-md-2 col-6 mb-3">
          <div className="stats-card processing">
            <h3>{stats.processing}</h3>
            <p>Processing</p>
          </div>
        </div>
        <div className="col-md-2 col-6 mb-3">
          <div className="stats-card completed">
            <h3>{stats.completed}</h3>
            <p>Completed</p>
          </div>
        </div>
        <div className="col-md-2 col-6 mb-3">
          <div className="stats-card cancelled">
            <h3>{stats.cancelled}</h3>
            <p>Cancelled</p>
          </div>
        </div>
        <div className="col-md-2 col-6 mb-3">
          <div className="stats-card revenue">
            <h3>RM {stats.revenue?.toLocaleString() || '0'}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <div className="input-group">
                <span className="input-group-text">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search order ID, customer..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="col-md-2">
              <select
                className="form-select"
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="col-md-2">
              <input
                type="date"
                className="form-control"
                placeholder="From Date"
                value={filters.date_from}
                onChange={(e) =>
                  setFilters({ ...filters, date_from: e.target.value })
                }
              />
            </div>

            <div className="col-md-2">
              <input
                type="date"
                className="form-control"
                placeholder="To Date"
                value={filters.date_to}
                onChange={(e) =>
                  setFilters({ ...filters, date_to: e.target.value })
                }
              />
            </div>

            <div className="col-md-3">
              <div className="d-flex gap-2">
                <button className="btn btn-primary" onClick={fetchOrders}>
                  <FaFilter /> Apply Filters
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() =>
                    setFilters({
                      search: '',
                      status: '',
                      date_from: '',
                      date_to: '',
                    })
                  }
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card">
        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-5">
              <h5>No orders found</h5>
              <p className="text-muted">Try adjusting your filters</p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={orders}
              keyExtractor={(item) => item.id}
              pagination
              pageSize={15}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderList;
