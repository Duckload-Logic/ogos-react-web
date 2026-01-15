/**
 * useAdminAppointments Hook
 * Manages appointment operations for admin panel with enhanced state management
 */

import { useState, useCallback } from "react";
import * as appointmentService from "@/features/appointments/services";
import {
  Appointment,
  AppointmentFilters,
  CreateAppointmentRequest,
  APPOINTMENT_STATUSES,
} from "@/features/appointments/services";

export interface UseAdminAppointmentsReturn {
  appointments: Appointment[];
  isLoading: boolean;
  error: string | null;
  success: string | null;
  fetchAppointments: (filters?: AppointmentFilters) => Promise<void>;
  fetchStudentAppointments: (studentId: number) => Promise<void>;
  updateStatus: (id: number, status: string) => Promise<void>;
  approveAppointment: (id: number) => Promise<void>;
  rejectAppointment: (id: number) => Promise<void>;
  completeAppointment: (id: number) => Promise<void>;
  rescheduleAppointment: (id: number, payload: CreateAppointmentRequest) => Promise<void>;
  clearError: () => void;
  clearSuccess: () => void;
  reset: () => void;
}

/**
 * useAdminAppointments - Manages appointment operations for admin
 */
export const useAdminAppointments = (): UseAdminAppointmentsReturn => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);
  const clearSuccess = useCallback(() => setSuccess(null), []);

  const fetchAppointments = useCallback(
    async (filters?: AppointmentFilters) => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await appointmentService.listAllAppointments(filters);
        setAppointments(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch appointments";
        setError(errorMessage);
        console.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const fetchStudentAppointments = useCallback(async (studentId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await appointmentService.getStudentAppointments(studentId);
      setAppointments(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : `Failed to fetch appointments for student ${studentId}`;
      setError(errorMessage);
      console.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateStatus = useCallback(async (id: number, status: string) => {
    setError(null);
    try {
      const updatedAppointment = await appointmentService.updateAppointmentStatus(id, status);
      setSuccess(`Appointment ${status.toLowerCase()} successfully`);
      // Update local state with the full updated appointment
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === id ? updatedAppointment : apt
        )
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : `Failed to update appointment status`;
      setError(errorMessage);
      console.error(errorMessage);
    }
  }, []);

  const approveAppointment = useCallback(async (id: number) => {
    await updateStatus(id, APPOINTMENT_STATUSES.APPROVED);
  }, [updateStatus]);

  const rejectAppointment = useCallback(async (id: number) => {
    await updateStatus(id, APPOINTMENT_STATUSES.CANCELLED);
  }, [updateStatus]);

  const completeAppointment = useCallback(async (id: number) => {
    await updateStatus(id, APPOINTMENT_STATUSES.COMPLETED);
  }, [updateStatus]);

  const rescheduleAppointment = useCallback(
    async (id: number, payload: CreateAppointmentRequest) => {
      setError(null);
      try {
        const updatedAppointment = await appointmentService.rescheduleAppointment(
          id,
          payload
        );
        setSuccess("Appointment rescheduled successfully");
        // Update local state with the updated appointment
        setAppointments((prev) =>
          prev.map((apt) =>
            apt.id === id ? updatedAppointment : apt
          )
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to reschedule appointment";
        setError(errorMessage);
        console.error(errorMessage);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setAppointments([]);
    setIsLoading(false);
    setError(null);
    setSuccess(null);
  }, []);

  return {
    appointments,
    isLoading,
    error,
    success,
    fetchAppointments,
    fetchStudentAppointments,
    updateStatus,
    approveAppointment,
    rejectAppointment,
    completeAppointment,
    rescheduleAppointment,
    clearError,
    clearSuccess,
    reset,
  };
};
