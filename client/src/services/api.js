import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
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
