/**
 * Admin Feature - Public API
 * Multi-subdomain admin feature organized by domain:
 * dashboard, appointments, students, excuse-slips, reports
 */

// Subdomains
export * from "./dashboard";
export * from "./appointments";
export * from "./students";
export * from "./excuse-slips";
export * from "./reports";

// Shared admin resources
export { useAdminAppointments } from "./hooks/useAdminAppointments";
export { AppointmentsList } from "./components/AppointmentsList";
export type { Appointment, AppointmentFilters } from "@/features/appointments/services";
