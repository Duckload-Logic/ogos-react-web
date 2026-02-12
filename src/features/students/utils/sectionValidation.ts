/**
 * Section-Level Validation Utilities
 * Validates entire form sections and returns error objects
 */

import { FormData } from '@/types';
import { validateYear, validateEmail, validatePhone, validateNonNegative } from './fieldValidation';

interface FormErrors {
  [key: string]: string;
}

/**
 * Validate enrollment reasons section
 */
export const validateEnrollmentReasonsSection = (
  formData: FormData,
  setErrors: (errors: FormErrors) => void,
): boolean => {
  const selectedReasons = Object.entries(formData.reasonForEnrollment || {})
    .filter(([_, value]) => value === true);

  if (selectedReasons.length === 0 && !formData.reasonOther?.trim()) {
    setErrors({
      reasonForEnrollment: "Please select at least one reason for enrollment."
    });
    return false;
  }

  return true;
};

/**
 * Validate personal information section
 */
export const validatePersonalSection = (
  formData: FormData,
  setErrors: (errors: FormErrors) => void,
): boolean => {
  const errors: FormErrors = {};

  if (!formData.firstName.trim()) {
    errors.firstName = "First name is required";
  }
  if (!formData.email.trim()) {
    errors.email = "Email is required";
  } else if (!validateEmail(formData.email)) {
    errors.email = "Invalid email address";
  }
  if (!formData.mobileNo.trim()) {
    errors.mobileNo = "Mobile number is required";
  } else if (!validatePhone(formData.mobileNo)) {
    errors.mobileNo = "Invalid phone number";
  }

  if (Object.keys(errors).length > 0) {
    setErrors(errors);
    return false;
  }

  return true;
};

/**
 * Validate education section
 */
export const validateEducationSection = (
  formData: FormData,
  setErrors: (errors: FormErrors) => void,
): boolean => {
  const errors: FormErrors = {};

  [
    { key: "elementary", label: "Elementary" },
    { key: "juniorHS", label: "Junior HS" },
    { key: "seniorHS", label: "Senior HS" },
  ].forEach((level) => {
    const levelData = formData.education[level.key as keyof typeof formData.education];
    if (typeof levelData === 'object' && levelData !== null) {
      const edu = levelData as Record<string, any>;
      if (edu.school || edu.location || edu.public || edu.yearGrad) {
        if (!edu.school) errors[`${level.key}_school`] = "School name is required";
        if (!edu.location) errors[`${level.key}_location`] = "Location is required";
        if (!edu.public) errors[`${level.key}_public`] = "Public/Private is required";
        if (!edu.yearGrad) errors[`${level.key}_yearGrad`] = "Year graduated is required";
        if (edu.yearGrad && !validateYear(edu.yearGrad)) {
          errors[`${level.key}_yearGrad`] = "Invalid year";
        }
      }
    }
  });

  if (Object.keys(errors).length > 0) {
    setErrors(errors);
    return false;
  }

  return true;
};

/**
 * Validate family background section
 */
export const validateFamilySection = (
  formData: FormData,
  setErrors: (errors: FormErrors) => void,
): boolean => {
  const errors: FormErrors = {};

  if (formData.brothers && !validateNonNegative(formData.brothers)) {
    errors.brothers = "Brothers count cannot be negative";
  }
  if (formData.sisters && !validateNonNegative(formData.sisters)) {
    errors.sisters = "Sisters count cannot be negative";
  }
  if (formData.gainfullyEmployed && !validateNonNegative(formData.gainfullyEmployed)) {
    errors.gainfullyEmployed = "Count cannot be negative";
  }
  if (formData.supportStudies && !validateNonNegative(formData.supportStudies)) {
    errors.supportStudies = "Count cannot be negative";
  }
  if (formData.supportFamily && !validateNonNegative(formData.supportFamily)) {
    errors.supportFamily = "Count cannot be negative";
  }

  if (Object.keys(errors).length > 0) {
    setErrors(errors);
    return false;
  }

  return true;
};
