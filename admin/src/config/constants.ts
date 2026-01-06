/**
 * Application Constants
 * Centralized app-wide constants and configuration
 */

// Course options
export const COURSE_OPTIONS = [
  { value: "CS", label: "Computer Science" },
  { value: "ENG", label: "Civil Engineering" },
  { value: "ME", label: "Mechanical Engineering" },
  { value: "ECE", label: "Electronics and Communications Engineering" },
  { value: "CEng", label: "Chemical Engineering" },
] as const;

// Civil Status options
export const CIVIL_STATUS_OPTIONS = [
  "Single",
  "Single Parent",
  "Married",
  "Married but Living Separately",
  "Divorced",
  "Annulled",
  "Widowed",
  "Separated",
] as const;

// Gender options
export const GENDER_OPTIONS = ["Male", "Female"] as const;

// Parental Status options
export const PARENTAL_STATUS_OPTIONS = [
  "Married & Living Together",
  "Married but Living Separately",
  "Divorced",
  "Annulled",
  "Single Parent",
  "Father/Mother working abroad",
  "Deceased, please specify:",
] as const;

// Income ranges
export const INCOME_RANGES = [
  "Below P5,000",
  "P5,001 - P10,000",
  "P10,001 - P15,000",
  "P15,001 - P20,000",
  "P20,001 - P25,000",
  "P25,001 - P30,000",
  "P30,001 - P35,000",
  "P35,001 - P40,000",
  "P40,001 - P45,000",
  "P45,001 - P50,000",
  "Above P50,000",
  "Others, please specify:",
] as const;

// Philippine Provinces
export const PROVINCES = [
  { code: "NCR", name: "Metro Manila" },
  { code: "CAL", name: "Calabarzon" },
  { code: "MIMAROPA", name: "Mimaropa" },
  { code: "ILO", name: "Ilocos Region" },
  { code: "COR", name: "Cordillera" },
  { code: "CAG", name: "Cagayan Valley" },
  { code: "CEN", name: "Central Luzon" },
  { code: "BIC", name: "Bicol" },
  { code: "WV", name: "Western Visayas" },
  { code: "CV", name: "Central Visayas" },
  { code: "EV", name: "Eastern Visayas" },
  { code: "ZBN", name: "Zamboanga Peninsula" },
  { code: "NMD", name: "Northern Mindanao" },
  { code: "DCR", name: "Davao Region" },
  { code: "SOCCSKSARGEN", name: "Soccsksargen" },
] as const;

// Health status options
export const HEALTH_STATUS = ["No problem", "Issue"] as const;

// Excuse Slip status
export const EXCUSE_SLIP_STATUS = ["pending", "approved", "rejected"] as const;

// App config
export const APP_CONFIG = {
  APP_NAME: "PUP Guidance System",
  STUDENT_ID_PREFIX: "PUP",
  FORM_VALIDATION_DEBOUNCE: 300, // ms
  AUTO_SAVE_INTERVAL: 30000, // 30 seconds
} as const;
