import api from "./api";

// Fetch all sales
export const fetchSales = async () => {
  const response = await api.get("/sales/");
  return response.data;
};

// Fetch a single sale by ID
export const fetchSaleById = async (id) => {
  const response = await api.get(`/sales/${id}/`);
  return response.data;
};

// Create a new sale
export const createSale = async (data) => {
  const response = await api.post("/sales/", data);
  return response.data;
};

// Update an existing sale
export const updateSale = async (id, data) => {
  const response = await api.put(`/sales/${id}/`, data);
  return response.data;
};

// Delete a sale
export const deleteSale = async (id) => {
  const response = await api.delete(`/sales/${id}/`);
  return response.data;
};
