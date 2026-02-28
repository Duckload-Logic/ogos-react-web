/**
 * Appointment Feature Types
 *
 * Central location for all TypeScript interfaces and types
 * used throughout the appointments feature.
 */

import { User } from "@/types";

export interface TimeSlot {
  id: number;
  time: string;
}

export interface ConcernCategory {
  id: number;
  name: string;
}

export interface AppointmentStatus {
  id: number;
  name: string;
  colorKey: string;
}

export interface AvailableTimeSlotView {
  id: number;
  time: string;
  isAvailable: boolean;
}

export interface StatusCount {
  id: number;
  name: string;
  count: number;
}

/** Paginated response for student appointments */
export interface PaginatedAppointmentsResponse {
  appointments: Appointment[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface Appointment {
  id?: number;
  user?: User;
  reason: string;
  adminNotes?: string;
  whenDate: string;
  timeSlot: TimeSlot;
  appointmentCategory: ConcernCategory;
  /** Status can be either an object or string depending on API version */
  status?: AppointmentStatus;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Request payload for creating/updating appointments
 * @todo Finalize structure when API is complete
 */
export interface CreateAppointmentRequest {
  reason: string;
  scheduledDate: string;
  scheduledTime: string;
  concernCategory: string;
  status?: string;
}

/**
 * Return type for useAppointments hook (legacy)
 * @deprecated This interface is a placeholder for migration
 */
export interface UseAppointmentsReturn {
  appointments: Appointment[];
  availableSlots: AvailableTimeSlotView[];
  loading: boolean;
  error: string | null;
  success: string | null;
  isLoading: boolean;
  fetchAppointments: (isMe?: boolean, status?: string) => Promise<void>;
  fetchAvailableSlots: (date: string) => Promise<void>;
  createAppointment: (
    data: CreateAppointmentRequest,
  ) => Promise<Appointment | null>;
  cancelAppointment: (appointment: Appointment) => Promise<boolean>;
  clearError: () => void;
  clearSuccess: () => void;
}
