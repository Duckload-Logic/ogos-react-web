import { apiClient } from '@/lib/api';
import type {
  TimeSlot,
  Appointment,
  CreateAppointmentRequest,
  AppointmentStatus,
} from '../types';
import * as appointmentServiceAPI from '@/services/appointmentService';

class AppointmentService {
  // Get available slots for a specific date
  async getAvailableSlots(date?: string): Promise<TimeSlot[] | any> {
    try {
      const params = date ? { date } : {};
      const response = await apiClient.get('/appointments/slots', { params });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching available slots:', error);
      throw error;
    }
  }

  // Get all appointments for the current user (uses auth context)
  async getAllAppointments(): Promise<Appointment[]> {
    try {
      const response = await apiClient.get('/appointments');
      // Handle null or undefined response
      if (!response || !response.data) {
        return [];
      }
      // API returns array directly, not wrapped in a data property
      return Array.isArray(response.data) ? response.data : response.data.data || [];
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  }

  // Get all appointments (admin - all users)
  async getAllAppointmentsAdmin(status: string = "", startDate: string = "", endDate: string = ""): Promise<Appointment[]> {
    try {
      let url = '/appointments/all?';
      if (status) url += `status=${status}&`;
      if (startDate) url += `start_date=${startDate}&`;
      if (endDate) url += `end_date=${endDate}&`;
      
      const response = await apiClient.get(url);
      // Handle null or undefined response
      if (!response || !response.data) {
        return [];
      }
      
      return Array.isArray(response.data) ? response.data : response.data.data || [];
    } catch (error) {
      console.error('Error fetching all appointments:', error);
      throw error;
    }
  }

  // Get appointments for a specific student/user
  async getStudentAppointments(userId: number): Promise<Appointment[]> {
    try {
      // Use the centralized service
      return await appointmentServiceAPI.getStudentAppointments(userId);
    } catch (error) {
      console.error('Error fetching student appointments:', error);
      throw error;
    }
  }

  // Get a specific appointment by ID
  async getAppointmentById(id: number): Promise<Appointment> {
    try {
      return await appointmentServiceAPI.getAppointmentById(id);
    } catch (error) {
      console.error('Error fetching appointment:', error);
      throw error;
    }
  }

  // Create a new appointment
  async createAppointment(request: CreateAppointmentRequest): Promise<Appointment> {
    try {
      return await appointmentServiceAPI.createAppointment(request);
    } catch (error) {
      console.log('Error creating appointment:', error);
      throw error;
    }
  }

  // Update appointment status (connect to admin feature)
  async updateAppointmentStatus(appointmentId: number, status: AppointmentStatus): Promise<Appointment> {
    try {
      return await appointmentServiceAPI.updateAppointmentStatus(appointmentId, status);
    } catch (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }
  }

  // Approve an appointment (connect to admin feature)
  async approveAppointment(appointmentId: number): Promise<Appointment> {
    try {
      return await appointmentServiceAPI.approveAppointment(appointmentId);
    } catch (error) {
      console.error('Error approving appointment:', error);
      throw error;
    }
  }

  // Complete an appointment (connect to admin feature)
  async completeAppointment(appointmentId: number): Promise<Appointment> {
    try {
      return await appointmentServiceAPI.completeAppointment(appointmentId);
    } catch (error) {
      console.error('Error completing appointment:', error);
      throw error;
    }
  }

  // Cancel an appointment (connect to admin feature)
  async cancelAppointment(appointmentId: number | Appointment): Promise<Appointment> {
    try {
      // Handle both ID and full Appointment object
      const id = typeof appointmentId === 'number' ? appointmentId : appointmentId.id;
      return await appointmentServiceAPI.cancelAppointment(id);
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      throw error;
    }
  }

  // Reschedule an appointment (connect to admin feature)
  async rescheduleAppointment(appointmentId: number, payload: CreateAppointmentRequest): Promise<Appointment> {
    try {
      return await appointmentServiceAPI.rescheduleAppointment(appointmentId, payload);
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      throw error;
    }
  }
}

export const appointmentService = new AppointmentService();