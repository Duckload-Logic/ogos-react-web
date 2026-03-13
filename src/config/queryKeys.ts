/**
 * Centralized React Query Keys
 * Single source of truth for all query key definitions.
 * Prevents duplication and ensures consistency across hooks.
 */

/**
 * Query key factory for type-safe, consistent query keys
 * Usage: useQuery({ queryKey: QUERY_KEYS.users.me, ... })
 */
export const QUERY_KEYS = {
  /**
   * User-related query keys
   */
  users: {
    all: ['users'] as const,
    me: ['users', 'me'] as const,
    byId: (id: string) => ['users', 'me', id] as const,
  },

  /**
   * Slip-related query keys
   */
  slips: {
    all: ['slips'] as const,
    mySlips: ['slips', 'me'] as const,
    stats: ['slips', 'stats'] as const,
    byId: (id: number) => ['slips', 'id', id] as const,
    attachments: (id: number) =>
      ['slips', 'id', id, 'attachments'] as const,
    lookups: {
      statuses: ['slips', 'lookups', 'statuses'] as const,
      categories: ['slips', 'lookups', 'categories'] as const,
    },
  },

  /**
   * Appointment-related query keys
   */
  appointments: {
    all: ['appointments'] as const,
    myAppointments: ['appointments', 'me'] as const,
    stats: ['appointments', 'stats'] as const,
    byId: (id: number) => ['appointments', 'id', id] as const,
    lookups: {
      statuses: ['appointments', 'lookups', 'statuses'] as const,
      categories: ['appointments', 'lookups', 'categories'] as const,
      slots: (date: string) =>
        ['appointments', 'lookups', 'slots', date] as const,
    },
  },

  /**
   * Location-related query keys
   */
  locations: {
    regions: ['locations', 'regions'] as const,
    cities: (regionId: number) =>
      ['locations', 'cities', regionId] as const,
    barangays: (cityId: number) =>
      ['locations', 'barangays', cityId] as const,
  },

  /**
   * Consent-related query keys
   */
  consents: {
    latest: (type: string) =>
      ['consents', 'latest', type] as const,
    latestContent: (type: string) =>
      ['consents', 'latest', type, 'content'] as const,
    check: (docId: number) =>
      ['consents', 'check', docId] as const,
  },

  /**
   * Analytics-related query keys
   */
  analytics: {
    all: ['analytics'] as const,
    reports: ['analytics', 'reports'] as const,
  },

  /**
   * IIR (Integrated Information Record) query keys
   */
  iir: {
    lookups: {
      courses: ['iir', 'lookups', 'courses'] as const,
      genders: ['iir', 'lookups', 'genders'] as const,
      religions: ['iir', 'lookups', 'religions'] as const,
      parentalStatusTypes:
        ['iir', 'lookups', 'parental-status-types'] as const,
      enrollmentReasons:
        ['iir', 'lookups', 'enrollment-reasons'] as const,
      incomeRanges:
        ['iir', 'lookups', 'income-ranges'] as const,
      studentSupportTypes:
        ['iir', 'lookups', 'student-support-types'] as const,
      siblingSupportTypes:
        ['iir', 'lookups', 'sibling-support-types'] as const,
      civilStatuses:
        ['iir', 'lookups', 'civil-statuses'] as const,
      natureOfResidenceTypes:
        ['iir', 'lookups', 'nature-of-residence-types'] as const,
      studentRelationshipTypes:
        ['iir', 'lookups', 'student-relationship-types'] as const,
    },
    inventory: {
      all: ['iir', 'inventory', 'all'] as const,
      byUserId: (userId: number) =>
        ['iir', 'inventory', 'user', userId] as const,
      byIirId: (iirId: number) =>
        ['iir', 'inventory', 'iir', iirId] as const,
      profile: (iirId: number) =>
        ['iir', 'inventory', 'profile', iirId] as const,
    },
    draft: ['iir', 'draft'] as const,
  },

  /**
   * Superadmin-related query keys
   */
  superadmin: {
    apiKeys: (includeRevoked: boolean) =>
      ['superadmin', 'api-keys', includeRevoked] as const,
    securityLogs: (params?: any) =>
      ['superadmin', 'security-logs', params] as const,
    systemLogs: (params?: any) =>
      ['superadmin', 'system-logs', params] as const,
    auditLogs: (params?: any) =>
      ['superadmin', 'audit-logs', params] as const,
    logStats: (startDate?: string, endDate?: string) =>
      ['superadmin', 'log-stats', startDate, endDate] as const,
  },
} as const;
