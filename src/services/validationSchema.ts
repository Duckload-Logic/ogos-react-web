/**
 * Dynamic validation schema system
 * Defines validation rules for forms without hardcoding them
 */

export type ValidationRule = {
  validate: (value: any) => boolean;
  message: string;
};

export type FieldValidationSchema = {
  [fieldPath: string]: ValidationRule[];
};

/**
 * Common validation rules that can be reused
 */
export const commonRules = {
  required: (fieldName: string = "This field"): ValidationRule => ({
    validate: (value: any) => {
      if (typeof value === "string") {
        return value?.trim().length > 0;
      }
      if (typeof value === "object" && value !== null) {
        return value.id !== undefined && value.id !== null && value.id !== 0 && value.id !== "";
      }
      return value !== undefined && value !== null && Boolean(value);
    },
    message: `${fieldName} is required`,
  }),

  email: (): ValidationRule => ({
    validate: (value: any) => {
      if (!value || typeof value !== "string") return true;
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    },
    message: "Enter a valid email address",
  }),

  minLength: (length: number): ValidationRule => ({
    validate: (value: any) => {
      if (!value) return true;
      return String(value).trim().length >= length;
    },
    message: `Must be at least ${length} characters`,
  }),

  maxLength: (length: number): ValidationRule => ({
    validate: (value: any) => {
      if (!value) return true;
      return String(value).length <= length;
    },
    message: `Cannot exceed ${length} characters`,
  }),

  minValue: (min: number): ValidationRule => ({
    validate: (value: any) => {
      if (value === "" || value === null || value === undefined) return true;
      return Number(value) >= min;
    },
    message: `Must be at least ${min}`,
  }),

  maxValue: (max: number): ValidationRule => ({
    validate: (value: any) => {
      if (value === "" || value === null || value === undefined) return true;
      return Number(value) <= max;
    },
    message: `Cannot exceed ${max}`,
  }),

  numeric: (): ValidationRule => ({
    validate: (value: any) => {
      if (value === "" || value === null || value === undefined) return true;
      return !isNaN(Number(value));
    },
    message: "Must be a valid number",
  }),

  positiveNumber: (): ValidationRule => ({
    validate: (value: any) => {
      if (value === "" || value === null || value === undefined) return true;
      const n = Number(value);
      return !isNaN(n) && n > 0;
    },
    message: "Must be a positive number",
  }),

  positiveInteger: (): ValidationRule => ({
    validate: (value: any) => {
      if (value === "" || value === null || value === undefined) return true;
      const n = Number(value);
      return !isNaN(n) && Number.isInteger(n) && n > 0;
    },
    message: "Must be a positive whole number",
  }),

  year: (): ValidationRule => {
    const currentYear = new Date().getFullYear();
    return {
      validate: (value: any) => {
        if (value === "" || value === null || value === undefined) return true;
        const n = Number(value);
        return !isNaN(n) && Number.isInteger(n) && n >= 1900 && n <= currentYear;
      },
      message: `Must be a valid year between 1900 and ${new Date().getFullYear()}`,
    };
  },

  validDate: (): ValidationRule => {
    const currentYear = new Date().getFullYear();
    return {
      validate: (value: any) => {
        if (!value || typeof value !== "string") return true;
        const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
        if (!match) return false;
        const year = parseInt(match[1], 10);
        const month = parseInt(match[2], 10);
        const day = parseInt(match[3], 10);
        if (year < 1900 || year > currentYear || month < 1 || month > 12 || day < 1 || day > 31) return false;
        const d = new Date(year, month - 1, day);
        return d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day;
      },
      message: `Must be a valid date (year between 1900 and ${new Date().getFullYear()})`,
    };
  },

  phone: (): ValidationRule => ({
    validate: (value: any) => {
      if (!value) return true;
      return /^09\d{9}$/.test(String(value));
    },
    message: "Must be a valid Philippine mobile number (09XXXXXXXXX, 11 digits)",
  }),

  pattern: (pattern: RegExp, message: string): ValidationRule => ({
    validate: (value: any) => {
      if (!value) return true;
      return pattern.test(String(value));
    },
    message,
  }),
};

/**
 * Validates a single field against its rules
 */
export const validateField = (
  value: any,
  rules: ValidationRule[],
): string | null => {
  for (const rule of rules) {
    if (!rule.validate(value)) {
      return rule.message;
    }
  }
  return null;
};

/**
 * Validates all fields in an object against a schema
 */
export const validateObject = (
  data: any,
  schema: FieldValidationSchema,
): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};

  Object.entries(schema).forEach(([fieldPath, rules]) => {
    const value = getValueByPath(data, fieldPath);
    const error = validateField(value, rules);
    if (error) {
      errors[fieldPath] = error;
    }
  });

  return errors;
};

/**
 * Helper function to get nested object values by path
 * e.g., "student.basicInfo.firstName" -> data.student.basicInfo.firstName
 */
const getValueByPath = (obj: any, path: string): any => {
  return path.split(".").reduce((current, part) => current?.[part], obj);
};
