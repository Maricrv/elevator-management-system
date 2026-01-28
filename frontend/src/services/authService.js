import axios from "axios";

const API_HOST =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

export const login = async (credentials) => {
  const response = await axios.post(`${API_HOST}/auth/login/`, credentials);
  return response.data;
};

export const register = async (formData) => {
  const response = await axios.post(`${API_HOST}/auth/register/`, formData);
  return response.data;
};

export const fetchUsers = async () => {
  const response = await axios.get(`${API_HOST}/auth/users/`);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};