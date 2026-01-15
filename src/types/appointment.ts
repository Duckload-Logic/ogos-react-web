/**
 * Global Appointment Types
 * Shared across appointments, schedules, and admin features
 */

// Valid appointment status values
export const APPOINTMENT_STATUSES = {
  PENDING: "Pending",
  APPROVED: "Approved",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  RESCHEDULED: "Rescheduled",
} as const;

export type AppointmentStatus = typeof APPOINTMENT_STATUSES[keyof typeof APPOINTMENT_STATUSES];

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

export interface CreateAppointmentRequest {
  reason: string;
  scheduledDate: string;
  scheduledTime: string;
  concernCategory?: string;
  status?: AppointmentStatus;
}

export interface UpdateStatusRequest {
  status: string;
}

export interface AppointmentFilters {
  status?: string;
  startDate?: string;
  endDate?: string;
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
