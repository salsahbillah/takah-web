import api from "./api";

const mapTakahPayload = (data) => ({
  kode_takah: data.kode,
  nama_takah: data.nama,
  deskripsi: data.deskripsi,
});

export const getAllTakah = async () => {
  const response = await api.get("/takah");
  return response.data;
};

export const getTakahById = async (id) => {
  const response = await api.get(`/takah/${id}`);
  return response.data;
};

export const createTakah = async (data) => {
  const response = await api.post("/takah", mapTakahPayload(data));
  return response.data;
};

export const updateTakah = async (id, data) => {
  const response = await api.put(`/takah/${id}`, mapTakahPayload(data));
  return response.data;
};

export const deleteTakah = async (id) => {
  const response = await api.delete(`/takah/${id}`);
  return response.data;
};