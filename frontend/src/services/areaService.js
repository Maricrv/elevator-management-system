import axios from "axios";

const API_HOST =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

export const fetchAreas = async () => {
  const response = await axios.get(`${API_HOST}/api/areas/`);
  return response.data;
};