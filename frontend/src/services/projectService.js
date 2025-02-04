import api from "./api";

// Fetch all projects
export const fetchProjects = async () => {
  const response = await api.get("/projects/");
  return response.data;
};

// Fetch a single project by ID
export const fetchProjectById = async (id) => {
  const response = await api.get(`/projects/${id}/`);
  return response.data;
};

// Create a new project
export const createProject = async (data) => {
  const response = await api.post("/projects/", data);
  return response.data;
};

// Update an existing project
export const updateProject = async (id, data) => {
  const response = await api.put(`/projects/${id}/`, data);
  return response.data;
};

// Delete a project
export const deleteProject = async (id) => {
  const response = await api.delete(`/projects/${id}/`);
  return response.data;
};
