import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_API || "http://localhost:8080/api/v1";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Include cookies in requests
  
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // your saved token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;