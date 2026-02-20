/**
 * Appointment Service
 * Handles all appointment-related API calls
 */

import { apiClient } from "@/lib/api";
import { API_ENDPOINTS } from "@/config/api";
import { TimeSlot } from "@/types";

// Valid appointment status values
export const APPOINTMENT_STATUSES = {
  PENDING: "Pending",
  APPROVED: "Approved",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  RESCHEDULED: "Rescheduled",
} as const;

export type AppointmentStatus =
  (typeof APPOINTMENT_STATUSES)[keyof typeof APPOINTMENT_STATUSES];

export interface Appointment {
  id: number;
  userId: number;
  reason: string;
  scheduledDate: string;
  scheduledTime: string;
  concernCategory: string;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentRequest {
  reason: string;
  scheduledDate: string;
  scheduledTime: string;
  concernCategory?: string;
  status?: AppointmentStatus;
}

export interface UpdateStatusRequest {
  status: string;
}

export interface AppointmentFilters {
  status?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * Fetch all appointments with optional filters
 * @param filters - Filter options (status, date range)
 * @returns List of appointments
 */
export const listAllAppointments = async (
  filters?: AppointmentFilters,
): Promise<Appointment[]> => {
  try {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.startDate) params.append("start_date", filters.startDate);
    if (filters?.endDate) params.append("end_date", filters.endDate);

    const url =
      params.toString() && params.toString().length > 0
        ? `${API_ENDPOINTS.APPOINTMENTS.LIST}?${params.toString()}`
        : `${API_ENDPOINTS.APPOINTMENTS.LIST}`;

    const response = await apiClient.get<Appointment[]>(url);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching all appointments:", error);
    throw error;
  }
};

/**
 * Get appointment by ID
 * @param id - Appointment ID
 * @returns Appointment details
 */
export const getAppointmentById = async (id: number): Promise<Appointment> => {
  try {
    const response = await apiClient.get<Appointment>(
      `${API_ENDPOINTS.APPOINTMENTS.GET(id.toString())}`,
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching appointment ${id}:`, error);
    throw error;
  }
};

/**
 * Get appointments for current user
 * @returns List of user's appointments
 */
export const listUserAppointments = async (): Promise<Appointment[]> => {
  try {
    const response = await apiClient.get<{ data: Appointment[] }>(
      API_ENDPOINTS.APPOINTMENTS.LIST,
    );
    return response.data?.data || [];
  } catch (error) {
    console.error("Error fetching user appointments:", error);
    throw error;
  }
};

/**
 * Get appointments for a specific student
 * @param studentId - Student ID
 * @returns List of student's appointments
 */
export const getStudentAppointments = async (
  studentId: number,
): Promise<Appointment[]> => {
  try {
    const response = await apiClient.get<Appointment[]>(
      `${API_ENDPOINTS.APPOINTMENTS.LIST}/student/${studentId}`,
    );
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error(
      `Error fetching appointments for student ${studentId}:`,
      error,
    );
    throw error;
  }
};

/**
 * Create a new appointment
 * @param payload - Appointment creation data
 * @returns Created appointment
 */
export const scheduleAppointment = async (
  payload: CreateAppointmentRequest,
): Promise<Appointment> => {
  try {
    const response = await apiClient.post<{
      message: string;
      data: Appointment;
    }>(API_ENDPOINTS.APPOINTMENTS.CREATE, payload);
    return response.data.data;
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error;
  }
};

export const createAppointment = scheduleAppointment;

/**
 * Update appointment status (admin action)
 * @param id - Appointment ID
 * @param status - New status
 * @returns Updated appointment
 */
export const updateAppointmentStatus = async (
  id: number,
  status: string,
): Promise<Appointment> => {
  try {
    const response = await apiClient.put<
      Appointment | { message: string; data: Appointment }
    >(`${API_ENDPOINTS.APPOINTMENTS.UPDATE(id.toString())}`, { status });

    // Handle both response formats: direct Appointment or wrapped { message, data }
    if (response.data && "data" in response.data) {
      return (response.data as { message: string; data: Appointment }).data;
    }

    return response.data as Appointment;
  } catch (error) {
    console.error(`Error updating appointment ${id} status:`, error);
    throw error;
  }
};

/**
 * Cancel an appointment
 * @param id - Appointment ID
 * @returns Updated appointment
 */
export const cancelAppointment = async (id: number): Promise<Appointment> => {
  return updateAppointmentStatus(id, "Cancelled");
};

/**
 * Approve an appointment
 * @param id - Appointment ID
 * @returns Updated appointment
 */
export const approveAppointment = async (id: number): Promise<Appointment> => {
  return updateAppointmentStatus(id, "Approved");
};

/**
 * Mark appointment as completed
 * @param id - Appointment ID
 * @returns Updated appointment
 */
export const completeAppointment = async (id: number): Promise<Appointment> => {
  return updateAppointmentStatus(id, "Completed");
};

/**
 * Reschedule an appointment
 * @param id - Appointment ID
 * @param payload - New appointment details
 * @returns Updated appointment
 */
export const rescheduleAppointment = async (
  id: number,
  payload: CreateAppointmentRequest,
): Promise<Appointment> => {
  try {
    const response = await apiClient.put<
      Appointment | { message: string; data: Appointment }
    >(`${API_ENDPOINTS.APPOINTMENTS.UPDATE(id.toString())}`, payload);

    // Handle both response formats: direct Appointment or wrapped { message, data }
    if (response.data && "data" in response.data) {
      return (response.data as { message: string; data: Appointment }).data;
    }

    return response.data as Appointment;
  } catch (error) {
    console.error(`Error rescheduling appointment ${id}:`, error);
    throw error;
  }
};

/**
 * Get all appointments (admin only)
 * @returns List of all appointments
 */
export const getAllAppointments = async (): Promise<Appointment[]> => {
  return listUserAppointments();
};

/**
 * Get all appointments with filters (admin only)
 * @param status - Appointment status filter
 * @param startDate - Start date filter
 * @param endDate - End date filter
 * @returns List of filtered appointments
 */
export const getAllAppointmentsAdmin = async (
  status?: string,
  startDate?: string,
  endDate?: string,
): Promise<Appointment[]> => {
  const filters: AppointmentFilters = {};
  if (status) filters.status = status;
  if (startDate) filters.startDate = startDate;
  if (endDate) filters.endDate = endDate;
  return listAllAppointments(filters);
};

/**
 * Get available time slots for a date
 * @param date - Date to get slots for
 * @returns List of available time slots
 */
export const getAvailableSlots = async (date?: string): Promise<TimeSlot[]> => {
  try {
    const params = date ? { date } : {};
    const response = await apiClient.get<TimeSlot[]>("/appointments/slots", {
      params,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching available slots:", error);
    throw error;
  }
};
