import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, AlertCircle, Loader, Calendar, Eye, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useAdminSchedules } from "../hooks";
import { ScheduleActionModal } from "../components";
import { Appointment, CreateAppointmentRequest } from "@/services/appointmentService";

export default function Frontdesk() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0));
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [modalAction, setModalAction] = useState<"view" | "reschedule" | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const {
    appointments,
    isLoading,
    error,
    rescheduleAppointment,
    fetchAppointments,
  } = useAdminSchedules();

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getDayOfWeek = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Format date functions
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Get appointments for a specific date
  const getAppointmentsForDate = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return appointments.filter((apt) => {
      // Normalize the scheduled date to YYYY-MM-DD format (handle both with and without time)
      if (!apt.scheduledDate) return false;
      const aptDatePart = apt.scheduledDate.split("T")[0];
      return (
        aptDatePart === dateStr &&
        (apt.status === "Approved" || apt.status === "Rescheduled")
      );
    });
  };

  const hasDayAppointments = (day: number) => {
    return getAppointmentsForDate(day).length > 0;
  };

  const getSelectedDayAppointments = () => {
    if (!selectedDay) return [];
    return getAppointmentsForDate(selectedDay);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rescheduled":
        return "bg-blue-100 text-blue-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
        return "bg-purple-100 text-purple-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
      handleModalClose();
      await fetchAppointments();
    } catch (error) {
      console.error("Error rescheduling:", error);
    } finally {
      setModalLoading(false);
    }
  };

  // Generate calendar grid
  const calendarDays = [];
  const daysInMonth = getDaysInMonth(currentMonth);
  const startingDayOfWeek = getDayOfWeek(currentMonth);

  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const monthName = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Frontdesk Dashboard</h1>
          <p className="text-gray-600 mt-2">View and manage admin schedules</p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader className="h-6 w-6 animate-spin text-gray-600" />
            <span className="ml-2 text-gray-600">Loading appointments...</span>
          </div>
        )}

        <div className="grid grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="col-span-2 p-6">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">{monthName}</h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 gap-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center font-semibold text-sm text-gray-600 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, index) => {
                  const dayAppointments = day ? getAppointmentsForDate(day) : [];
                  const isToday = day === new Date().getDate() && currentMonth.getMonth() === new Date().getMonth() && currentMonth.getFullYear() === new Date().getFullYear();
                  const hasAppointments = day && dayAppointments.length > 0;
                  const isSelected = selectedDay === day;

                  return (
                    <div
                      key={index}
                      onClick={() => {
                        if (day) {
                          setSelectedDay(selectedDay === day ? null : day);
                        }
                      }}
                      className={`min-h-28 p-2 border rounded-lg transition-colors cursor-pointer ${
                        day
                          ? "bg-white hover:bg-blue-50 border-gray-200 hover:border-blue-400"
                          : "bg-gray-50"
                      } ${isToday ? "border-blue-500 bg-blue-50" : ""} ${
                        hasAppointments ? "border-2 border-green-500 bg-green-50" : ""
                      } ${isSelected ? "ring-2 ring-primary ring-offset-2" : ""}`}
                    >
                      {day && (
                        <div className="space-y-1 h-full flex flex-col">
                          <div className={`text-sm font-semibold flex items-center justify-between ${isToday ? "text-blue-600" : "text-gray-900"}`}>
                            {day}
                            {hasAppointments && (
                              <Calendar className="w-4 h-4 text-green-600" />
                            )}
                          </div>
                          <div className="flex-1 space-y-1 overflow-y-auto text-xs">
                            {dayAppointments.map((apt) => (
                              <div
                                key={apt.id}
                                className={`px-1 py-0.5 rounded text-white truncate ${
                                  apt.status === "Approved" ? "bg-green-600" : "bg-blue-600"
                                }`}
                                title={apt.reason}
                              >
                                {apt.scheduledTime}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Sidebar - Appointments for Selected Day */}
          <div className="space-y-4">
            {/* Selected Day Appointments */}
            {selectedDay && (
              <Card className="p-4">
                <h3 className="font-semibold mb-4">
                  {new Date(currentMonth.getFullYear(), currentMonth.getMonth(), selectedDay).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {getSelectedDayAppointments().length === 0 ? (
                    <div className="text-center py-6">
                      <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                      <p className="text-sm text-gray-500">No appointments scheduled for this day</p>
                    </div>
                  ) : (
                    getSelectedDayAppointments().map((appointment) => (
                      <div
                        key={appointment.id}
                        className="border rounded-lg p-3 space-y-2 hover:bg-blue-50 cursor-pointer transition-colors"
                        onClick={() => handleViewAppointment(appointment)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900">{appointment.reason}</p>
                            <p className="text-xs text-gray-600">User ID: {appointment.userId}</p>
                          </div>
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600 space-y-1">
                          <p><span className="font-medium">Time:</span> {appointment.scheduledTime}</p>
                          <p><span className="font-medium">Category:</span> {appointment.concernCategory}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full mt-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRescheduleAppointment(appointment);
                          }}
                        >
                          <Edit2 className="w-3 h-3 mr-1" />
                          Reschedule
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            )}

            {!selectedDay && (
              <Card className="p-4">
                <h3 className="font-semibold mb-4">Upcoming Appointments</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {appointments
                    .filter((a) => {
                      const aptDate = new Date(a.scheduledDate);
                      return aptDate >= new Date(new Date().setHours(0, 0, 0, 0));
                    })
                    .filter((a) => ["Approved", "Rescheduled"].includes(a.status))
                    .sort((a, b) => {
                      const dateA = new Date(a.scheduledDate);
                      const dateB = new Date(b.scheduledDate);
                      return dateA.getTime() - dateB.getTime();
                    })
                    .slice(0, 5)
                    .map((appointment) => (
                      <div
                        key={appointment.id}
                        className="border rounded-lg p-3 space-y-2 hover:bg-blue-50 cursor-pointer transition-colors"
                        onClick={() => handleViewAppointment(appointment)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900">{appointment.reason}</p>
                            <p className="text-xs text-gray-600">User ID: {appointment.userId}</p>
                          </div>
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600 space-y-1">
                          <p><span className="font-medium">Date:</span> {new Date(appointment.scheduledDate).toLocaleDateString()}</p>
                          <p><span className="font-medium">Time:</span> {appointment.scheduledTime}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </Card>
            )}

            {/* Appointment Action Modal */}
            {selectedAppointment && (
              <ScheduleActionModal
                isOpen={modalOpen}
                appointment={selectedAppointment}
                action={modalAction}
                isLoading={modalLoading}
                onClose={handleModalClose}
                onConfirm={handleModalConfirm}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}