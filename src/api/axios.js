import axios from "axios";

const api = axios.create({
  baseURL: "https://mostafasaeed.pythonanywhere.com/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ attach token safely
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");

  const isAuthRequest = config.url?.includes("token");

  if (token && !isAuthRequest) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;