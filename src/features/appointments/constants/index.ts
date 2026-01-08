/**
 * Appointment Feature Constants
 * 
 * Feature-specific static values, API endpoints, and configuration constants.
 */

export const APPOINTMENT_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  RESCHEDULED: 'Rescheduled',
} as const;

export const APPOINTMENT_API_ENDPOINTS = {
  BASE: '/appointments',
  SLOTS: '/appointments/slots',
  GET_BY_ID: (id: number) => `/appointments/${id}`,
  UPDATE_STATUS: (id: number) => `/appointments/${id}/status`,
} as const;

export const APPOINTMENT_ERROR_MESSAGES = {
  NOT_AUTHENTICATED: 'User not authenticated',
  FETCH_FAILED: 'Failed to fetch appointments',
  FETCH_SLOTS_FAILED: 'Failed to fetch available slots',
  CREATE_FAILED: 'Failed to create appointment',
  UPDATE_STATUS_FAILED: 'Failed to update appointment status',
  CANCEL_FAILED: 'Failed to cancel appointment',
} as const;

export const APPOINTMENT_SUCCESS_MESSAGES = {
  SCHEDULED: 'Appointment scheduled successfully!',
  CANCELLED: 'Appointment cancelled successfully!',
} as const;

export const APPOINTMENT_FORM_CONSTRAINTS = {
  MAX_REASON_LENGTH: 500,
  MIN_REASON_LENGTH: 10,
} as const;
