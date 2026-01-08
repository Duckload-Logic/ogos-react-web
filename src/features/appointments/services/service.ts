import { apiClient } from '@/lib/api';
import type {
  TimeSlot,
  Appointment,
  CreateAppointmentRequest,
  AppointmentStatus,
} from '../types';

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
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  }

  // Get appointments for a specific student/user
  async getStudentAppointments(userId: number): Promise<Appointment[]> {
    try {
      // Use the same endpoint - the backend will get userID from auth context
      const response = await apiClient.get('/appointments');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching student appointments:', error);
      throw error;
    }
  }

  // Get a specific appointment by ID
  async getAppointmentById(id: number): Promise<Appointment> {
    try {
      const response = await apiClient.get(`/appointments/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching appointment:', error);
      throw error;
    }
  }

  // Create a new appointment
  async createAppointment(request: CreateAppointmentRequest): Promise<Appointment> {
    try {
      const response = await apiClient.post('/appointments', request);
      return response.data;
    } catch (error) {
      console.log('Error creating appointment:', error);
      throw error;
    }
  }

  // Update appointment status
  async updateAppointmentStatus(id: number, status: string): Promise<Appointment> {
    try {
      const response = await apiClient.put(`/appointments/${id}/status`, { status });
      return response.data.data;
    } catch (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }
  }

  // Cancel an appointment
  async cancelAppointment(id: number): Promise<boolean> {
    try {
      await apiClient.put(`/appointments/${id}/status`, { status: 'Cancelled' });
      return true;
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      throw error;
    }
  }
}

export const appointmentService = new AppointmentService();