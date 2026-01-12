/**
 * Admin Feature - Public API
 * Multi-subdomain admin feature organized by domain:
 * dashboard, appointments, students, excuse-slips, reports
 */

// Subdomains
// @ts-expect-error
export * from "./dashboard"; 
// @ts-expect-error
export * from "./appointments";
// @ts-expect-error
export * from "./students";
// @ts-expect-error
export * from "./excuse-slips";
// @ts-expect-error
export * from "./reports"; 

// Shared admin resources
export { useAdminAppointments } from "./hooks/useAdminAppointments";
export { AppointmentsList } from "./components/AppointmentsList";
export type { Appointment, AppointmentFilters } from "@/features/appointments/services";
