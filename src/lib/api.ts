import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { decamelizeKeys, camelizeKeys } from "humps";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Extended Axios config with custom logging metadata
 * Allows partial config for use in hooks and services
 */
export interface AxiosConfigWithMeta extends Partial<InternalAxiosRequestConfig> {
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
// Module-level state to coordinate concurrent refresh attempts
let refreshPromise: Promise<void> | null = null;
let isRefreshLockedOut = false;

apiClient.interceptors.response.use(
  (response) => {
    const contentType = response.headers["content-type"];
    if (
      response.data &&
      typeof contentType === "string" &&
      contentType.includes("application/json")
    ) {
      response.data = camelizeKeys(response.data);

      // Handle JSend 'success' pattern: unwrap 'data' payload
      if (
        response.data &&
        typeof response.data === "object" &&
        response.data.status === "success" &&
        response.data.data !== undefined
      ) {
        response.data = response.data.data;
      }
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosConfigWithMeta;
    const handlerName = originalRequest?.handlerName || "Unknown";
    const stepName = originalRequest?.stepName || "Request";
    const errorMsg = error.message || "Unknown error";

    // Log the error with precision format
    console.error(`[${handlerName}] {${stepName}}: ${errorMsg}`);

    // If we are locked out from refreshing, don't even try
    if (isRefreshLockedOut && error.response?.status === 401) {
      return Promise.reject(error);
    }

    // Only attempt refresh if:
    // - status is 401 (Unauthorized)
    // - not already retried (prevent infinite loops)
    // - not the refresh endpoint itself (avoid loops)
    // - if user is logged in
    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      !originalRequest?.url?.includes("/auth/refresh") &&
      !originalRequest?.url?.includes("auth/idp/token") &&
      localStorage.getItem("session_active") === "true"
    ) {
      if (originalRequest) {
        originalRequest._retry = true;
      }

      try {
        // Handle concurrent refresh: multiple simultaneous 401s
        // will await the same singleton refresh promise
        if (!refreshPromise) {
          refreshPromise = apiClient
            .post("/auth/refresh")
            .then(() => {
              refreshPromise = null;
              isRefreshLockedOut = false;
            })
            .catch((refreshError) => {
              refreshPromise = null;
              isRefreshLockedOut = true;
              // Reset lockout after 10s to allow manual retry if needed
              setTimeout(() => {
                isRefreshLockedOut = false;
              }, 10000);
              throw refreshError;
            });
        }

        // Await the shared refresh effort (cookies updated by server)
        await refreshPromise;

        // Retry the original request
        if (originalRequest) {
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed – reject to allow AuthProvider
        // to handle session expiration and redirect
        const refreshErr = refreshError as AxiosError;
        console.error(
          `[${handlerName}] {Session Refresh Failed}: ${refreshErr.message}`,
        );

        return Promise.reject(refreshError);
      }
    }

    // For all other errors, reject the promise
    // This ensures useMe query transitions to "error"
    // state instead of staying in "pending"
    return Promise.reject(error);
  },
);
