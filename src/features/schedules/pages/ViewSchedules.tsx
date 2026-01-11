import { useState, useEffect } from "react";
import { Loader, Calendar } from "lucide-react";
import { useAppointments } from "@/features/appointments/hooks/useAppointments";
import { useAuth } from "@/context";
import {
  ScheduleHeader,
  ScheduleErrorAlert,
  UpcomingAppointmentsList,
  CancelledAppointmentsList,
  ExcuseSlipsSection,
  CancelAppointmentModal,
  SuccessModal,
  HelpSection,
} from "@/features/schedules/components";
import { Appointment } from "@/features/appointments";

/**
 * ViewSchedules - Main page for viewing user's schedules and appointments
 * Orchestrates multiple sub-components for displaying:
 * - Upcoming appointments
 * - Cancelled appointments
 * - Excuse slips section
 * - Action modals (cancel, success)
 */
export default function ViewSchedules() {
  const { user } = useAuth();
  const {
    appointments,
    loading,
    error,
    fetchAppointments,
    cancelAppointment,
    clearError,
  } = useAppointments();

  // Modal and state management
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(
    null,
  );
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  // Load appointments on component mount
  useEffect(() => {
    if (user?.id) {
      fetchAppointments();
    }
  }, [user?.id, fetchAppointments]);

  // Event handlers
  const handleDeleteClick = (appointment: Appointment) => {
    setAppointmentToDelete(appointment);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (appointmentToDelete) {
      setIsDeleting(true);
      clearError();
      try {
        const success = await cancelAppointment(appointmentToDelete);
        console.log('Cancel appointment success:', success);
        if (success) {
          setDeleteModalOpen(false);
          setSuccessModalOpen(true);
          setAppointmentToDelete(null);
        }
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setAppointmentToDelete(null);
  };

  const handleCloseSuccess = () => {
    setSuccessModalOpen(false);
  };

  // Loading state
  if (loading && appointments.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader className="w-8 h-8 animate-spin text-primary" />
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .error-alert {
          animation: slideDown 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both;
        }
        .upcoming-section {
          animation: slideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.15s both;
        }
        .cancelled-section {
          animation: slideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
        }
        .excuse-section {
          animation: slideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.25s both;
        }
        .help-section {
          animation: slideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both;
        }
      `}</style>
      {/* Header */}
      <ScheduleHeader
        title="My Schedules"
        description="View your appointments and excuse slip status"
      />

      {/* Error Alert */}
      {error && (
        <div className="error-alert">
          <ScheduleErrorAlert error={error} onClose={clearError} />
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-8 py-6 sm:py-8 md:py-12">
        {/* Upcoming Appointments Section */}
        <section className="mb-12 upcoming-section">
          <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Your Upcoming Appointments
          </h2>
          <UpcomingAppointmentsList
            appointments={appointments}
            onDeleteClick={handleDeleteClick}
            isDeleting={isDeleting}
          />
        </section>

        {/* Cancelled Appointments Section */}
        <div className="cancelled-section">
          <CancelledAppointmentsList appointments={appointments} />
        </div>

        {/* Excuse Slips Section */}
        <div className="excuse-section">
          <ExcuseSlipsSection />
        </div>

        {/* Help Section */}
        <div className="help-section">
          <HelpSection />
        </div>
      </div>

      {/* Modals */}
      <CancelAppointmentModal
        isOpen={deleteModalOpen}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <SuccessModal
        isOpen={successModalOpen}
        title="Appointment Cancelled"
        message="Your appointment has been successfully cancelled."
        onClose={handleCloseSuccess}
      />
    </div>
  );
}