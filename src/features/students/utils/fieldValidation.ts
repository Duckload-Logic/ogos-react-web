/**
 * Field Validation Utilities
 * Centralized validation functions used across StudentForm
 */

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9\s\-\+\(\)]+$/;
  return phone.length >= 7 && phoneRegex.test(phone);
};

export const validateNumber = (
  value: string,
  min?: number,
  max?: number,
): boolean => {
  if (value === "") return true;
  const num = parseInt(value, 10);
  if (isNaN(num)) return false;
  if (min !== undefined && num < min) return false;
  if (max !== undefined && num > max) return false;
  return true;
};

export const validateYear = (year: string): boolean => {
  if (year === "") return true;
  const y = parseInt(year, 10);
  const currentYear = new Date().getFullYear();
  return !isNaN(y) && y >= 1950 && y <= currentYear + 1;
};

export const validateDate = (date: string): boolean => {
  if (date === "") return true;
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
};

export const validateHeight = (height: string): boolean => {
  if (height === "") return true;
  const h = parseFloat(height);
  return !isNaN(h) && h >= 3 && h <= 8;
};

export const validateWeight = (weight: string): boolean => {
  if (weight === "") return true;
  const w = parseInt(weight, 10);
  return !isNaN(w) && w >= 20 && w <= 300;
};

export const validateGrade = (grade: string): boolean => {
  if (grade === "") return true;
  const g = parseFloat(grade);
  return !isNaN(g) && g >= 0 && g <= 100;
};

export const validateRequired = (value: string | boolean): boolean => {
  if (typeof value === "boolean") return true;
  return value.trim().length > 0;
};

export const validateAge = (age: string): boolean => {
  return validateNumber(age, 10, 100);
};

export const validateNonNegative = (value: string): boolean => {
  if (value === "") return true;
  const num = parseInt(value, 10);
  if (isNaN(num)) return false;
  return num >= 0;
};
