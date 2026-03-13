/**
 * Centralized API Routes Configuration
 * Single source of truth for all API endpoint strings.
 * Prevents hardcoded URLs and enables easy endpoint updates.
 */

/**
 * API route definitions organized by feature domain
 * All routes are frozen to prevent accidental mutations
 */
export const API_ROUTES = Object.freeze({
  /**
   * User-related endpoints
   */
  users: Object.freeze({
    me: '/users/me',
    byId: (id: string) => `/users/${id}`,
  }),

  /**
   * Slip (Excuse Slip) related endpoints
   */
  slips: Object.freeze({
    all: '/slips',
    mySlips: '/slips/me',
    urgent: '/slips/urgent',
    stats: '/slips/stats',
    byId: (id: number) => `/slips/id/${id}`,
    attachments: (id: number) =>
      `/slips/id/${id}/attachments`,
    downloadAttachment: (id: number, attachmentId: number) =>
      `/slips/id/${id}/attachments/${attachmentId}`,
    lookups: Object.freeze({
      statuses: '/slips/lookups/statuses',
      categories: '/slips/lookups/categories',
    }),
    updateStatus: (id: number) =>
      `/slips/id/${id}/status`,
  }),

  /**
   * Appointment related endpoints
   */
  appointments: Object.freeze({
    all: '/appointments',
    myAppointments: '/appointments/me',
    stats: '/appointments/stats',
    calendarStats: '/appointments/calendar/stats',
    byId: (id: number) => `/appointments/id/${id}`,
    lookups: Object.freeze({
      statuses: '/appointments/lookups/statuses',
      categories: '/appointments/lookups/categories',
      slots: '/appointments/lookups/slots',
    }),
  }),

  /**
   * Location related endpoints
   */
  locations: Object.freeze({
    regions: '/locations/regions',
    cities: (regionId: number) =>
      `/locations/regions/${regionId}/cities`,
    barangays: (cityId: number) =>
      `/locations/cities/${cityId}/barangays`,
  }),

  /**
   * Consent related endpoints
   */
  consents: Object.freeze({
    latest: (type: string) =>
      `/consents/latest/${type}`,
    latestContent: (type: string) =>
      `/consents/latest/${type}/content`,
    checkConsent: (docId: number) =>
      `/consents/check/doc/${docId}`,
    giveConsent: (type: string, docId: number) =>
      `/consents/${type}/doc/${docId}`,
  }),

  /**
   * Analytics related endpoints
   */
  analytics: Object.freeze({
    all: '/analytics',
    reports: '/analytics/reports',
  }),

  /**
   * Authentication related endpoints
   */
  auth: Object.freeze({
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    register: '/auth/register',
  }),

  /**
   * IIR (Integrated Information Record) related endpoints
   */
  iir: Object.freeze({
    lookups: Object.freeze({
      courses: '/students/lookups/courses',
      genders: '/students/lookups/genders',
      religions: '/students/lookups/religions',
      parentalStatusTypes:
        '/students/lookups/parental-status-types',
      enrollmentReasons:
        '/students/lookups/enrollment-reasons',
      incomeRanges: '/students/lookups/income-ranges',
      studentSupportTypes:
        '/students/lookups/support-types',
      siblingSupportTypes:
        '/students/lookups/support-types/siblings',
      civilStatuses: '/students/lookups/civil-statuses',
      natureOfResidenceTypes:
        '/students/lookups/nature-of-residence-types',
      studentRelationshipTypes:
        '/students/lookups/student-relationship-types',
    }),
    inventory: Object.freeze({
      all: '/students/inventory/records',
      byUserId: (userId: number) =>
        `/students/inventory/records/user/${userId}`,
      byIirId: (iirId: number) =>
        `/students/inventory/records/iir/${iirId}`,
      profile: (iirId: number) =>
        `/students/inventory/records/iir/${iirId}/profile`,
      enrollmentReasons: (iirId: number) =>
        `/students/inventory/records/iir/${iirId}/enrollment-reasons`,
      personalInfo: (iirId: number) =>
        `/students/inventory/records/iir/${iirId}/personal-info`,
      addresses: (iirId: number) =>
        `/students/inventory/records/iir/${iirId}/addresses`,
      familyBackground: (iirId: number) =>
        `/students/inventory/records/iir/${iirId}/family-background`,
      relatedPersons: (iirId: number) =>
        `/students/inventory/records/iir/${iirId}/related-persons`,
      education: (iirId: number) =>
        `/students/inventory/records/iir/${iirId}/education`,
      finance: (iirId: number) =>
        `/students/inventory/records/iir/${iirId}/finance`,
      health: (iirId: number) =>
        `/students/inventory/records/iir/${iirId}/health`,
      consultations: (iirId: number) =>
        `/students/inventory/records/iir/${iirId}/consultations`,
      activities: (iirId: number) =>
        `/students/inventory/records/iir/${iirId}/activities`,
      subjectPreferences: (iirId: number) =>
        `/students/inventory/records/iir/${iirId}/subject-preferences`,
      hobbies: (iirId: number) =>
        `/students/inventory/records/iir/${iirId}/hobbies`,
      testResults: (iirId: number) =>
        `/students/inventory/records/iir/${iirId}/test-results`,
      significantNotes: (iirId: number) =>
        `/students/inventory/records/iir/${iirId}/significant-notes`,
    }),
    draft: Object.freeze({
      save: '/students/inventory/records/iir/draft',
      submit: '/students/inventory/records/iir/draft',
    }),
    submit: '/students/inventory/records/iir',
    checkOnboarding: (userId: number) =>
      `/students/record/${userId}`,
  }),
  /**
   * Superadmin related endpoints
   */
  superadmin: Object.freeze({
    apiKeys: Object.freeze({
      list: '/api-keys',
      create: '/api-keys',
      revoke: (id: number) => `/api-keys/${id}`,
    }),
    logs: Object.freeze({
      security: '/system-logs/security',
      system: '/system-logs/system',
      audit: '/system-logs/audit',
      stats: '/system-logs/stats',
    }),
  }),
});
