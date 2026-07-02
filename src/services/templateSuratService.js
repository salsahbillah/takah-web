import api from "./api";

export const getAllTemplateSurat = async () => {
  const response = await api.get("/template-surat");
  return response.data;
};

export const getTemplateSuratById = async (id) => {
  const response = await api.get(`/template-surat/${id}`);
  return response.data;
};

export const createTemplateSurat = async (data) => {
  const response = await api.post("/template-surat", data);
  return response.data;
};

export const updateTemplateSurat = async (id, data) => {
  const response = await api.put(`/template-surat/${id}`, data);
  return response.data;
};

export const deleteTemplateSurat = async (id) => {
  const response = await api.delete(`/template-surat/${id}`);
  return response.data;
};