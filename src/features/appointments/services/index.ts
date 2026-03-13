/**
 * Appointment Service Layer
 * Handles all appointment-related API calls
 */

import { apiClient, AxiosConfigWithMeta } from "@/lib/api";
import { API_ROUTES } from "@/config/apiRoutes";
import type {
  Appointment,
  CreateAppointmentRequest,
  AvailableTimeSlotView,
  ConcernCategory,
  AppointmentStatus,
  PaginatedAppointmentsResponse,
  StatusCount,
} from "../types";
import { QueryParam } from "../types/reqParams";
import { DailyStatusCount } from "../types/calendar";
import { toISODateString } from "../utils";

// Re-export types for legacy imports
export type {
  Appointment,
  CreateAppointmentRequest,
  AvailableTimeSlotView,
};

/**
 * Get current user's appointments
 * @param params - Query parameters
 * @param config - Axios config with logging metadata
 * @returns Paginated appointments response
 */
export async function GetMyAppointments(
  params: QueryParam,
  config?: AxiosConfigWithMeta,
): Promise<PaginatedAppointmentsResponse> {
  try {
    const response = await apiClient.get(
      API_ROUTES.appointments.myAppointments,
      { ...config, params },
    );
    return response.data;
  } catch (error: any) {
    const handlerName = config?.handlerName || 'GetMyAppointments';
    const stepName = config?.stepName || 'Fetch My Appointments';
    console.error(
      `[${handlerName}] {${stepName}}: ${error.message}`,
    );
    throw error;
  }
}

/**
 * Get all appointments with pagination
 * @param params - Query parameters
 * @param config - Axios config with logging metadata
 * @returns Paginated appointments response
 */
export async function GetAllAppointments(
  params?: QueryParam,
  config?: AxiosConfigWithMeta,
): Promise<PaginatedAppointmentsResponse> {
  try {
    const response = await apiClient.get(
      API_ROUTES.appointments.all,
      { ...config, params },
    );
    return response.data;
  } catch (error: any) {
    const handlerName = config?.handlerName || 'GetAllAppointments';
    const stepName = config?.stepName || 'Fetch All Appointments';
    console.error(
      `[${handlerName}] {${stepName}}: ${error.message}`,
    );
    throw error;
  }
}

/**
 * Get appointment statistics
 * @param params - Query parameters
 * @param config - Axios config with logging metadata
 * @returns Status count array
 */
export async function GetAppointmentStats(
  params?: QueryParam,
  config?: AxiosConfigWithMeta,
): Promise<StatusCount[]> {
  try {
    const response = await apiClient.get(
      API_ROUTES.appointments.stats,
      { ...config, params },
    );
    return response.data;
  } catch (error: any) {
    const handlerName = config?.handlerName || 'GetAppointmentStats';
    const stepName = config?.stepName || 'Fetch Stats';
    console.error(
      `[${handlerName}] {${stepName}}: ${error.message}`,
    );
    throw error;
  }
}

/**
 * Get calendar statistics
 * @param params - Query parameters
 * @param config - Axios config with logging metadata
 * @returns Daily status count array
 */
export async function GetCalendarStats(
  params: QueryParam,
  config?: AxiosConfigWithMeta,
): Promise<DailyStatusCount[]> {
  try {
    const response = await apiClient.get(
      API_ROUTES.appointments.calendarStats,
      { ...config, params },
    );
    return response.data;
  } catch (error: any) {
    const handlerName = config?.handlerName || 'GetCalendarStats';
    const stepName = config?.stepName || 'Fetch Calendar Stats';
    console.error(
      `[${handlerName}] {${stepName}}: ${error.message}`,
    );
    throw error;
  }
}

/**
 * Get appointment by ID
 * @param id - Appointment ID
 * @param config - Axios config with logging metadata
 * @returns Appointment details
 */
export async function GetAppointmentById(
  id: number,
  config?: AxiosConfigWithMeta,
): Promise<Appointment> {
  try {
    const response = await apiClient.get(
      API_ROUTES.appointments.byId(id),
      config,
    );
    return response.data;
  } catch (error: any) {
    const handlerName = config?.handlerName || 'GetAppointmentById';
    const stepName = config?.stepName || 'Fetch Appointment';
    console.error(
      `[${handlerName}] {${stepName}}: ${error.message}`,
    );
    throw error;
  }
}

/**
 * Get available appointment slots
 * @param date - Date to check availability
 * @param config - Axios config with logging metadata
 * @returns Available time slots
 */
