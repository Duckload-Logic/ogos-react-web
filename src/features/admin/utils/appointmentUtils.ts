/**
 * Appointment Utilities
 * Helper functions for appointment management
 */

import { Appointment } from "@/features/appointments/services";

/**
 * Format appointment date for display
 * @param dateString - ISO date string
 * @returns Formatted date (e.g., "Jan 15, 2025")
 */
export const formatAppointmentDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
};

/**
 * Format appointment time for display
 * @param timeString - Time string (HH:MM format)
 * @returns Formatted time (e.g., "2:30 PM")
 */
export const formatAppointmentTime = (timeString: string): string => {
  try {
    const [hours, minutes] = timeString.split(":");
    const date = new Date(0, 0, 0, parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return timeString;
  }
};

/**
 * Get status badge color
 * @param status - Appointment status
 * @returns Tailwind CSS classes for the status badge
 */
export const getStatusBadgeColor = (
  status: string
): { bg: string; text: string } => {
  switch (status) {
    case "Pending":
      return { bg: "bg-yellow-100", text: "text-yellow-800" };
    case "Approved":
      return { bg: "bg-green-100", text: "text-green-800" };
    case "Completed":
      return { bg: "bg-blue-100", text: "text-blue-800" };
    case "Cancelled":
      return { bg: "bg-red-100", text: "text-red-800" };
    case "Rescheduled":
      return { bg: "bg-purple-100", text: "text-purple-800" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-800" };
  }
};

/**
 * Get available status transitions based on current status
 * @param currentStatus - Current appointment status
 * @returns Array of available status transitions
 */
export const getAvailableStatusTransitions = (
  currentStatus: string
): Array<{ status: string; label: string; color: string }> => {
  switch (currentStatus) {
    case "Pending":
      return [
        { status: "Approved", label: "Approve", color: "bg-green-500" },
        { status: "Cancelled", label: "Reject", color: "bg-red-500" },
      ];
    case "Approved":
      return [
        { status: "Completed", label: "Mark as Completed", color: "bg-blue-500" },
        { status: "Cancelled", label: "Cancel", color: "bg-red-500" },
      ];
    case "Rescheduled":
      return [
        { status: "Approved", label: "Approve", color: "bg-green-500" },
        { status: "Cancelled", label: "Reject", color: "bg-red-500" },
      ];
    default:
      return [];
  }
};

/**
 * Check if appointment can be rescheduled
 * @param appointment - Appointment object
 * @returns Boolean indicating if appointment can be rescheduled
 */
export const canRescheduleAppointment = (appointment: Appointment): boolean => {
  return ["Pending", "Approved", "Rescheduled"].includes(appointment.status);
};

/**
 * Check if appointment can be cancelled
 * @param appointment - Appointment object
 * @returns Boolean indicating if appointment can be cancelled
 */
export const canCancelAppointment = (appointment: Appointment): boolean => {
  return ["Pending", "Approved", "Rescheduled"].includes(appointment.status);
};

/**
 * Get time until appointment
 * @param appointment - Appointment object
 * @returns Human-readable string (e.g., "in 2 hours")
 */
export const getTimeUntilAppointment = (appointment: Appointment): string => {
  try {
    const appointmentDateTime = new Date(
      `${appointment.scheduledDate}T${appointment.scheduledTime}`
    );
    const now = new Date();
    const diffMs = appointmentDateTime.getTime() - now.getTime();

    if (diffMs < 0) {
      return "Past due";
    }

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `in ${diffDays} day${diffDays > 1 ? "s" : ""}`;
    }

    if (diffHours > 0) {
      return `in ${diffHours} hour${diffHours > 1 ? "s" : ""}`;
    }

    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return `in ${diffMinutes} minute${diffMinutes > 1 ? "s" : ""}`;
  } catch {
    return "Unknown";
  }
};

/**
 * Sort appointments by date and time
 * @param appointments - Array of appointments
 * @param ascending - Sort in ascending order (default: true)
 * @returns Sorted appointments
 */
export const sortAppointments = (
  appointments: Appointment[],
  ascending: boolean = true
): Appointment[] => {
  return [...appointments].sort((a, b) => {
    const dateA = new Date(`${a.scheduledDate}T${a.scheduledTime}`).getTime();
    const dateB = new Date(`${b.scheduledDate}T${b.scheduledTime}`).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

/**
 * Group appointments by status
 * @param appointments - Array of appointments
 * @returns Object with appointments grouped by status
 */
export const groupAppointmentsByStatus = (
  appointments: Appointment[]
): Record<string, Appointment[]> => {
  return appointments.reduce(
    (acc, appointment) => {
      const status = appointment.status;
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(appointment);
      return acc;
    },
    {} as Record<string, Appointment[]>
  );
};
