import { useState, useCallback, useEffect } from 'react';
import { appointmentService } from '../services/service';
import {
  type Appointment,
  type TimeSlot,
  type AppointmentStatus,
  type CreateAppointmentRequest,
  type UseAppointmentsReturn,
} from '../types';
import { useAuth } from '@/context';
import {
  extractErrorMessage,
  formatAvailableSlots,
} from '../utils';

export const useAppointments = (): UseAppointmentsReturn => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchAppointments = useCallback(async () => {
    if (!user?.id) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Backend gets userID from auth context, so just call getAllAppointments
      const data = await appointmentService.getAllAppointments();
      setAppointments(data);
    } catch (err: any) {
      const errorMessage = extractErrorMessage(err, 'Failed to fetch appointments');
      setError(errorMessage);
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const fetchAvailableSlots = useCallback(async (date?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await appointmentService.getAvailableSlots(date);
      const formattedSlots = formatAvailableSlots(data);
      setAvailableSlots(formattedSlots);
    } catch (err: any) {
      const errorMessage = extractErrorMessage(err, 'Failed to fetch available slots');
      setError(errorMessage);
      console.error('Error fetching available slots:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createAppointment = useCallback(
    async (request: CreateAppointmentRequest): Promise<Appointment | null> => {
      if (!user?.id) {
        setError('User not authenticated');
        return null;
      }

      setLoading(true);
      setError(null);
      try {
        const newAppointment = await appointmentService.createAppointment(request);
        setAppointments((prev) => [...prev, newAppointment]);
        return newAppointment;
      } catch (err: any) {
        const errorMessage = extractErrorMessage(err, 'Failed to create appointment');
        setError(errorMessage);
        console.error('Error creating appointment:', err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [user?.id],
  );

  const updateAppointmentStatus = useCallback(
    async (id: number, status: AppointmentStatus): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        await appointmentService.updateAppointmentStatus(id, status);
        setAppointments((prev) =>
          prev.map((appt) =>
            appt.id === id ? { ...appt, status } : appt,
          ),
        );
        return true;
      } catch (err: any) {
        const errorMessage = extractErrorMessage(err, 'Failed to update appointment status');
        setError(errorMessage);
        console.error('Error updating appointment status:', err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const cancelAppointment = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const success = await appointmentService.cancelAppointment(id);
      if (success) {
        setAppointments((prev) =>
          prev.map((appt) =>
            appt.id === id ? { ...appt, status: 'Cancelled' as const } : appt,
          ),
        );
      }
      return success;
    } catch (err: any) {
      const errorMessage = extractErrorMessage(err, 'Failed to cancel appointment');
      setError(errorMessage);
      console.error('Error cancelling appointment:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    appointments,
    availableSlots,
    loading,
    error,
    fetchAppointments,
    fetchAvailableSlots,
    createAppointment,
    updateAppointmentStatus,
    cancelAppointment,
    clearError,
  };
};
