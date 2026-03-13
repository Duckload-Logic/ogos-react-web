/**
 * Application Constants
 * Centralized app-wide constants and configuration
 */

// Role to route mapping
export const ROLE_ROUTES = {
  1: "/student/home", // Student role
  2: "/admin/home", // Admin role
  3: "/superadmin/home", // Super Admin role
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

/**
 * React Query Cache Timing Configuration
 * Defines staleTime and gcTime for different data freshness needs.
 * Usage: useQuery({ queryKey: [...], queryFn: ..., ...CACHE_TIMING.SHORT })
 */
export const CACHE_TIMING = {
  /**
   * SHORT: 5 minutes stale, 30 minutes garbage collection
   * Use for: Frequently changing data (appointments, slips)
   */
  SHORT: {
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  } as const,

  /**
   * MEDIUM: 30 minutes stale, 1 hour garbage collection
   * Use for: Moderately changing data (user preferences)
   */
  MEDIUM: {
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  } as const,

  /**
   * LONG: 1 hour stale, 2 hours garbage collection
   * Use for: Stable reference data (statuses, categories, locations)
   */
  LONG: {
    staleTime: 60 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
  } as const,

  /**
   * NEVER: Never stale, never garbage collected
   * Use for: Critical data that must always be fresh (user identity)
   */
  NEVER: {
    staleTime: Infinity,
    gcTime: Infinity,
  } as const,

  /**
   * IIR_LOOKUPS: 12 hours stale, 24 hours garbage collection
   * Use for: IIR reference data (courses, genders, religions, etc.)
   */
  IIR_LOOKUPS: {
    staleTime: 12 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  } as const,

  /**
   * IIR_INVENTORY: 1 hour stale, 2 hours garbage collection
   * Use for: IIR student records and inventory data
   */
  IIR_INVENTORY: {
    staleTime: 60 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
  } as const,
} as const;
