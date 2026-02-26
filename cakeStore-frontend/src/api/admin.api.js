import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1/admin',
  withCredentials: true,
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// --- DASHBOARD STATS ---
export const getAdminStats = async () => {
  const response = await api.get('/stats');
  return response.data;
};

// --- PRODUCTS ---
export const getAdminProducts = async (page = 1, search = '') => {
  // Pass query params as needed, e.g., ?page=1&search=cake
  const response = await api.get(`/products?page=${page}&keyword=${search}`);
  return response.data;
};

export const createAdminProduct = async (productData) => {
  const response = await api.post('/products', productData);
  return response.data;
};

export const updateAdminProduct = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};

export const deleteAdminProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

// --- ORDERS ---
export const getAdminOrders = async () => {
  const response = await api.get('/orders');
  return response.data;
};

export const updateAdminOrderStatus = async (id, status) => {
  // Expected to receive { status: "Delivered" } etc.
  const response = await api.patch(`/orders/${id}/status`, { status });
  return response.data;
};

// --- USERS ---
export const getAdminUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};
