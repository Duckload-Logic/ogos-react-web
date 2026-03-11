import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // send cookies
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh if:
    // - status is 401
    // - not already retried
    // - not the refresh endpoint itself (avoid loops)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        // Call refresh endpoint – cookies are sent automatically
        await apiClient.post("/auth/refresh");
        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed – do NOT redirect here; let the app handle it
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
