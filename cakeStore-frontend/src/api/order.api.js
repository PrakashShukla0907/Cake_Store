import api from "./axios";

export const placeOrder = (data) => api.post("/user/orders", data);
export const getMyOrders = () => api.get("/user/orders/my-orders");
export const getAllOrders = () => api.get("/admin/orders");
export const updateOrderStatus = (id, status) =>
  api.put(`/admin/orders/${id}`, { status });
