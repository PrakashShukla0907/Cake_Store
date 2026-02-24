import api from "./axios";

export const loginUser = (data) => api.post("/auth/login", data);
export const signupUser = (data) => api.post("/auth/signup", data);
export const logoutUser = () => api.post("/auth/logout");
export const getProfile = () => api.get("/auth/me");
