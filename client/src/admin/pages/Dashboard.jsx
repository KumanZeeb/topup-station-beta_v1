import React, { useState, useEffect } from 'react';
import {
  FaShoppingCart,
  FaCreditCard,
  FaUsers,
  FaChartLine,
} from 'react-icons/fa';
import StatsCard from '../components/Cards/StatsCard';
import SalesChart from '../components/Charts/SalesChart';
import RevenueChart from '../components/Charts/RevenueChart';
import OrderTable from '../components/Tables/OrderTable';
import { adminApi } from '../utils/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    conversionRate: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch stats
      const statsRes = await adminApi.get('/dashboard/stats');
      setStats(statsRes.data);

      // Fetch recent orders
      const ordersRes = await adminApi.get('/orders/recent');
      setRecentOrders(ordersRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: <FaShoppingCart />,
      color: 'primary',
      change: '+12%',
      period: 'from last month',
    },
    {
      title: 'Total Revenue',
      value: `RM ${stats.totalRevenue.toLocaleString()}`,
      icon: <FaCreditCard />,
      color: 'success',
      change: '+18%',
      period: 'from last month',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: <FaUsers />,
      color: 'info',
      change: '+8%',
      period: 'from last month',
    },
    {
      title: 'Conversion Rate',
      value: `${stats.conversionRate}%`,
      icon: <FaChartLine />,
      color: 'warning',
      change: '+2.5%',
      period: 'from last month',
    },
  ];

  return (
    <div className="dashboard">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <div className="page-actions">
          <button className="btn btn-primary">
            <FaChartLine /> Generate Report
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={fetchDashboardData}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        {statsCards.map((card, index) => (
          <div key={index} className="col-md-3 col-sm-6 mb-3">
            <StatsCard {...card} />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="row mb-4">
        <div className="col-lg-8 mb-3">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Sales Overview</h5>
              <div className="card-actions">
                <select className="form-select form-select-sm">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                </select>
              </div>
            </div>
            <div className="card-body">
              <SalesChart />
            </div>
          </div>
        </div>

        <div className="col-lg-4 mb-3">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Revenue by Product</h5>
            </div>
            <div className="card-body">
              <RevenueChart />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">Recent Orders</h5>
          <div className="card-actions">
            <button className="btn btn-sm btn-outline-primary">View All</button>
          </div>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <OrderTable orders={recentOrders} />
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 text-muted">
                Pending Payments
              </h6>
              <h3 className="card-title">5</h3>
              <p className="card-text">
                <span className="text-danger">2 awaiting verification</span>
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 text-muted">
                Active Support Tickets
              </h6>
              <h3 className="card-title">3</h3>
              <p className="card-text">
                <span className="text-warning">1 high priority</span>
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 text-muted">
                Low Stock Products
              </h6>
              <h3 className="card-title">2</h3>
              <p className="card-text">
                <span className="text-danger">Needs restocking</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
