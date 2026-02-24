import api from "./axios";

export const getCart = () => api.get("/users/cart");
export const updateCart = (data) => api.put("/users/cart", data);
export const removeFromCart = (id) => api.delete(`/users/cart/${id}`);
