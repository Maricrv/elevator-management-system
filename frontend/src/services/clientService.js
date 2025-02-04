import api from "./api";

// Fetch all clients
export const fetchClients = async () => {
  const response = await api.get("/clients/");
  return response.data;
};

// Fetch a single client by ID
export const fetchClientById = async (id) => {
  const response = await api.get(`/clients/${id}/`);
  return response.data;
};

// Create a new client
export const createClient = async (data) => {
  const response = await api.post("/clients/", data);
  return response.data;
};

// Update an existing client
export const updateClient = async (id, data) => {
  const response = await api.put(`/clients/${id}/`, data);
  return response.data;
};

// Delete a client
export const deleteClient = async (id) => {
  const response = await api.delete(`/clients/${id}/`);
  return response.data;
};
