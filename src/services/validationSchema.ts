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
        return value.id !== undefined && value.id !== null && value.id !== 0;
      }
      return Boolean(value);
    },
    message: `${fieldName} is required`,
  }),

  email: (): ValidationRule => ({
    validate: (value: any) => {
      if (!value || typeof value !== "string") return true; // Optional if not provided
      return value.includes("@");
    },
    message: "Email format is invalid",
  }),

  minLength: (length: number): ValidationRule => ({
    validate: (value: any) => {
      if (!value) return true;
      return String(value).length >= length;
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
      if (value === "" || value === null) return true;
      return Number(value) >= min;
    },
    message: `Must be at least ${min}`,
  }),

  maxValue: (max: number): ValidationRule => ({
    validate: (value: any) => {
      if (value === "" || value === null) return true;
      return Number(value) <= max;
    },
    message: `Cannot exceed ${max}`,
  }),

  numeric: (): ValidationRule => ({
    validate: (value: any) => {
      if (!value) return true;
      return !isNaN(Number(value));
    },
    message: "Must be a valid number",
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
