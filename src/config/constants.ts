/**
 * Application Constants
 * Centralized app-wide constants and configuration
 */

// Role to route mapping
export const ROLE_ROUTES = {
  1: "/student/home", // Student role
  2: "/admin/home", // Admin role
} as const;

// Excuse Slip status
export const STATUS_COLORS: Record<string, string> = {
  warning:
    "bg-warning-background text-warning-foreground border-warning-foreground",
  danger:
    "bg-danger-background text-danger-foreground border-danger-foreground",
  success:
    "bg-success-background text-success-foreground border-success-foreground",
  info: "bg-info-background text-info-foreground border-info-foreground",
  stale: "bg-stale-background text-stale-foreground border-stale-foreground",
  notice:
    "bg-notice-background text-notice-foreground border-notice-foreground",
} as const;

// App config
export const APP_CONFIG = {
  APP_NAME: "PUP Guidance System",
  STUDENT_ID_PREFIX: "PUP",
  FORM_VALIDATION_DEBOUNCE: 300, // ms
  AUTO_SAVE_INTERVAL: 30000, // 30 seconds
} as const;
