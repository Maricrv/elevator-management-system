import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api"; // Replace with your actual API URL

export const fetchModels = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/models/`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch models:", error);
    throw error;
  }
};
