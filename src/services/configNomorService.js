import api from "./api";

export const getAllConfigNomor = async () => {
  const response = await api.get("/config-nomor");
  return response.data;
};

export const getConfigNomorById = async (id) => {
  const response = await api.get(`/config-nomor/${id}`);
  return response.data;
};

export const createConfigNomor = async (data) => {
  const response = await api.post("/config-nomor", data);
  return response.data;
};

export const updateConfigNomor = async (id, data) => {
  const response = await api.put(`/config-nomor/${id}`, data);
  return response.data;
};

export const deleteConfigNomor = async (id) => {
  const response = await api.delete(`/config-nomor/${id}`);
  return response.data;
};