/**
 * Dynamic validation schema system
 * Defines validation rules for forms without hardcoding them
 */

export type ValidationRule = {
  type?: string;
  validate: (value: any, rootData?: any) => boolean;
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
    type: "required",
    validate: (value: any) => {
      if (typeof value === "string") {
        return value?.trim().length > 0;
      }
      if (typeof value === "object" && value !== null) {
        return (
          (value.id !== undefined && value.id !== null && value.id !== "") ||
          (value.code !== undefined && value.code !== null && value.code !== "")
        );
      }
      return value !== undefined && value !== null && value !== "";
    },
    message: `${fieldName} is required`,
  }),

  email: (): ValidationRule => ({
    validate: (value: any) => {
      if (value === undefined || value === null || value === "") return true;
      if (typeof value !== "string") return false;
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    },
    message: "Enter a valid email address",
  }),

  minLength: (length: number): ValidationRule => ({
    validate: (value: any) => {
      if (value === undefined || value === null || value === "") return true;
      return String(value).trim().length >= length;
    },
    message: `Must be at least ${length} characters`,
  }),

  maxLength: (length: number): ValidationRule => ({
    validate: (value: any) => {
      if (value === undefined || value === null || value === "") return true;
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

  decimalPlaces: (maxDecimalPlaces: number): ValidationRule => ({
    validate: (value: any) => {
      if (value === "" || value === null || value === undefined) return true;
      
      const stringValue = String(value);
      if (!stringValue.includes(".")) return true;

      const parts = stringValue.split(".");
      return parts[1] ? parts[1].length <= maxDecimalPlaces : true;
    },
    message: `Must have at most ${maxDecimalPlaces} decimal places`,
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
      if (value === undefined || value === null || value === "") return true;
      return /^(09|\+639)\d{9}$/.test(String(value));
    },
    message: "Must be a valid Philippine mobile number (e.g. 09XXXXXXXXX)",
  }),

  telephone: (): ValidationRule => ({
    validate: (value: any) => {
      if (value === undefined || value === null || value === "") return true;
      const clean = String(value).replace(/[\s\-\(\)]/g, '');
      return /^(\+63|0)(2[3578]\d{7}|[3-9]\d{1,2}\d{7})$/.test(clean);
    },
    message: "Must be a valid Philippine telephone number (e.g. 02XXXXXXXXX or 09XXXXXXXXX)",
  }),

  nameFormat: (): ValidationRule => ({
    validate: (value: any) => {
      if (value === undefined || value === null || value === "") return true;
      return /^[a-zA-Z\s\-\.]+$/.test(String(value));
    },
    message: "Must contain only letters, spaces, hyphens, or periods",
  }),

  studentNumber: (): ValidationRule => ({
    validate: (value: any) => {
      if (value === undefined || value === null || value === "") return true;
      return /^\d{4}-\d{5}-TG-[01]$/.test(String(value));
    },
    message: "Format must be YYYY-XXXXX-TG-0 or YYYY-XXXXX-TG-1",
  }),

  suffixFormat: (): ValidationRule => ({
    validate: (value: any) => {
      if (value === undefined || value === null || value === "") return true;
      return /^(Jr\.|Sr\.|I|II|III|IV|V|VI|VII|VIII|IX|X)$/i.test(String(value).trim());
    },
    message: "Invalid suffix. Allowed: Jr., Sr., or Roman Numerals (I, II, III, etc.)",
  }),

  complexionFormat: (): ValidationRule => ({
    validate: (value: any) => {
      if (value === undefined || value === null || value === "") return true;
      return /^(Very Fair|Fair|Medium|Olive|Brown|Black)$/i.test(String(value).trim());
    },
    message: "Invalid complexion. Allowed: Very Fair, Fair, Medium, Olive, Brown, or Black",
  }),

  siblingCount: (brothersField: string, sistersField: string): ValidationRule => ({
    validate: (value: any, rootData: any) => {
      if (value === "" || value === null || value === undefined) return true;
      const brothers = Number(getValueByPath(rootData, brothersField)) || 0;
      const sisters = Number(getValueByPath(rootData, sistersField)) || 0;
      return Number(value) <= brothers + sisters;
    },
    message: "Employed siblings cannot exceed total number of siblings",
  }),

  ordinalPosition: (brothersField: string, sistersField: string): ValidationRule => ({
    validate: (value: any, rootData: any) => {
      if (value === "" || value === null || value === undefined) return true;
      const brothers = Number(getValueByPath(rootData, brothersField)) || 0;
      const sisters = Number(getValueByPath(rootData, sistersField)) || 0;
      return Number(value) <= brothers + sisters + 1;
    },
    message: "Ordinal position cannot exceed total children (siblings + 1)",
  }),

  pattern: (pattern: RegExp, message: string): ValidationRule => ({
    validate: (value: any) => {
      if (value === undefined || value === null || value === "") return true;
      return pattern.test(String(value));
    },
    message,
  }),

  noSpecialChars: (fieldName: string = "This field"): ValidationRule => ({
    validate: (value: any) => {
      if (value === undefined || value === null || value === "") return true;
      // Reusing the logic: false if it HAS special characters
      return !/[^a-zA-Z0-9\s.-]/.test(String(value));
    },
    message: `${fieldName} cannot contain special characters`,
  }),
};

/**
 * Validates a single field against its rules
 */
export const validateField = (
  value: any,
  rules: ValidationRule[],
  rootData?: any,
): string | null => {
  for (const rule of rules) {
    try {
      if (!rule.validate(value, rootData)) {
        return rule.message;
      }
    } catch (error) {
      console.error(`[ValidationSystem] Error in rule validate:`, {
        ruleType: rule.type || 'unknown',
        value,
        error
      });
      // Return null on internal error to avoid blocking the user/crashing
      return null;
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
    const error = validateField(value, rules, data);
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
export const getValueByPath = (obj: any, path: string): any => {
  return path.split(".").reduce((current, part) => current?.[part], obj);
};

/**
 * Checks if a specific field has the 'required' rule in the schema.
 */
export const isFieldRequired = (
  schema: FieldValidationSchema,
  fieldPath: string,
): boolean => {
  const rules = schema[fieldPath];
  if (!rules) return false;
  return rules.some((rule) => rule.type === "required");
};

