import axios from "axios";

const api = axios.create({
  baseURL: "https://mostafasaeed.pythonanywhere.com/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔥 FIX FINAL
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;