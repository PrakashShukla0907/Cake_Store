import api from "./axios";

export const getBanners = async () => {
  return await api.get("/banners");
};

export const addBanner = async (formData) => {
  return await api.post("/banners", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const removeBanner = async (id) => {
  return await api.delete(`/banners/${id}`);
};
