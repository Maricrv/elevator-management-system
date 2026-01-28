import axios from "axios";

const API_HOST =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: `${API_HOST}/api`,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

export default api;

