/**
 * Axios API client — automatically injects Firebase ID token on every request.
 * All API calls should use this instance, not raw fetch/axios.
 */
import axios from "axios";
import { auth } from "../firebase/firebaseConfig";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 60000, // 60s for long research operations
});

// ── Request interceptor: inject Firebase token ────────────────────────────────
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.warn("Could not get Firebase token:", err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: normalize errors ────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
