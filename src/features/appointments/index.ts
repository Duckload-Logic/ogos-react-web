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
} from './types';

// Hooks
export { useAppointments } from './hooks/useAppointments';

// Constants
export {
  APPOINTMENT_STATUS,
  APPOINTMENT_API_ENDPOINTS,
  APPOINTMENT_ERROR_MESSAGES,
  APPOINTMENT_SUCCESS_MESSAGES,
  APPOINTMENT_FORM_CONSTRAINTS,
} from './constants';

// Utilities
export {
  mapDateToString,
  formatAvailableSlots,
  extractErrorMessage,
  validateAppointmentForm,
} from './utils';

// Page components
export { default as ScheduleAppointment } from './pages/ScheduleAppointment';

// UI Components
export {
  AppointmentHeader,
  AppointmentMessages,
  DatePickerCalendar,
  TimeSlotSelector,
  AppointmentDetailsForm,
} from './components';
