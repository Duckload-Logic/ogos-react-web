import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { decamelizeKeys } from "humps";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Extended Axios config with custom logging metadata
 * Allows partial config for use in hooks and services
 */
export interface AxiosConfigWithMeta
  extends Partial<InternalAxiosRequestConfig> {
  handlerName?: string;
  stepName?: string;
  _retry?: boolean;
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

/**
 * Request Interceptor: Transform params from camelCase
 * to snake_case. Eliminates need for manual
 * decamelizeKeys calls in services
 */
apiClient.interceptors.request.use((config) => {
  if (config.params) {
    config.params = decamelizeKeys(config.params);
  }
  return config;
});

/**
 * Response Interceptor: Handle errors with precision
 * logging. Extracts handlerName and stepName from
 * config for detailed logs. Attempts token refresh
 * on 401, then rejects if refresh fails to allow
 * AuthProvider to handle session expiration.
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosConfigWithMeta;
    const handlerName =
      originalRequest?.handlerName || "Unknown";
    const stepName = originalRequest?.stepName || "Request";
    const errorMsg = error.message || "Unknown error";

    // Log the error with precision format
    console.error(
      `[${handlerName}] {${stepName}}: ${errorMsg}`,
    );

    // Only attempt refresh if:
    // - status is 401 (Unauthorized)
    // - not already retried (prevent infinite loops)
    // - not the refresh endpoint itself (avoid loops)
    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      !originalRequest?.url?.includes("/auth/refresh")
    ) {
      if (originalRequest) {
        originalRequest._retry = true;
      }

      try {
        // Call refresh endpoint – cookies sent automatically
        await apiClient.post("/auth/refresh");
        // Retry the original request
        if (originalRequest) {
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed – reject to allow AuthProvider
        // to handle session expiration and redirect
        const refreshErr = refreshError as AxiosError;
        console.error(
          `[${handlerName}] {Token Refresh}: ` +
            `${refreshErr.message}`,
        );
        // CRITICAL: Return rejected promise so useMe
        // query transitions to "error" state
        return Promise.reject(refreshError);
      }
    }

    // For all other errors, reject the promise
    // This ensures useMe query transitions to "error"
    // state instead of staying in "pending"
    return Promise.reject(error);
  },
);
