import api from "./api";

// Fetch maintenance requests
export const fetchMaintenanceRequests = async () => {
  const response = await api.get("/maintenance/requests/");
  return response.data;
};

// Fetch maintenance logs
export const fetchMaintenanceLogs = async () => {
  const response = await api.get("/maintenance/logs/");
  return response.data;
};

// Create a maintenance request
export const createMaintenanceRequest = async (data) => {
  const response = await api.post("/maintenance/requests/", data);
  return response.data;
};

// Update maintenance request
export const updateMaintenanceRequest = async (id, data) => {
  const response = await api.put(`/maintenance/requests/${id}/`, data);
  return response.data;
};
