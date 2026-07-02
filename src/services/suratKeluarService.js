import api from "./api";

export const getAllSuratKeluar = async () => {
  const response = await api.get("/surat-keluar");
  return response.data;
};

export const getSuratKeluarById = async (id) => {
  const response = await api.get(`/surat-keluar/${id}`);
  return response.data;
};

export const createSuratKeluar = async (data) => {
  const response = await api.post("/surat-keluar", data);
  return response.data;
};

export const updateSuratKeluar = async (id, data) => {
  const response = await api.put(`/surat-keluar/${id}`, data);
  return response.data;
};

export const deleteSuratKeluar = async (id) => {
  const response = await api.delete(`/surat-keluar/${id}`);
  return response.data;
};

export const submitSuratKeluarApproval = async (id) => {
  const response = await api.put(`/surat-keluar/${id}/submit-approval`);
  return response.data;
};