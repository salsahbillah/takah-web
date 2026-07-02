import api from "./api";

export const getAllApproval = async () => {
  const response = await api.get("/approval");
  return response.data;
};

export const getApprovalById = async (id) => {
  const response = await api.get(`/approval/${id}`);
  return response.data;
};

export const updateApproval = async (id, data) => {
  const response = await api.put(`/approval/${id}`, data);
  return response.data;
};