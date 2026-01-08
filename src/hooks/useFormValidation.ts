/**
 * useFormValidation Hook
 * Handles form validation with debouncing and field-level validation
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { validateFields, validateField, ValidationError } from "@/lib/validation";

export interface UseFormValidationReturn {
  errors: Record<string, string>;
  hasErrors: boolean;
  validateField: (fieldName: string, value: unknown) => ValidationError | null;
  validateFields: (data: Record<string, unknown>) => boolean;
  clearFieldError: (fieldName: string) => void;
  clearAllErrors: () => void;
  setErrors: (errors: Record<string, string>) => void;
}

/**
 * useFormValidation - Manages form validation with debouncing
 * @param requiredFields - Array of required field names
 * @param debounceMs - Debounce delay in milliseconds (default: 300ms)
 * @returns Validation management methods
 */
export const useFormValidation = (
  requiredFields: string[] = [],
  debounceMs = 300
): UseFormValidationReturn => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const debounceTimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const validateSingleField = useCallback(
    (fieldName: string, value: unknown): ValidationError | null => {
      return validateField(fieldName, value);
    },
    []
  );

  const validateAllFields = useCallback(
    (data: Record<string, unknown>): boolean => {
      const validationResult = validateFields(data, requiredFields);

      if (!validationResult.isValid) {
        const errorMap: Record<string, string> = {};
        validationResult.errors.forEach((error) => {
          errorMap[error.field] = error.message;
        });
        setErrors(errorMap);
        return false;
      }

      setErrors({});
      return true;
    },
    [requiredFields]
  );

  const clearFieldError = useCallback((fieldName: string) => {
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[fieldName];
      return updated;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    hasErrors: Object.keys(errors).length > 0,
    validateField: validateSingleField,
    validateFields: validateAllFields,
    clearFieldError,
    clearAllErrors,
    setErrors,
  };
};