export async function GetAvailableSlots(
  date?: Date,
  config?: AxiosConfigWithMeta,
): Promise<AvailableTimeSlotView[]> {
  try {
    const params = date ? { date: toISODateString(date) } : {};
    const response = await apiClient.get(
      API_ROUTES.appointments.lookups.slots,
      { ...config, params },
    );
    return response.data;
  } catch (error: any) {
    const handlerName = config?.handlerName || 'GetAvailableSlots';
    const stepName = config?.stepName || 'Fetch Available Slots';
    console.error(
      `[${handlerName}] {${stepName}}: ${error.message}`,
    );
    throw error;
  }
}

/**
 * Get appointment concern categories
 * @param config - Axios config with logging metadata
 * @returns Array of concern categories
 */
export async function GetAppointmentCategories(
  config?: AxiosConfigWithMeta,
): Promise<ConcernCategory[]> {
  try {
    const response = await apiClient.get(
      API_ROUTES.appointments.lookups.categories,
      config,
    );
    return response.data;
  } catch (error: any) {
    const handlerName = config?.handlerName ||
      'GetAppointmentCategories';
    const stepName = config?.stepName || 'Fetch Categories';
    console.error(
      `[${handlerName}] {${stepName}}: ${error.message}`,
    );
    throw error;
  }
}

/**
 * Get appointment statuses
 * @param config - Axios config with logging metadata
 * @returns Array of appointment statuses
 */
export async function GetAppointmentStatuses(
  config?: AxiosConfigWithMeta,
): Promise<AppointmentStatus[]> {
  try {
    const response = await apiClient.get(
      API_ROUTES.appointments.lookups.statuses,
      config,
    );
    return response.data;
  } catch (error: any) {
    const handlerName = config?.handlerName ||
      'GetAppointmentStatuses';
    const stepName = config?.stepName || 'Fetch Statuses';
    console.error(
      `[${handlerName}] {${stepName}}: ${error.message}`,
    );
    throw error;
  }
}

/**
 * Submit a new appointment
 * @param data - Appointment data
 * @param config - Axios config with logging metadata
 * @returns Created appointment
 */
export async function PostAppointment(
  data: Appointment,
  config?: AxiosConfigWithMeta,
): Promise<Appointment> {
  try {
    const response = await apiClient.post(
      API_ROUTES.appointments.all,
      data,
      config,
    );
    return response.data;
  } catch (error: any) {
    const handlerName = config?.handlerName || 'PostAppointment';
    const stepName = config?.stepName || 'Submit Appointment';
    console.error(
      `[${handlerName}] {${stepName}}: ${error.message}`,
    );
    throw error;
  }
}

/**
 * Update appointment status
 * @param id - Appointment ID
 * @param status - New status
 * @param config - Axios config with logging metadata
 * @returns Updated appointment
 */
export async function PatchAppointmentStatus(
  id: number,
  status: AppointmentStatus,
  config?: AxiosConfigWithMeta,
): Promise<Appointment> {
  try {
    const response = await apiClient.patch(
      API_ROUTES.appointments.byId(id),
      { status },
      config,
    );
    return response.data;
  } catch (error: any) {
    const handlerName = config?.handlerName ||
      'PatchAppointmentStatus';
    const stepName = config?.stepName || 'Update Status';
    console.error(
      `[${handlerName}] {${stepName}}: ${error.message}`,
    );
    throw error;
  }
}

/**
 * Update appointment details
 * @param id - Appointment ID
 * @param data - Updated appointment data
 * @param config - Axios config with logging metadata
 * @returns Updated appointment
 */
export async function PatchAppointment(
  id: number,
  data: Appointment,
  config?: AxiosConfigWithMeta,
): Promise<Appointment> {
  try {
    const response = await apiClient.patch(
      API_ROUTES.appointments.byId(id),
      data,
      config,
    );
    return response.data;
  } catch (error: any) {
    const handlerName = config?.handlerName || 'PatchAppointment';
    const stepName = config?.stepName || 'Update Appointment';
    console.error(
      `[${handlerName}] {${stepName}}: ${error.message}`,
    );
    throw error;
  }
}

/**
 * Legacy service object for backward compatibility
 * Gradually migrate to direct function imports
 */
export const appointmentService = {
  GetMyAppointments,
  GetAllAppointments,
  GetAppointmentStats,
  GetCalendarStats,
  GetAppointmentById,
  GetAvailableSlots,
  GetAppointmentCategories,
  GetAppointmentStatuses,
  PostAppointment,
  PatchAppointmentStatus,
  PatchAppointment,
};

export default appointmentService;
