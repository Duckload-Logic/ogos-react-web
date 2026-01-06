/**
 * Form Validation Service
 * Provides validation utilities for various form fields
 */

export interface ValidationError {
  field: string;
  message: string;
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phone: string): boolean => {
  // Philippine phone number format
  const phoneRegex = /^(?:\+63|0)?9\d{9}$/;
  return phoneRegex.test(phone.replace(/[\s\-]/g, ""));
};

export const validateDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

export const validateAge = (
  dateString: string,
  minAge: number = 18,
): boolean => {
  const birthDate = new Date(dateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age >= minAge;
};

export const validateRequiredField = (value: any): boolean => {
  if (typeof value === "string") {
    return value.trim().length > 0;
  }
  if (typeof value === "number") {
    return value !== 0;
  }
  return !!value;
};

export const validateNumericField = (value: string): boolean => {
  return /^\d+(\.\d+)?$/.test(value.trim());
};

export const validateAddressCompletion = (
  province: string,
  municipality: string,
  barangay: string,
): boolean => {
  return !!(province && municipality && barangay);
};

export const getErrorMessage = (field: string, type: string): string => {
  const messages: { [key: string]: { [key: string]: string } } = {
    email: {
      invalid: "Please enter a valid email address",
      required: "Email is required",
    },
    phone: {
      invalid: "Please enter a valid Philippine phone number",
      required: "Phone number is required",
    },
    dateOfBirth: {
      invalid: "Please enter a valid date",
      age: "You must be at least 18 years old",
      required: "Date of birth is required",
    },
    address: {
      incomplete: "Please select province, municipality, and barangay",
      required: "Address is required",
    },
  };

  return messages[field]?.[type] || `${field} is invalid`;
};
