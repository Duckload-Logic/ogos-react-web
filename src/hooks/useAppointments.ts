/**
 * useAppointments Hook
 * Manages appointment operations with proper state management
 */

import { useAsyncOperation } from "./useAsyncOperation";
import * as appointmentService from "@/features/appointments/services";
import { Appointment, AppointmentPayload } from "@/features/appointments/services";

export interface UseAppointmentsReturn {
  appointments: Appointment[] | null;
  isLoading: boolean;
  error: string | null;
  fetchAppointments: () => Promise<void>;
  scheduleAppointment: (payload: AppointmentPayload) => Promise<void>;
  cancelAppointment: (id: string) => Promise<void>;
  reset: () => void;
}

/**
 * useAppointments - Manages appointment operations
 */
export const useAppointments = (): UseAppointmentsReturn => {
  const { data, isLoading, error, execute, reset, setData, setError } =
    useAsyncOperation<Appointment[]>();

  const fetchAppointments = async () => {
    await execute(() => appointmentService.listUserAppointments());
  };

  const scheduleAppointment = async (payload: AppointmentPayload) => {
    try {
      await appointmentService.scheduleAppointment(payload);
      // Refresh the list
      await fetchAppointments();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to schedule appointment";
      setError(errorMessage);
    }
  };

  const cancelAppointment = async (id: string) => {
    try {
      await appointmentService.cancelAppointment(id);
      // Refresh the list
      await fetchAppointments();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to cancel appointment";
      setError(errorMessage);
    }
  };

  return {
    appointments: data,
    isLoading,
    error,
    fetchAppointments,
    scheduleAppointment,
    cancelAppointment,
    reset,
  };
};
