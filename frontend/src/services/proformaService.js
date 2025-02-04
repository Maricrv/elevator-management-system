import api from "./api";

// Fetch all proformas
export const fetchProformas = async () => {
  const response = await api.get("/proformas/");
  return response.data;
};

// Fetch a single proforma by ID
export const fetchProformaById = async (id) => {
  const response = await api.get(`/proformas/${id}/`);
  return response.data;
};

// Create a new proforma
export const createProforma = async (data) => {
  const response = await api.post("/proformas/", data);
  return response.data;
};

// Update an existing proforma
export const updateProforma = async (id, data) => {
  const response = await api.put(`/proformas/${id}/`, data);
  return response.data;
};

// Delete a proforma
export const deleteProforma = async (id) => {
  const response = await api.delete(`/proformas/${id}/`);
  return response.data;
};
