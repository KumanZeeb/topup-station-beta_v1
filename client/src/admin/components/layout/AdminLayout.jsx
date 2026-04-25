import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import '../../styles/admin.css';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="admin-layout">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div
        className={`main-content ${
          sidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'
        }`}
      >
        <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="admin-main">
          <div className="container-fluid">
            <Outlet />
          </div>
        </main>

        <footer className="admin-footer">
          <p>&copy; {new Date().getFullYear()} AmiraStore Admin Panel v1.0.0</p>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
