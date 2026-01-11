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

  // Fetch available slots when date changes
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
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Calendar Section */}
          <DatePickerCalendar
            currentMonth={currentMonth}
            selectedDate={selectedDate}
            onMonthChange={handleMonthChange}
            onDateSelect={setSelectedDate}
          />

          {/* Time Slots Section */}
          <TimeSlotSelector
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            availableSlots={availableSlots}
            loading={loading}
            onTimeSelect={setSelectedTime}
          />
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