import axios from "axios";

const API_URL = "http://localhost:8000/auth/";

// Login function
export const login = async (credentials) => {
  const response = await axios.post(`${API_URL}login/`, credentials);
  return response.data;
};

// Register function
export const register = async (formData) => {
  const response = await axios.post(`${API_URL}register/`, formData); // Ensure the backend endpoint matches
  return response.data;
};

// Fetch all users
export const fetchUsers = async () => {
  const response = await axios.get(`${API_URL}users/`);
  return response.data;
};