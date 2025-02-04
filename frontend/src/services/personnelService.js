import api from "./api";

// Fetch all personnel
export const fetchPersonnel = async () => {
  const response = await api.get("/personnel/");
  return response.data;
};

// Fetch a single personnel record by ID
export const fetchPersonnelById = async (id) => {
  const response = await api.get(`/personnel/${id}/`);
  return response.data;
};

// Add a new personnel record
export const addPersonnel = async (data) => {
  const response = await api.post("/personnel/", data);
  return response.data;
};

// Update a personnel record
export const updatePersonnel = async (id, data) => {
  const response = await api.put(`/personnel/${id}/`, data);
  return response.data;
};

// Delete a personnel record
export const deletePersonnel = async (id) => {
  const response = await api.delete(`/personnel/${id}/`);
  return response.data;
};
