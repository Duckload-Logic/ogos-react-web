import { useState, useCallback, useEffect } from 'react';
import * as appointmentService from '../services';
import {
  type Appointment,
  type TimeSlot,
  type AppointmentStatus,
  type CreateAppointmentRequest,
  type UseAppointmentsReturn,
} from '@/types';
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

  const fetchAppointments = useCallback(
    async (fetchAll: boolean = false, status: string = "", startDate: string = "", endDate: string = "") => {
      if (!fetchAll && !user?.id) {
        setError('User not authenticated');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch all appointments (admin) or just user's appointments
        const data = fetchAll
          ? await appointmentService.getAllAppointmentsAdmin(status, startDate, endDate)
          : await appointmentService.getAllAppointments();
        
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received from API');
        }

        if (data === null) {
          setAppointments([]);
          return;
        }
        
        setAppointments(data);
      } catch (err: any) {
        const errorMessage = extractErrorMessage(err, 'Failed to fetch appointments');
        setError(errorMessage);
        console.error('Error fetching appointments:', err);
      } finally {
        setLoading(false);
      }
    },
    [user?.id],
  );

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

  const cancelAppointment = useCallback(
    async (appointmentId: number | Appointment): Promise<boolean> => {
      const id = typeof appointmentId === 'number' ? appointmentId : appointmentId.id;

      setLoading(true);
      setError(null);
      try {
        await appointmentService.cancelAppointment(id);
        setAppointments((prev) =>
          prev.map((apt) =>
            apt.id === id ? { ...apt, status: 'Cancelled' } : apt
          )
        );
        return true;
      } catch (err: any) {
        const errorMessage = extractErrorMessage(err, 'Failed to cancel appointment');
        setError(errorMessage);
        console.error('Error cancelling appointment:', err);
        return false;
      } finally {
        setLoading(false);
      }
    }, 
    []
  );
  
  const rescheduleAppointment = useCallback(
    async (appointmentId: number, payload: CreateAppointmentRequest): Promise<Appointment | null> => {
      setLoading(true);
      setError(null);
      try {
        const updatedAppointment = await appointmentService.rescheduleAppointment(appointmentId, payload);
        setAppointments((prev) =>
          prev.map((apt) =>
            apt.id === appointmentId ? updatedAppointment : apt
          )
        );
        return updatedAppointment;
      } catch (err: any) {
        const errorMessage = extractErrorMessage(err, 'Failed to reschedule appointment');
        setError(errorMessage);
        console.error('Error rescheduling appointment:', err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    appointments,
    availableSlots,
    loading,
    error,
    fetchAppointments,
    fetchAvailableSlots,
    createAppointment,
    cancelAppointment,
    rescheduleAppointment,
    clearError,
  };
};
