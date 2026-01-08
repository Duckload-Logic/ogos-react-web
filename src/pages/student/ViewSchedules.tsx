import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  FileText,
  Trash2,
  AlertCircle,
  CheckCircle,
  Loader,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAppointments } from "@/features/appointments/hooks/useAppointments";
import { useAuth } from "@/context";

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

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<number | null>(
    null,
  );
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load appointments on component mount
  useEffect(() => {
    if (user?.id) {
      fetchAppointments();
    }
  }, [user?.id, fetchAppointments]);

  const handleDeleteClick = (id: number) => {
    setAppointmentToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (appointmentToDelete) {
      setIsDeleting(true);
      clearError();
      try {
        const success = await cancelAppointment(appointmentToDelete);
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

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setAppointmentToDelete(null);
  };

  const closeSuccessModal = () => {
    setSuccessModalOpen(false);
  };

  // Format date helper
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get status badge color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Approved":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      case "Rescheduled":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const userAppointments = appointments;

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
      {/* Hero Section */}
      <div className="bg-primary text-primary-foreground py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h1 className="text-3xl md:text-4xl font-bold">My Schedules</h1>
          <p className="text-base md:text-lg mt-2 opacity-90">
            View your appointments and excuse slip status
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="font-semibold text-red-900">{error}</p>
            </div>
            <button
              onClick={clearError}
              className="text-red-600 hover:text-red-800 font-semibold"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-8 py-6 sm:py-8 md:py-12">
        {/* Appointments Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Your Upcoming Appointments
          </h2>

          {userAppointments.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-12 pb-12 text-center">
                <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">
                  No upcoming appointments scheduled
                </p>
                <Link to="/schedule" className="mt-4 inline-block">
                  <Button className="bg-primary hover:bg-primary-dark text-primary-foreground font-semibold">
                    Schedule an Appointment
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userAppointments
                .filter((appt) => appt.status !== "Cancelled")
                .sort(
                  (a, b) =>
                    new Date(a.scheduledDate).getTime() -
                    new Date(b.scheduledDate).getTime(),
                )
                .map((appointment) => (
                  <Card
                    key={appointment.id}
                    className="border-0 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <CardHeader className="bg-blue-50 border-b pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg text-gray-900">
                          {appointment.concernCategory}
                        </CardTitle>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            appointment.status,
                          )}`}
                        >
                          {appointment.status}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-600">
                            Date
                          </p>
                          <p className="text-base font-semibold text-gray-900">
                            {formatDate(appointment.scheduledDate)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-600">
                            Time
                          </p>
                          <p className="text-base font-semibold text-gray-900">
                            {appointment.scheduledTime.substring(0, 5)}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-600">
                          Appointment ID
                        </p>
                        <p className="text-base text-gray-900">
                          #{appointment.id}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-600">
                          Created
                        </p>
                        <p className="text-base text-gray-900">
                          {new Date(
                            appointment.createdAt,
                          ).toLocaleDateString()}
                        </p>
                      </div>

                      {appointment.status === "Pending" && (
                        <div className="pt-4 flex gap-3">
                          <Button
                            variant="outline"
                            className="flex-1 border-blue-500 text-blue-600 hover:bg-blue-50 bg-blue-50"
                            disabled
                          >
                            Reschedule (Soon)
                          </Button>
                          <Button
                            onClick={() => handleDeleteClick(appointment.id)}
                            disabled={isDeleting}
                            variant="outline"
                            className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                          >
                            {isDeleting ? (
                              <Loader className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      )}

                      {appointment.status !== "Pending" && (
                        <div className="pt-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">
                            Status: <span className="font-semibold text-gray-900">{appointment.status}</span>
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </section>

        {/* Cancelled Appointments Section */}
        {userAppointments.some((appt) => appt.status === "Cancelled") && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-600 mb-6 flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              Cancelled Appointments
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userAppointments
                .filter((appt) => appt.status === "Cancelled")
                .map((appointment) => (
                  <Card
                    key={appointment.id}
                    className="border-0 shadow-sm opacity-75"
                  >
                    <CardHeader className="bg-red-50 border-b pb-3">
                      <CardTitle className="text-lg text-gray-600 line-through">
                        {appointment.concernCategory}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-600">
                            Date
                          </p>
                          <p className="text-base text-gray-600 line-through">
                            {formatDate(appointment.scheduledDate)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-600">
                            Time
                          </p>
                          <p className="text-base text-gray-600 line-through">
                            {appointment.scheduledTime.substring(0, 5)}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-red-600 font-semibold">
                        Cancelled
                      </p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </section>
        )}

        {/* Excuse Slips Section */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Your Reviewed Excuse Slips
          </h2>

          <Card className="border-0 shadow-sm">
            <CardContent className="pt-12 pb-12 text-center">
              <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">
                No reviewed excuse slips found.
              </p>
              <p className="text-gray-500 text-base mt-2">
                Submit your excuse slips for review in the Excuse Slip section.
              </p>
              <Link to="/excuse-slip" className="mt-4 inline-block">
                <Button className="bg-primary hover:bg-primary-dark text-primary-foreground font-semibold">
                  Upload Excuse Slip
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-sm w-full border-0 shadow-xl">
              <div className="bg-red-600 text-white px-6 py-4 flex items-center gap-3 rounded-t-lg">
                <AlertCircle className="w-6 h-6" />
                <h3 className="text-lg font-bold">Cancel Appointment</h3>
              </div>
              <CardContent className="pt-6 pb-6">
                <p className="text-gray-700 mb-6">
                  Are you sure you want to cancel this appointment? This action
                  cannot be undone.
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={cancelDelete}
                    disabled={isDeleting}
                    variant="outline"
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    No, Keep it
                  </Button>
                  <Button
                    onClick={confirmDelete}
                    disabled={isDeleting}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold"
                  >
                    {isDeleting ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      "Yes, Cancel"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Success Modal */}
        {successModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-sm w-full border-0 shadow-xl">
              <div className="bg-green-600 text-white px-6 py-4 flex items-center gap-3 rounded-t-lg">
                <CheckCircle className="w-6 h-6" />
                <h3 className="text-lg font-bold">Appointment Cancelled</h3>
              </div>
              <CardContent className="pt-6 pb-6 text-center">
                <p className="text-gray-700 mb-6">
                  Your appointment has been successfully cancelled.
                </p>
                <Button
                  onClick={closeSuccessModal}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
                >
                  Done
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Help Section */}
        <Card className="border-0 shadow-sm mt-8">
          <CardHeader className="bg-blue-50 border-b border-blue-200">
            <CardTitle className="text-lg text-blue-900">Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-gray-700 mb-4">
              If you have any questions about your appointments or excuse slips:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Contact the Guidance Office during office hours</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Email: guidance@pupt.edu.ph</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Phone: (02) 1234-5678</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}