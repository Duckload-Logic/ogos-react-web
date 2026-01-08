/**
 * useFormState Hook
 * Manages form state with proper type safety
 */

import { useState, useCallback } from "react";

export interface FormState<T> {
  data: T;
  isDirty: boolean;
  isTouched: Record<keyof T, boolean>;
}

export interface UseFormStateReturn<T> {
  formState: FormState<T>;
  setFieldValue: (field: keyof T, value: unknown) => void;
  setFieldTouched: (field: keyof T, touched?: boolean) => void;
  resetForm: () => void;
  setFormData: (data: T) => void;
}

/**
 * useFormState - Manages form state with dirty tracking and field touch state
 * @param initialData - Initial form data
 * @returns Form state management methods
 */
export const useFormState = <T extends Record<string, unknown>>(
  initialData: T
): UseFormStateReturn<T> => {
  const [formState, setFormState] = useState<FormState<T>>({
    data: initialData,
    isDirty: false,
    isTouched: {} as Record<keyof T, boolean>,
  });

  const setFieldValue = useCallback(
    (field: keyof T, value: unknown) => {
      setFormState((prev) => ({
        ...prev,
        data: {
          ...prev.data,
          [field]: value,
        },
        isDirty: true,
      }));
    },
    []
  );

  const setFieldTouched = useCallback(
    (field: keyof T, touched = true) => {
      setFormState((prev) => ({
        ...prev,
        isTouched: {
          ...prev.isTouched,
          [field]: touched,
        },
      }));
    },
    []
  );

  const resetForm = useCallback(() => {
    setFormState({
      data: initialData,
      isDirty: false,
      isTouched: {} as Record<keyof T, boolean>,
    });
  }, [initialData]);

  const setFormData = useCallback((data: T) => {
    setFormState((prev) => ({
      ...prev,
      data,
      isDirty: true,
    }));
  }, []);

  return {
    formState,
    setFieldValue,
    setFieldTouched,
    resetForm,
    setFormData,
  };
};
