import { useState, useCallback } from "react";

/**
 * Hook to manage touched state for form fields
 * A field is "touched" when the user has interacted with it (blur event)
 * or when form submission is attempted
 */
export function useTouchedState() {
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {},
  );
  const [isSubmitted, setIsSubmitted] = useState(false);

  /**
   * Mark a specific field as touched
   */
  const markFieldTouched = useCallback((fieldPath: string) => {
    setTouchedFields((prev) => ({
      ...prev,
      [fieldPath]: true,
    }));
  }, []);

  /**
   * Mark all fields as touched (called on form submission)
   */
  const markAllTouched = useCallback(() => {
    setIsSubmitted(true);
  }, []);

  /**
   * Check if an error should be shown for a field
   * Error is shown if: field is touched OR form has been submitted
   */
  const shouldShowError = useCallback(
    (fieldPath: string): boolean => {
      return touchedFields[fieldPath] === true || isSubmitted;
    },
    [touchedFields, isSubmitted],
  );

  /**
   * Reset all touched state (called on form reset)
   */
  const resetTouched = useCallback(() => {
    setTouchedFields({});
    setIsSubmitted(false);
  }, []);

  /**
   * Clear touched state for specific field
   */
  const clearFieldTouched = useCallback((fieldPath: string) => {
    setTouchedFields((prev) => {
      const updated = { ...prev };
      delete updated[fieldPath];
      return updated;
    });
  }, []);

  return {
    touchedFields,
    isSubmitted,
    markFieldTouched,
    markAllTouched,
    shouldShowError,
    resetTouched,
    clearFieldTouched,
  };
}
