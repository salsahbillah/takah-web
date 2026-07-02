import api from "./api";

export const getAllParameterSurat = async () => {
  const response = await api.get("/parameter-surat");
  return response.data;
};

export const getParameterSuratById = async (id) => {
  const response = await api.get(`/parameter-surat/${id}`);
  return response.data;
};

export const createParameterSurat = async (data) => {
  const response = await api.post("/parameter-surat", data);
  return response.data;
};

export const updateParameterSurat = async (id, data) => {
  const response = await api.put(`/parameter-surat/${id}`, data);
  return response.data;
};

export const deleteParameterSurat = async (id) => {
  const response = await api.delete(`/parameter-surat/${id}`);
  return response.data;
};