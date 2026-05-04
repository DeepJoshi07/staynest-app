import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Backend integration points:
// POST /api/auth/register
// POST /api/auth/login
// GET /api/listings
// GET /api/listings/:id
// POST /api/listings
// PUT /api/listings/:id
// DELETE /api/listings/:id
// POST /api/upload
export default api;
