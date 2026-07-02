import api from "./api";

export const getAllMonitoring = async () => {
  const response = await api.get("/monitoring");
  return response.data;
};