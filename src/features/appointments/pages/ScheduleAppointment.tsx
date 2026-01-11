import { useState, useEffect } from "react";
import { useAppointments } from "@/features/appointments/hooks/useAppointments";
import { useAuth } from "@/context";
import {
  AppointmentHeader,
  AppointmentMessages,
  DatePickerCalendar,
  TimeSlotSelector,
  AppointmentDetailsForm,
} from "@/features/appointments/components";
import {
  mapDateToString,
  validateAppointmentForm,
} from "@/features/appointments/utils";
import {
  APPOINTMENT_ERROR_MESSAGES,
  APPOINTMENT_SUCCESS_MESSAGES,
} from "@/features/appointments/constants";

export default function ScheduleAppointment() {
  const { user } = useAuth();
  const {
    availableSlots,
    loading,
    error,
    fetchAvailableSlots,
    createAppointment,
    clearError,
  } = useAppointments();

  // State Management
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [reason, setReason] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  // Add page entrance animation
  useEffect(() => {
    setIsPageLoaded(true);
  }, []);
  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(mapDateToString(selectedDate));
      setSelectedTime("");
    }
  }, [selectedDate, fetchAvailableSlots]);

  // Handle appointment submission
  const handleSchedule = async () => {
    const validationError = validateAppointmentForm(selectedDate, selectedTime, reason);
    if (validationError) {
      alert(validationError);
      return;
    }

    if (!user?.id) {
      alert(APPOINTMENT_ERROR_MESSAGES.NOT_AUTHENTICATED);
      return;
    }

    setIsSubmitting(true);
    clearError();

    try {
      const appointment = await createAppointment({
        reason: reason,
        scheduledDate: mapDateToString(selectedDate!),
        scheduledTime: selectedTime,
        concernCategory: '',
      });

      if (appointment) {
        setSuccessMessage(
          `${APPOINTMENT_SUCCESS_MESSAGES.SCHEDULED} ID: ${appointment.id}`,
        );

        // Reset form
        setSelectedDate(undefined);
        setSelectedTime("");
        setReason("");

        // Clear success message after 5 seconds
        setTimeout(() => setSuccessMessage(""), 5000);
      }
    } catch (err) {
      console.error("Failed to schedule appointment:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle month navigation
  const handleMonthChange = (date: Date) => {
    setCurrentMonth(date);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @keyframes slideInLeftSmooth {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInRightSmooth {
          from {
            opacity: 0;
            transform: translateX(10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .calendar-section {
          animation: slideInLeftSmooth 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both;
        }
        .timeslot-section {
          animation: slideInRightSmooth 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.15s both;
        }
      `}</style>
      {/* Header */}
      <AppointmentHeader
        title="Schedule an Appointment"
        subtitle="Select a date and time for your counseling session"
      />

      {/* Messages */}
      <AppointmentMessages
        error={error}
        successMessage={successMessage}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 py-6 sm:py-8 md:py-12">
        {/* Date and Time Selectors - Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Calendar Section */}
          <div className="md:col-span-2 calendar-section">
            <DatePickerCalendar
              currentMonth={currentMonth}
              selectedDate={selectedDate}
              onMonthChange={handleMonthChange}
              onDateSelect={setSelectedDate}
            />
          </div>

          {/* Time Slots Section */}
          <div className="timeslot-section">
            <TimeSlotSelector
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              availableSlots={availableSlots}
              loading={loading}
              onTimeSelect={setSelectedTime}
            />
          </div>
        </div>

        {/* Appointment Details & Submit */}
        <AppointmentDetailsForm
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          reason={reason}
          onReasonChange={setReason}
          onSubmit={handleSchedule}
          isLoading={loading}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}