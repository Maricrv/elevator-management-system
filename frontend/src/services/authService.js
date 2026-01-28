import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/auth/";

// Login function
export const login = async (credentials) => {
  const response = await axios.post(`${API_BASE_URL}login/`, credentials);
  return response.data;
};

// Register function
export const register = async (formData) => {
  const response = await axios.post(`${API_BASE_URL}register/`, formData); // Ensure the backend endpoint matches
  return response.data;
};

// Fetch all users
export const fetchUsers = async () => {
  const response = await axios.get(`${API_BASE_URL}users/`);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};
