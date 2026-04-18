/**
 * Form helper utilities for IIR Form
 * Extracted from IIRForm component for better maintainability
 */

import { IIRForm } from "../../types";

/**
 * Updates a nested field in the form data immutably
 * @param formData - Current form data
 * @param path - Array of keys representing the path to the field
 * @param value - New value to set
 * @returns Updated form data
 */
export function updateNestedField(
  formData: IIRForm | null,
  path: string[],
  value: any,
): IIRForm | null {
  if (!formData) return formData;

  let current = formData as any;
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    const nextKey = path[i + 1];

    // Check if next key is a numeric string (array index)
    if (!isNaN(Number(nextKey))) {
      // Keep arrays as arrays
      current[key] = Array.isArray(current[key])
        ? [...current[key]]
        : current[key];
    } else {
      // Next key is a string property — always spread as object
      // Using [...array] would lose non-numeric string properties (e.g. relatedPersons.father)
      current[key] = { ...current[key] };
    }
    current = current[key];
  }
  current[path[path.length - 1]] = value;
  return { ...formData };
}

/**
 * Checks if a field value is filled
 * @param val - Value to check
 * @returns True if field is filled
 */
export function countFilledField(val: any): boolean {
  if (val === null || val === undefined || val === "") return false;
  if (typeof val === "object") {
    if (Array.isArray(val)) return val.length > 0;
    // For objects, check if they have an id (indicating it's been selected)
    return val?.id !== undefined && val?.id !== null && val?.id !== "";
  }
  return true;
}

/**
 * Gets the overall completion percentage across all sections
 * @param formData - Current form data
 * @param sectionCount - Total number of sections
 * @param calculateSectionCompletion - Function to calculate individual section completion
 * @returns Overall completion percentage (0-100)
 */
export function getOverallCompletion(
  formData: IIRForm | null,
  sectionCount: number,
  calculateSectionCompletion: (sectionIndex: number) => number,
): number {
  let totalPercentage = 0;
  for (let i = 1; i <= sectionCount; i++) {
    totalPercentage += calculateSectionCompletion(i);
  }
  return Math.round(totalPercentage / sectionCount);
}

/**
 * Gets the status of a section based on completion percentage
 * @param sectionIndex - Section index (1-based)
 * @param calculateSectionCompletion - Function to calculate section completion
 * @returns Section status: 'complete', 'partial', or 'empty'
 */
export function getSectionStatus(
  sectionIndex: number,
  calculateSectionCompletion: (sectionIndex: number) => number,
): "complete" | "partial" | "empty" {
  const percentage = calculateSectionCompletion(sectionIndex);
  if (percentage === 100) return "complete";
  if (percentage > 0) return "partial";
  return "empty";
}

/**
 * Creates a reset form data object preserving basic info
 * @param emptyForm - Empty form template
 * @param me - Current user data
 * @returns Reset form data with preserved basic info
 */
export function createResetFormData(emptyForm: IIRForm, me: any): IIRForm {
  return {
    ...emptyForm,
    student: {
      ...emptyForm.student,
      basicInfo: {
        firstName: me?.firstName || "",
        middleName:
          me?.middleName && typeof me?.middleName === "string"
            ? me?.middleName
            : "",
        lastName: me?.lastName || "",
        email: me?.email || "",
      },
    },
  };
}

/**
 * Initializes form data from draft or empty template
 * @param draft - Draft data from API
 * @param emptyForm - Empty form template
 * @param me - Current user data
 * @returns Initialized form data
 */
export function initializeFormData(
  draft: IIRForm | null,
  emptyForm: IIRForm,
  me: any,
): IIRForm {
  const baseData = draft || emptyForm;

  return {
    ...baseData,
    student: {
      ...baseData.student,
      basicInfo: {
        ...baseData.student?.basicInfo,
        firstName: me?.firstName || "",
        middleName:
          me?.middleName && typeof me?.middleName === "string"
            ? me?.middleName
            : "",
        lastName: me?.lastName || "",
        email: me?.email || "",
      },
      personalInfo: {
        ...baseData.student?.personalInfo,
      },
      addresses: baseData.student?.addresses || {},
    },
    education: baseData.education || { schools: [] },
    family: baseData.family || {
      background: {},
      relatedPersons: [],
      finance: {},
    },
    health: baseData.health || { healthRecord: {}, consultations: [] },
    interests: baseData.interests || {},
  };
}
