import { apiClient } from "@/lib/api";
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
import { decamelizeKeys } from "humps";
import { DailyStatusCount } from "../types/calendar";
import { toISODateString } from "../utils";

// Re-export types for legacy imports
export type { Appointment, CreateAppointmentRequest, AvailableTimeSlotView };

const GET_APPOINTMENTS_ROUTES = {
  me: "/appointments/me",
  all: "/appointments",
  appointment: (id: number) => `/appointments/id/${id}`,
};

const APPOINTMENT_LOOKUP_ROUTES = {
  slots: "/appointments/lookups/slots",
  categories: "/appointments/lookups/categories",
  statuses: "/appointments/lookups/statuses",
};

const POST_APPOINTMENT_ROUTES = {
  submit: "/appointments",
};

const PATCH_APPOINTMENT_ROUTES = {
  updateStatus: (id: number) => `/appointments/id/${id}`,
};

const appointmentService = {
  async getMyAppointments(
    params: QueryParam,
  ): Promise<PaginatedAppointmentsResponse> {
    const response = await apiClient.get(GET_APPOINTMENTS_ROUTES.me, {
      params: decamelizeKeys(params),
    });
    return response.data;
  },
  async getAllAppointments(
    params?: QueryParam,
  ): Promise<PaginatedAppointmentsResponse> {
    const response = await apiClient.get(GET_APPOINTMENTS_ROUTES.all, {
      params: decamelizeKeys(params),
    });

    return response.data;
  },
  async getAppointmentStats(params?: QueryParam): Promise<StatusCount[]> {
    const response = await apiClient.get("/appointments/stats", {
      params: decamelizeKeys(params),
    });
    return response.data;
  },
  async getCalendarStats(params: QueryParam): Promise<DailyStatusCount[]> {
    const response = await apiClient.get("/appointments/calendar/stats", {
      params: decamelizeKeys(params),
    });
    return response.data;
  },
  async getAppointmentById(id: number): Promise<Appointment> {
    return apiClient.get(GET_APPOINTMENTS_ROUTES.appointment(id));
  },
  async getAvailableSlots(date?: Date): Promise<AvailableTimeSlotView[]> {
    const params = date ? { date: toISODateString(date) } : {};
    const response = await apiClient.get(APPOINTMENT_LOOKUP_ROUTES.slots, {
      params: decamelizeKeys(params),
    });
    return response.data;
  },
  async getCategories(): Promise<ConcernCategory[]> {
    const response = await apiClient.get(APPOINTMENT_LOOKUP_ROUTES.categories);
    return response.data;
  },
  async getStatuses(): Promise<AppointmentStatus[]> {
    const response = await apiClient.get(APPOINTMENT_LOOKUP_ROUTES.statuses);
    return response.data;
  },
  async submitAppointment(data: Appointment) {
    const response = await apiClient.post(POST_APPOINTMENT_ROUTES.submit, data);
    return response.data;
  },
  async updateAppointmentStatus(id: number, status: AppointmentStatus) {
    const response = await apiClient.patch(
      PATCH_APPOINTMENT_ROUTES.updateStatus(id),
      { status: status },
    );
    return response.data;
  },
  async updateAppointment(id: number, data: Appointment) {
    console.log("Updating appointment with data:", data); // Debug log
    const response = await apiClient.patch(
      PATCH_APPOINTMENT_ROUTES.updateStatus(id),
      data,
    );
    return response.data;
  },
};

/**
 * Legacy function aliases for backward compatibility
 * @todo Migrate consumers to use appointmentService methods
 */

/** @deprecated Use appointmentService.getAllAppointments instead */
export const listAllAppointments = async (): Promise<Appointment[]> => {
  // TODO: Implement when API is finalized
  console.warn(
    "[PLACEHOLDER] listAllAppointments called - awaiting API implementation",
  );
  return [];
};

/** @deprecated Use dedicated mutation instead */
export const rescheduleAppointment = async (
  _appointmentId: number,
  _payload: CreateAppointmentRequest,
): Promise<Appointment> => {
  // TODO: Implement when API is finalized
  console.warn(
    "[PLACEHOLDER] rescheduleAppointment called - awaiting API implementation",
  );
  throw new Error("Not implemented - placeholder function");
};

/** @deprecated Use dedicated mutation instead */
export const approveAppointment = async (
  _appointmentId: number,
): Promise<Appointment> => {
  console.warn(
    "[PLACEHOLDER] approveAppointment called - awaiting API implementation",
  );
  throw new Error("Not implemented - placeholder function");
};

/** @deprecated Use dedicated mutation instead */
export const rejectAppointment = async (
  _appointmentId: number,
): Promise<Appointment> => {
  console.warn(
    "[PLACEHOLDER] rejectAppointment called - awaiting API implementation",
  );
  throw new Error("Not implemented - placeholder function");
};

/** @deprecated Use dedicated mutation instead */
export const completeAppointment = async (
  _appointmentId: number,
): Promise<Appointment> => {
  console.warn(
    "[PLACEHOLDER] completeAppointment called - awaiting API implementation",
  );
  throw new Error("Not implemented - placeholder function");
};

export { appointmentService };
export default appointmentService;
