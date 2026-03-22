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
    byId: (id: string) => `/users/${id}`,
  }),

  /**
   * Slip (Excuse Slip) related endpoints
   */
  slips: Object.freeze({
    all: "/slips",
    mySlips: "/slips/me",
    urgent: "/slips/urgent",
    stats: "/slips/stats",
    byId: (id: string) => `/slips/id/${id}`,
    attachments: (id: string) => `/slips/id/${id}/attachments`,
    downloadAttachment: (id: string, attachmentId: string) =>
      `/slips/id/${id}/attachments/${attachmentId}`,
    lookups: Object.freeze({
      statuses: "/slips/lookups/statuses",
      categories: "/slips/lookups/categories",
    }),
    updateStatus: (id: string) => `/slips/id/${id}/status`,
  }),

  /**
   * Appointment related endpoints
   */
  appointments: Object.freeze({
    all: "/appointments",
    myAppointments: "/appointments/me",
    stats: "/appointments/stats",
    calendarStats: "/appointments/calendar/stats",
    byId: (id: string) => `/appointments/id/${id}`,
    lookups: Object.freeze({
      statuses: "/appointments/lookups/statuses",
      categories: "/appointments/lookups/categories",
      slots: "/appointments/lookups/slots",
    }),
  }),

  /**
   * Significant Notes related endpoints
   */
  notes: Object.freeze({
    all: "/notes",
    byIirId: (iirId: string) => `/notes/user/id/${iirId}`,
  }),

  /**
   * Location related endpoints
   */
  locations: Object.freeze({
    regions: "/locations/regions",
    provinces: (regionCode: string) =>
      `/locations/regions/${regionCode}/provinces`,
    citiesByRegion: (regionCode: string) =>
      `/locations/regions/${regionCode}/cities`,
    citiesByProvince: (provinceCode: string) =>
      `/locations/provinces/${provinceCode}/cities`,
    barangays: (cityCode: string) => `/locations/cities/${cityCode}/barangays`,
  }),

  /**
   * Consent related endpoints
   */
  consents: Object.freeze({
    latest: (type: string) => `/consents/latest/${type}`,
    latestContent: (type: string) => `/consents/latest/${type}/content`,
    checkConsent: (docId: number) => `/consents/check/doc/${docId}`,
    giveConsent: (type: string, docId: number) =>
      `/consents/${type}/doc/${docId}`,
  }),

  /**
   * Analytics related endpoints
   */
  analytics: Object.freeze({
    all: "/analytics",
    reports: "/analytics/reports",
  }),

  /**
   * Authentication related endpoints
   */
  auth: Object.freeze({
    me: "/auth/me",
    login: "/auth/login",
    logout: "/auth/logout",
    refresh: "/auth/refresh",
    register: "/auth/register",
    idpAuthorizeUrl: "/auth/idp/authorize-url",
    idpToken: "/auth/idp/token",
  }),

  /**
   * IIR (Integrated Information Record) related endpoints
   */
  iir: Object.freeze({
    lookups: Object.freeze({
      courses: "/students/lookups/courses",
      genders: "/students/lookups/genders",
      religions: "/students/lookups/religions",
      parentalStatusTypes: "/students/lookups/parental-status-types",
      enrollmentReasons: "/students/lookups/enrollment-reasons",
      incomeRanges: "/students/lookups/income-ranges",
      studentSupportTypes: "/students/lookups/support-types",
      siblingSupportTypes: "/students/lookups/support-types/siblings",
      civilStatuses: "/students/lookups/civil-statuses",
      natureOfResidenceTypes: "/students/lookups/nature-of-residence-types",
      studentRelationshipTypes: "/students/lookups/student-relationship-types",
      activityOptions: "/students/lookups/activity-options",
    }),
    inventory: Object.freeze({
      all: "/students/inventory/records",
      byUserId: (userId: string) =>
        `/students/inventory/records/user/${userId}`,
      byIirId: (iirId: string) => `/students/inventory/records/iir/${iirId}`,
      profile: (iirId: string) =>
        `/students/inventory/records/iir/${iirId}/profile`,
      enrollmentReasons: (iirId: string) =>
        `/students/inventory/records/iir/${iirId}/enrollment-reasons`,
      personalInfo: (iirId: string) =>
        `/students/inventory/records/iir/${iirId}/personal-info`,
      addresses: (iirId: string) =>
        `/students/inventory/records/iir/${iirId}/addresses`,
      familyBackground: (iirId: string) =>
        `/students/inventory/records/iir/${iirId}/family-background`,
      relatedPersons: (iirId: string) =>
        `/students/inventory/records/iir/${iirId}/related-persons`,
      education: (iirId: string) =>
        `/students/inventory/records/iir/${iirId}/education`,
      finance: (iirId: string) =>
        `/students/inventory/records/iir/${iirId}/finance`,
      health: (iirId: string) =>
        `/students/inventory/records/iir/${iirId}/health`,
      consultations: (iirId: string) =>
        `/students/inventory/records/iir/${iirId}/consultations`,
      activities: (iirId: string) =>
        `/students/inventory/records/iir/${iirId}/activities`,
      subjectPreferences: (iirId: string) =>
        `/students/inventory/records/iir/${iirId}/subject-preferences`,
      hobbies: (iirId: string) =>
        `/students/inventory/records/iir/${iirId}/hobbies`,
      testResults: (iirId: string) =>
        `/students/inventory/records/iir/${iirId}/test-results`,
      significantNotes: (iirId: string) =>
        `/students/inventory/records/iir/${iirId}/significant-notes`,
    }),
    draft: Object.freeze({
      save: "/students/inventory/records/iir/draft",
      submit: "/students/inventory/records/iir/draft",
    }),
    submit: "/students/inventory/records/iir",
    checkOnboarding: (userId: string) => `/students/record/${userId}`,
  }),
  /**
   * Superadmin related endpoints
   */
  superadmin: Object.freeze({
    apiKeys: Object.freeze({
      list: "/api-keys",
      create: "/api-keys",
      revoke: (id: number) => `/api-keys/${id}`,
    }),
    logs: Object.freeze({
      security: "/system-logs/security",
      system: "/system-logs/system",
      audit: "/system-logs/audit",
      stats: "/system-logs/stats",
    }),
  }),
});
