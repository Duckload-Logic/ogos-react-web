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
export type { Appointment } from "@/features/appointments/services";
