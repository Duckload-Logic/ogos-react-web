/**
 * Admin Features - Appointments Module
 * Exports all appointments-related components, hooks, and utilities
 */

// Hooks
export { useAdminAppointments } from "./hooks/useAdminAppointments";

// Components
export { AppointmentsList } from "./components/AppointmentsList";

// Types are imported from services directly
export type { Appointment, AppointmentFilters } from "@/services/appointmentService";
