/**
 * Schedules Management
 * Admin view for managing appointment schedules with calendar
 */

import { useState, useEffect } from "react";
import { useAdminSchedules } from "../hooks";
import { ScheduleCalendar, UpcomingSchedules, ScheduleActionModal } from "../components";
import { Appointment, CreateAppointmentRequest } from "@/services/appointmentService";
import Layout from "@/components/Layout";
import { AlertCircle, CheckCircle2, Loader } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const SchedulesManagement = () => {
  const {
    appointments,
    isLoading,
    error,
    rescheduleAppointment,
    fetchAppointments,
  } = useAdminSchedules();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(
    null
  );
  const [modalAction, setModalAction] = useState<"view" | "reschedule" | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Auto-clear error message after 5 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleViewAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setModalAction("view");
    setModalOpen(true);
  };

  const handleRescheduleAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setModalAction("reschedule");
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedAppointment(null);
    setModalAction(null);
  };

  const handleModalConfirm = async (data: CreateAppointmentRequest) => {
    if (!selectedAppointment) return;

    setModalLoading(true);
    try {
      await rescheduleAppointment(selectedAppointment.id, data);
      setSuccessMessage(`Appointment rescheduled successfully!`);
      handleModalClose();
      await fetchAppointments();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to reschedule appointment";
      setErrorMessage(errorMsg);
      console.error("Error rescheduling:", error);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Schedule Management</h1>
          <p className="text-gray-600 mt-2">
            Manage and reschedule student appointments
          </p>
        </div>

        {isLoading && appointments.length === 0 && (
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <Loader className="h-4 w-4 animate-spin text-blue-600" />
            <AlertDescription className="text-blue-800">
              Loading appointments...
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {errorMessage && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {successMessage && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-1">
            <ScheduleCalendar
              appointments={appointments}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
          </div>

          {/* Upcoming Schedules */}
          <div className="lg:col-span-2">
            <UpcomingSchedules
              appointments={appointments}
              selectedDate={selectedDate}
              onView={handleViewAppointment}
              onReschedule={handleRescheduleAppointment}
            />
          </div>
        </div>

        {/* Schedule Action Modal */}
        <ScheduleActionModal
          isOpen={modalOpen}
          appointment={selectedAppointment}
          action={modalAction}
          onClose={handleModalClose}
          onConfirm={handleModalConfirm}
          isLoading={modalLoading}
        />
      </div>
    </Layout>
  );
};