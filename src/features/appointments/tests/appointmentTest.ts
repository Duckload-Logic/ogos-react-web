import { useState, useCallback } from 'react';

export interface Appointment {
  id: number;
  studentRecordId: number;
  appointmentTypeId: number;
  scheduledDate: string;
  scheduledTime: string;
  concernCategory: string;
  status: 'Pending' | 'Approved' | 'Completed' | 'Cancelled' | 'Rescheduled';
  createdAt: Date;
  updatedAt: Date;
}

export interface TimeSlot {
  slotId: number;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export interface ScheduleResponse {
  date: string;
  availableSlots: TimeSlot[];
  bookedAppointments: Appointment[];
  totalSlots: number;
  availableCount: number;
  bookedCount: number;
}

// In-memory database
class AppointmentDatabase {
  private appointments: Map<number, Appointment> = new Map();
  private timeSlots: Map<string, TimeSlot[]> = new Map();
  private appointmentIdCounter = 1;
  private slotIdCounter = 1;

  constructor() {
    this.initializeSlots();
    this.initializeSampleAppointments();
  }

  private initializeSlots() {
    const generateSlots = (date: string): TimeSlot[] => {
      const times = [
        { start: '08:00', end: '09:00' },
        { start: '09:00', end: '10:00' },
        { start: '10:00', end: '11:00' },
        { start: '11:00', end: '12:00' },
        { start: '13:00', end: '14:00' },
        { start: '14:00', end: '15:00' },
        { start: '15:00', end: '16:00' },
        { start: '16:00', end: '17:00' },
      ];

      return times.map((time) => ({
        slotId: this.slotIdCounter++,
        date,
        startTime: time.start,
        endTime: time.end,
        isBooked: false,
      }));
    };

    // Generate slots for the next 30 days (excluding weekends)
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);

      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) {
        continue;
      }

      const dateStr = date.toISOString().split('T')[0];
      this.timeSlots.set(dateStr, generateSlots(dateStr));
    }
  }

  private initializeSampleAppointments() {
    // Add a few sample appointments for demo
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const sampleAppt: Appointment = {
      id: this.appointmentIdCounter++,
      studentRecordId: 1,
      appointmentTypeId: 1,
      scheduledDate: tomorrowStr,
      scheduledTime: '09:00',
      concernCategory: 'Academic',
      status: 'Pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.appointments.set(sampleAppt.id, sampleAppt);

    // Mark the slot as booked
    const slots = this.timeSlots.get(tomorrowStr);
    if (slots) {
      const slot = slots.find((s) => s.startTime === '09:00');
      if (slot) {
        slot.isBooked = true;
      }
    }
  }

  createAppointment(
    studentRecordId: number,
    appointmentTypeId: number,
    scheduledDate: string,
    scheduledTime: string,
    concernCategory: string,
  ): Appointment {
    const appointment: Appointment = {
      id: this.appointmentIdCounter++,
      studentRecordId,
      appointmentTypeId,
      scheduledDate,
      scheduledTime,
      concernCategory,
      status: 'Pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.appointments.set(appointment.id, appointment);

    // Mark slot as booked
    const slots = this.timeSlots.get(scheduledDate);
    if (slots) {
      const slot = slots.find((s) => s.startTime === scheduledTime);
      if (slot) {
        slot.isBooked = true;
      }
    }

    return appointment;
  }

  getAvailableSlots(date?: string): TimeSlot[] {
    if (!date) {
      const today = new Date();
      date = today.toISOString().split('T')[0];
    }

    const slots = this.timeSlots.get(date) || [];
    return slots.filter((slot) => !slot.isBooked);
  }

  getScheduleByDate(date: string): ScheduleResponse {
    const slots = this.timeSlots.get(date) || [];
    const bookedAppointments = Array.from(this.appointments.values()).filter(
      (appt) => appt.scheduledDate === date,
    );

    const availableSlots = slots.filter((slot) => !slot.isBooked);

    return {
      date,
      availableSlots,
      bookedAppointments,
      totalSlots: slots.length,
      availableCount: availableSlots.length,
      bookedCount: bookedAppointments.length,
    };
  }

  getAllAppointments(): Appointment[] {
    return Array.from(this.appointments.values());
  }

  getAppointmentById(id: number): Appointment | undefined {
    return this.appointments.get(id);
  }

  updateAppointmentStatus(
    id: number,
    status: Appointment['status'],
  ): Appointment | null {
    const appointment = this.appointments.get(id);
    if (!appointment) return null;

    appointment.status = status;
    appointment.updatedAt = new Date();
    return appointment;
  }

  cancelAppointment(id: number): boolean {
    const appointment = this.appointments.get(id);
    if (!appointment) return false;

    // Release the slot
    const slots = this.timeSlots.get(appointment.scheduledDate);
    if (slots) {
      const slot = slots.find(
        (s) => s.startTime === appointment.scheduledTime,
      );
      if (slot) {
        slot.isBooked = false;
      }
    }

    appointment.status = 'Cancelled';
    appointment.updatedAt = new Date();
    return true;
  }
}

// Singleton instance
const db = new AppointmentDatabase();

// Export service functions
export const appointmentService = {
  createAppointment: (
    studentRecordId: number,
    appointmentTypeId: number,
    scheduledDate: string,
    scheduledTime: string,
    concernCategory: string,
  ) => db.createAppointment(studentRecordId, appointmentTypeId, scheduledDate, scheduledTime, concernCategory),

  getAvailableSlots: (date?: string) => db.getAvailableSlots(date),

  getScheduleByDate: (date: string) => db.getScheduleByDate(date),

  getAllAppointments: () => db.getAllAppointments(),

  getAppointmentById: (id: number) => db.getAppointmentById(id),

  updateAppointmentStatus: (id: number, status: Appointment['status']) =>
    db.updateAppointmentStatus(id, status),

  cancelAppointment: (id: number) => db.cancelAppointment(id),
};