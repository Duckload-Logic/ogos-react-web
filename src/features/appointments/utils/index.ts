/**
 * Appointment Feature Utilities
 * 
 * Helper functions used only within the appointments feature.
 */

/**
 * Convert a Date object to a string in YYYY-MM-DD format
 * 
 * @param date - The date to convert
 * @returns Formatted date string (YYYY-MM-DD)
 */
export const mapDateToString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Format available slots API response into TimeSlot array
 * Handles both array and object response formats
 * 
 * @param data - Raw data from the API (could be array or object)
 * @returns Formatted TimeSlot array
 */
export const formatAvailableSlots = (data: any) => {
  return Array.isArray(data)
    ? data
    : Object.entries(data).map(([startTime, booked], index) => ({
        slotId: index + 1,
        startTime,
        isNotTaken: booked as boolean,
      }));
};

/**
 * Extract error message from API error response
 * 
 * @param error - The error object from API call
 * @param fallbackMessage - Default message if error parsing fails
 * @returns Formatted error message
 */
export const extractErrorMessage = (error: any, fallbackMessage: string): string => {
  if (error?.response?.data?.error) {
    return error.response.data.error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallbackMessage;
};

/**
 * Validate appointment form input
 * 
 * @param selectedDate - Selected appointment date
 * @param selectedTime - Selected appointment time
 * @param reason - Appointment reason/description
 * @returns Validation error message or null if valid
 */
export const validateAppointmentForm = (
  selectedDate: Date | undefined,
  selectedTime: string,
  reason: string,
): string | null => {
  if (!selectedDate) {
    return 'Please select a date';
  }
  if (!selectedTime) {
    return 'Please select a time';
  }
  if (!reason.trim()) {
    return 'Please provide a reason for your appointment';
  }
  if (reason.length < 10) {
    return 'Reason must be at least 10 characters long';
  }
  return null;
};
