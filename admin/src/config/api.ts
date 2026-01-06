/**
 * API Configuration
 * Centralized API endpoints and base URL configuration
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    REFRESH: `${API_BASE_URL}/auth/refresh`,
  },

  // PDS/Form endpoints
  PDS: {
    SUBMIT: `${API_BASE_URL}/pds/submit`,
    GET: (id: string) => `${API_BASE_URL}/pds/${id}`,
    UPDATE: (id: string) => `${API_BASE_URL}/pds/${id}`,
    LIST: `${API_BASE_URL}/pds`,
  },

  // Excuse Slip endpoints
  EXCUSE_SLIP: {
    SUBMIT: `${API_BASE_URL}/excuseslips`,
    GET: (id: string) => `${API_BASE_URL}/excuseslips/${id}`,
    LIST: `${API_BASE_URL}/excuseslips`,
    DOWNLOAD: (id: string) => `${API_BASE_URL}/excuseslips/${id}/download`,
  },

  // Appointment endpoints
  APPOINTMENTS: {
    LIST: `${API_BASE_URL}/appointments`,
    CREATE: `${API_BASE_URL}/appointments`,
    GET: (id: string) => `${API_BASE_URL}/appointments/${id}`,
    UPDATE: (id: string) => `${API_BASE_URL}/appointments/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/appointments/${id}`,
  },

  // Student endpoints
  STUDENTS: {
    PROFILE_BASE: `${API_BASE_URL}/students/onboarding/base`,
    PROFILE_BASE_GET: (id: string) => `${API_BASE_URL}/students/profile/base/${id}`,
    PROFILE_FAMILY: `${API_BASE_URL}/students/onboarding/family`,
    PROFILE_FAMILY_GET: (id: string) => `${API_BASE_URL}/students/profile/family/${id}`,
    PROFILE_HEALTH: `${API_BASE_URL}/students/onboarding/health`,
    PROFILE_HEALTH_GET: (id: string) => `${API_BASE_URL}/students/profile/health/${id}`,
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
