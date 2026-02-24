import api from "./axios";

export const getProducts = (params) => api.get("/products", { params });
export const getProductById = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post("/admin/products", data);
export const updateProduct = (id, data) =>
  api.put(`/admin/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/admin/products/${id}`);
export const addToCart = (data) => api.post("/users/cart", data);
