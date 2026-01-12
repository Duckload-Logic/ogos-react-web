/**
 * Admin Schedules Hook
 * Manages schedule/appointment operations for admin
 */

import { useState, useEffect, useCallback } from "react";
import * as appointmentService from "@/features/appointments/services";
import { Appointment } from "@/features/appointments/services";

export const useAdminSchedules = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all appointments
  const fetchAppointments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await appointmentService.listAllAppointments();
      setAppointments(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch";
      setError(message);
      console.error("Error fetching appointments:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Reschedule appointment
  const rescheduleAppointment = async (
    appointmentId: number,
    payload: appointmentService.CreateAppointmentRequest
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await appointmentService.rescheduleAppointment(
        appointmentId,
        payload
      );
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === appointmentId ? updated : apt))
      );
      return updated;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to reschedule";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Approve appointment
  const approveAppointment = async (appointmentId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await appointmentService.approveAppointment(appointmentId);
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === appointmentId ? updated : apt))
      );
      return updated;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to approve";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Complete appointment
  const completeAppointment = async (appointmentId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await appointmentService.completeAppointment(appointmentId);
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === appointmentId ? updated : apt))
      );
      return updated;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to complete";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel appointment
  const cancelAppointment = async (appointmentId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await appointmentService.cancelAppointment(appointmentId);
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === appointmentId ? updated : apt))
      );
      return updated;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to cancel";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchAppointments();
  }, []);

  return {
    appointments,
    isLoading,
    error,
    fetchAppointments,
    rescheduleAppointment,
    approveAppointment,
    completeAppointment,
    cancelAppointment,
  };
};