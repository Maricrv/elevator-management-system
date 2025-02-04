import api from "./api";

// Fetch all inventory items
export const fetchInventory = async () => {
  const response = await api.get("/inventory/");
  return response.data;
};

// Fetch inventory transactions
export const fetchInventoryTransactions = async () => {
  const response = await api.get("/inventory/transactions/");
  return response.data;
};

// Add inventory item
export const addInventoryItem = async (data) => {
  const response = await api.post("/inventory/", data);
  return response.data;
};

// Update inventory item
export const updateInventoryItem = async (id, data) => {
  const response = await api.put(`/inventory/${id}/`, data);
  return response.data;
};

// Delete inventory item
export const deleteInventoryItem = async (id) => {
  const response = await api.delete(`/inventory/${id}/`);
  return response.data;
};
