import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  timeout: 30000, // ✅ 30 seconds timeout (prevents infinite loading)
});

export default api;
