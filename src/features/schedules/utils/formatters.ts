/**
 * Utility functions for date formatting and status styling
 */

/**
 * Format a date string or Date object to a readable format
 * @param date - ISO date string or Date object
 * @returns Formatted date string (e.g., "January 5, 2026")
 */
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Format time string to HH:MM format
 * @param timeStr - Time string (e.g., "14:30:00")
 * @returns Formatted time (e.g., "14:30")
 */
export const formatTime = (timeStr: string): string => {
  return timeStr.substring(0, 5);
};

/**
 * Get the Tailwind CSS classes for appointment status badge
 * @param status - Appointment status (Pending, Approved, Completed, Cancelled, Rescheduled)
 * @returns Tailwind CSS class string
 */
export const getStatusColor = (status: string): string => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "Approved":
      return "bg-blue-100 text-blue-800";
    case "Completed":
      return "bg-green-100 text-green-800";
    case "Cancelled":
      return "bg-red-100 text-red-800";
    case "Rescheduled":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
