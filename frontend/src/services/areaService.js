import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

export const fetchAreas = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/areas/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching areas:", error);
    throw error;
  }
};
