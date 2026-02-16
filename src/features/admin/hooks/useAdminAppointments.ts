/**
 * useAdminAppointments
 * Refactored + aligned with existing AuthContext
 */

import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/context";
import * as appointmentService from "@/features/appointments/services";
import {
  Appointment,
  AppointmentFilters,
  CreateAppointmentRequest,
  APPOINTMENT_STATUSES,
} from "@/features/appointments/services";

export const useAdminAppointments = () => {
  const { user, isLoading: authLoading } = useAuth();

  const isAdmin = user?.roleId === 2;

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

/*
 * Guard
 */

  const guardAdmin = () => {
    if (!isAdmin) {
      throw new Error("Unauthorized: Admin access required.");
    }
  };

/* 
 * Async Handler 
 */

  const handleAsync = useCallback(
    async <T>(
      asyncFn: () => Promise<T>,
      options?: {
        loading?: boolean;
        successMessage?: string;
        onSuccess?: (data: T) => void;
      }
    ) => {
      try {
        guardAdmin();

        if (options?.loading) setIsLoading(true);
        setError(null);

        const result = await asyncFn();

        if (options?.onSuccess) options.onSuccess(result);
        if (options?.successMessage) setSuccess(options.successMessage);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Something went wrong";
        setError(message);
      } finally {
        if (options?.loading) setIsLoading(false);
      }
    },
    [isAdmin]
  );

/*
 * Local State Updater 
 */

  const updateLocalAppointment = useCallback((updated: Appointment) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === updated.id ? updated : apt))
    );
  }, []);

/* 
 * Fetch 
 */

  const fetchAppointments = useCallback(
    async (filters?: AppointmentFilters) => {
      await handleAsync(
        () => appointmentService.listAllAppointments(filters),
        {
          loading: true,
          onSuccess: setAppointments,
        }
      );
    },
    [handleAsync]
  );

/*
 * Status Updates
 */

  const updateStatus = useCallback(
    async (id: number, status: string) => {
      await handleAsync(
        () => appointmentService.updateAppointmentStatus(id, status),
        {
          successMessage: `Appointment ${status.toLowerCase()} successfully`,
          onSuccess: updateLocalAppointment,
        }
      );
    },
    [handleAsync, updateLocalAppointment]
  );

  const approveAppointment = (id: number) =>
    updateStatus(id, APPOINTMENT_STATUSES.APPROVED);

  const rejectAppointment = (id: number) =>
    updateStatus(id, APPOINTMENT_STATUSES.CANCELLED);

  const completeAppointment = (id: number) =>
    updateStatus(id, APPOINTMENT_STATUSES.COMPLETED);

/* 
 * Reschedule
 */

  const rescheduleAppointment = useCallback(
    async (id: number, payload: CreateAppointmentRequest) => {
      await handleAsync(
        () => appointmentService.rescheduleAppointment(id, payload),
        {
          successMessage: "Appointment rescheduled successfully",
          onSuccess: updateLocalAppointment,
        }
      );
    },
    [handleAsync, updateLocalAppointment]
  );

  return {
    appointments,
    isLoading,
    error,
    success,
    isAdmin,
    fetchAppointments,
    approveAppointment,
    rejectAppointment,
    completeAppointment,
    rescheduleAppointment,
    clearError: () => setError(null),
    clearSuccess: () => setSuccess(null),
  };
};