/**
 * Appointment Service
 * Centralized appointment API calls
 */

import { apiClient } from "@/lib/apiClient";

export interface AppointmentPayload {
  studentId: string;
  guidanceOfficerId?: string;
  date: string;
  time: string;
  reason: string;
  notes?: string;
}

export interface Appointment {
  id: string;
  studentId: string;
  guidanceOfficerId?: string;
  date: string;
  time: string;
  reason: string;
  notes?: string;
  status: "scheduled" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentResponse {
  id: string;
  message: string;
}

export interface TimeSlot {
  slotId: number;
  startTime: string;
  isNotTaken: boolean;
}

/**
 * Schedule new appointment
 */
export const scheduleAppointment = async (
  payload: AppointmentPayload
): Promise<AppointmentResponse> => {
  return apiClient.post("/appointments", payload);
};

/**
 * Get appointment by ID
 */
export const getAppointmentById = async (id: string): Promise<Appointment> => {
  return apiClient.get(`/appointments/${id}`);
};

/**
 * List user's appointments
 */
export const listUserAppointments = async (): Promise<Appointment[]> => {
  return apiClient.get("/appointments");
};

/**
 * List all appointments (admin only)
 */
export const listAllAppointments = async (): Promise<Appointment[]> => {
  return apiClient.get("/admin/appointments");
};

/**
 * Update appointment
 */
export const updateAppointment = async (
  id: string,
  payload: Partial<AppointmentPayload>
): Promise<Appointment> => {
  return apiClient.put(`/appointments/${id}`, payload);
};

/**
 * Cancel appointment
 */
export const cancelAppointment = async (appointment: Appointment): Promise<Appointment> => {
  return apiClient.patch(`/appointments/${appointment.id}`, { appointment });
};

/**
 * Get available time slots
 */
export const getAvailableSlots = async (date: string): Promise<string[]> => {
  return apiClient.get(`/appointments/availability?date=${date}`);
};
