/**
 * API Service
 * Centralized API communication and HTTP client
 */

import { API_ENDPOINTS } from "@/config/api";

/**
 * Fetch helper with error handling
 */
async function apiRequest<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || response.statusText);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

/**
 * Personal Data Sheet (PDS) API calls
 */
export const pdsService = {
  submitForm: (data: unknown) =>
    apiRequest(API_ENDPOINTS.PDS.SUBMIT, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getForm: (id: string) =>
    apiRequest(API_ENDPOINTS.PDS.GET(id), {
      method: "GET",
    }),

  updateForm: (id: string, data: unknown) =>
    apiRequest(API_ENDPOINTS.PDS.UPDATE(id), {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  listForms: () =>
    apiRequest(API_ENDPOINTS.PDS.LIST, {
      method: "GET",
    }),
};

/**
 * Excuse Slip API calls
 */
export const excuseSlipService = {
  submitRequest: (data: unknown) =>
    apiRequest(API_ENDPOINTS.EXCUSE_SLIP.SUBMIT, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getSlip: (id: string) =>
    apiRequest(API_ENDPOINTS.EXCUSE_SLIP.GET(id), {
      method: "GET",
    }),

  listSlips: () =>
    apiRequest(API_ENDPOINTS.EXCUSE_SLIP.LIST, {
      method: "GET",
    }),

  downloadSlip: (id: string) =>
    fetch(API_ENDPOINTS.EXCUSE_SLIP.DOWNLOAD(id)),
};

/**
 * Appointment API calls
 */
export const appointmentService = {
  listAppointments: () =>
    apiRequest(API_ENDPOINTS.APPOINTMENTS.LIST, {
      method: "GET",
    }),

  createAppointment: (data: unknown) =>
    apiRequest(API_ENDPOINTS.APPOINTMENTS.CREATE, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getAppointment: (id: string) =>
    apiRequest(API_ENDPOINTS.APPOINTMENTS.GET(id), {
      method: "GET",
    }),

  updateAppointment: (id: string, data: unknown) =>
    apiRequest(API_ENDPOINTS.APPOINTMENTS.UPDATE(id), {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteAppointment: (id: string) =>
    apiRequest(API_ENDPOINTS.APPOINTMENTS.DELETE(id), {
      method: "DELETE",
    }),
};

/**
 * Guidance Services API calls
 */
export const guidanceService = {
  getServices: () =>
    apiRequest(API_ENDPOINTS.GUIDANCE.SERVICES, {
      method: "GET",
    }),

  requestService: (data: unknown) =>
    apiRequest(API_ENDPOINTS.GUIDANCE.REQUEST, {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
