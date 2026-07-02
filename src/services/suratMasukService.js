import api from "./api";

export const getAllSuratMasuk = async () => {
  const response = await api.get("/surat-masuk");
  return response.data;
};

export const getSuratMasukById = async (id) => {
  const response = await api.get(`/surat-masuk/${id}`);
  return response.data;
};

export const createSuratMasuk = async (data) => {
  const response = await api.post("/surat-masuk", data);
  return response.data;
};

export const updateSuratMasuk = async (id, data) => {
  const response = await api.put(`/surat-masuk/${id}`, data);
  return response.data;
};

export const deleteSuratMasuk = async (id) => {
  const response = await api.delete(`/surat-masuk/${id}`);
  return response.data;
};