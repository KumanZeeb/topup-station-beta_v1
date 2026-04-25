import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const adminApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Auth functions
export const loginAdmin = async (email, password) => {
  try {
    const response = await adminApi.post('/admin/login', { email, password });

    if (response.data.token) {
      localStorage.setItem('admin_token', response.data.token);
      localStorage.setItem('admin_user', JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const logoutAdmin = () => {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
};

export const getCurrentAdmin = () => {
  const user = localStorage.getItem('admin_user');
  return user ? JSON.parse(user) : null;
};

export default adminApi;
