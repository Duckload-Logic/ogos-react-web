/**
 * Appointments Feature
 *
 * Public API for the appointments feature module.
 * Use this file to export public components, hooks, and services.
 */

// Types
export type {
  Appointment,
  AppointmentStatus,
  CreateAppointmentRequest,
  TimeSlot,
  UseAppointmentsReturn,
  AvailableTimeSlotView,
  PaginatedAppointmentsResponse,
} from "./types";

// Hooks
export { useAppointments } from "./hooks/useAppointments";

// Constants
export {
  APPOINTMENT_STATUS,
  APPOINTMENT_STATUSES, // Legacy alias
  APPOINTMENT_API_ENDPOINTS,
  APPOINTMENT_ERROR_MESSAGES,
  APPOINTMENT_SUCCESS_MESSAGES,
  APPOINTMENT_FORM_CONSTRAINTS,
} from "./constants";

// Services (re-export for legacy imports)
export * from "./services";

// Page components
export { default as CreateAppointment } from "./pages/student/CreateAppointment";

// UI Components
export {
  AppointmentHeader,
  AppointmentMessages,
  TimeSlotSelector,
  AppointmentDetailsForm,
} from "./components";
