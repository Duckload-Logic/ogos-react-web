/**
 * Appointment Feature Types
 * 
 * Central location for all TypeScript interfaces and types
 * used throughout the appointments feature.
 */

export interface TimeSlot {
  slotId: number;
  startTime: string;
  isNotTaken: boolean;
}

export interface Appointment {
  id: number;
  userId: number;
  reason: string;
  scheduledDate: string;
  scheduledTime: string;
  concernCategory: string;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
}

export type AppointmentStatus = 'Pending' | 'Approved' | 'Completed' | 'Cancelled' | 'Rescheduled';

export interface CreateAppointmentRequest {
  reason: string;
  scheduledDate: string;
  scheduledTime: string;
  concernCategory?: string;
}

export interface UseAppointmentsReturn {
  appointments: Appointment[];
  availableSlots: TimeSlot[];
  loading: boolean;
  error: string | null;
  fetchAppointments: (fetchAll?: boolean, status?: string, startDate?: string, endDate?: string) => Promise<void>;
  fetchAvailableSlots: (date?: string) => Promise<void>;
  createAppointment: (request: CreateAppointmentRequest) => Promise<Appointment | null>;
  cancelAppointment: (appointmentId: number | Appointment) => Promise<boolean>;
  rescheduleAppointment: (appointmentId: number, payload: CreateAppointmentRequest) => Promise<Appointment | null>;
  clearError: () => void;
}
