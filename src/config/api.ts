/**
 * API Configuration
 * Centralized API endpoints and base URL configuration
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const API_ENDPOINTS = {
  // PDS/Form endpoints
  PDS: {
    SUBMIT: `${API_BASE_URL}/pds/submit`,
    GET: (id: string) => `${API_BASE_URL}/pds/${id}`,
    UPDATE: (id: string) => `${API_BASE_URL}/pds/${id}`,
    LIST: `${API_BASE_URL}/pds`,
  },

  // Excuse Slip endpoints
  EXCUSE_SLIP: {
    SUBMIT: `${API_BASE_URL}/excuse-slip/submit`,
    GET: (id: string) => `${API_BASE_URL}/excuse-slip/${id}`,
    LIST: `${API_BASE_URL}/excuse-slip`,
    DOWNLOAD: (id: string) => `${API_BASE_URL}/excuse-slip/${id}/download`,
  },

  // Appointment endpoints
  APPOINTMENTS: {
    LIST: `${API_BASE_URL}/appointments`,
    CREATE: `${API_BASE_URL}/appointments`,
    GET: (id: string) => `${API_BASE_URL}/appointments/${id}`,
    UPDATE: (id: string) => `${API_BASE_URL}/appointments/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/appointments/${id}`,
  },

  // Guidance Services endpoints
  GUIDANCE: {
    SERVICES: `${API_BASE_URL}/guidance/services`,
    REQUEST: `${API_BASE_URL}/guidance/request`,
  },
} as const;

/**
 * Default fetch options
 */
export const DEFAULT_FETCH_OPTIONS: RequestInit = {
  headers: {
    "Content-Type": "application/json",
  },
};

/**
 * Helper to make API requests
 */
export async function apiCall<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, {
    ...DEFAULT_FETCH_OPTIONS,
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}
