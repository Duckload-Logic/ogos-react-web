import Layout from "@/components/Layout";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Eye, Check, X, AlertCircle, Clock } from "lucide-react";
import { useAdminAppointments } from "../hooks/useAdminAppointments";
import { useUser } from "@/hooks/useUser";
import { AdminCalendar } from "../components/AdminCalendar";
import { AppointmentsList } from "../components/AppointmentsList";
import { AppointmentActionModal } from "../components/AppointmentActionModal";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Appointment, APPOINTMENT_STATUSES } from "@/services/appointmentService";
import { formatDate } from "@/features/schedules/utils/formatters";

type StatusFilterType = "Pending" | "Approved" | "Completed" | "Cancelled";
type StatusTypes = StatusFilterType | "Rescheduled";
type ModalActionType = "view" | "reschedule" | "approve" | "reject" | "complete" | null;

export default function AppointmentsManagement() {
  const { fetchUserData } = useUser();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const {
    appointments,
    isLoading,
    error,
    success,
    fetchAppointments,
    approveAppointment,
    rejectAppointment,
    completeAppointment,
    rescheduleAppointment,
    clearError,
    clearSuccess,
  } = useAdminAppointments();

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>(APPOINTMENT_STATUSES.PENDING);
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(
    new Date(new Date().setMonth(currentMonth.getMonth() + 1))
      .toISOString()
      .slice(0, 10)
  );
  const [students, setStudents] = useState<any[]>([]);
  const touchStartX = useRef<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(startDate ? new Date(startDate) : undefined);
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [modalAction, setModalAction] = useState<ModalActionType>(null);

  // Fetch appointments on mount and when filters change
  useEffect(() => {
    const loadAppointments = async () => {
      await fetchAppointments({
        status: statusFilter,
        startDate,
        endDate,
      });
    };

    loadAppointments();
  }, [statusFilter, startDate, endDate, fetchAppointments, refreshTrigger]);

  // Fetch student details for appointments
  useEffect(() => {
    const fetchAllStudents = async () => {
      if (appointments.length === 0) {
        setStudents([]);
        return;
      }

      try {
        const uniqueStudentIds = [
          ...new Set(appointments.map((apt) => apt.userId)),
        ];

        const studentData = [];
        for (const id of uniqueStudentIds) {
          const data = await fetchUserData(id);
          studentData.push(data);
        }

        setStudents(studentData);
      } catch (err) {
        console.error("Failed to fetch students:", err);
      }
    };

    fetchAllStudents();
  }, [appointments]);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(clearSuccess, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, clearSuccess]);

  const bookedDates = new Set(
    appointments
      .map((apt) => {
        const date = new Date(apt.scheduledDate);
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const d = String(date.getDate()).padStart(2, '0');
        
        return `${y}-${m}-${d}`;
      })
  );

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const previousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const monthName = currentMonth.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  const calendarLegends: Record<StatusFilterType, any[]> = {
    Pending: [{ color: "bg-yellow-500 border border-primary", label: "Pending" }],
    Approved: [
      { color: "bg-blue-500 border border-primary", label: "Scheduled" },
    ],
    Completed: [{ color: "bg-blue-500 border border-primary", label: "Completed" }],
    Cancelled: [{ color: "bg-red-500 border border-primary", label: "Cancelled" }],
  };

  const statusColors: Record<StatusTypes, string> = {
    Pending: "bg-yellow-500/80",
    Approved: "bg-blue-500",
    Completed: "bg-green-500",
    Cancelled: "bg-red-500",
    Rescheduled: "bg-purple-500",
  };

  // Action handlers
  const handleApprove = async (appointmentId: number) => {
    const apt = appointments.find((apt) => {
      console.log('Comparing:', apt.id, 'Type:', typeof apt.id, 'Match:', apt.id === appointmentId);
      return apt.id === appointmentId;
    });
    setSelectedAppointment(apt || null);
    setModalAction("approve");
    setModalOpen(true);
  };

  const handleReject = async (appointmentId: number) => {
    const apt = appointments.find((apt) => apt.id === appointmentId);
    setSelectedAppointment(apt || null);
    setModalAction("reject");
    setModalOpen(true);
  };

  const handleComplete = async (appointmentId: number) => {
    const apt = appointments.find((apt) => {
      console.log('Comparing:', apt.id, 'Type:', typeof apt.id, 'Match:', apt.id === appointmentId);
      return apt.id === appointmentId;
    });
    setSelectedAppointment(apt || null);
    setModalAction("complete");
    setModalOpen(true);
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

  const handleModalConfirm = async (data?: any) => {
    if (!selectedAppointment) return;

    try {
      if (modalAction === "approve") {
        await approveAppointment(selectedAppointment.id);
      } else if (modalAction === "reject") {
        await rejectAppointment(selectedAppointment.id);
      } else if (modalAction === "complete") {
        await completeAppointment(selectedAppointment.id);
      } else if (modalAction === "reschedule" && data) {
        console.log("Reschedule data:", data);
        await rescheduleAppointment(selectedAppointment.id, data);
      }

      setRefreshTrigger((prev) => prev + 1)
    } catch (err) {
      console.error("Modal action error:", err);
    }
  };

  const appointmentActions: Record<StatusFilterType, any[]> = {
    Pending: [
      {
        color: "bg-gray-500",
        purpose: "View",
        label: <Eye size={16} />,
        onClick: (appointment: Appointment) => {
          handleViewAppointment(appointment);
        },
      },
      {
        color: "bg-green-500",
        purpose: "Approve",
        label: <Check size={16} />,
        onClick: (appointment: Appointment) => {
          handleApprove(appointment.id);
        },
      },
      {
        color: "bg-red-500",
        purpose: "Reject",
        label: <X size={16} />,
        onClick: (appointment: Appointment) => {
          handleReject(appointment.id);
        },
      },
    ],
    Approved: [
      {
        color: "bg-gray-500",
        purpose: "View",
        label: <Eye size={16} />,
        onClick: (appointment: Appointment) => {
          handleViewAppointment(appointment);
        },
      },
      {
        color: "bg-blue-500",
        purpose: "Reschedule",
        label: <Clock size={16} />,
        onClick: (appointment: Appointment) => {
          handleRescheduleAppointment(appointment);
        },
      },
      {
        color: "bg-green-500",
        purpose: "Mark as Completed",
        label: <Check size={16} />,
        onClick: (appointment: Appointment) => {
          handleComplete(appointment.id);
        },
      },
      {
        color: "bg-red-500",
        purpose: "Cancel appointment",
        label: <X size={16} />,
        onClick: (appointment: Appointment) => {
          handleReject(appointment.id);
        },
      },
    ],
    Cancelled: [
      {
        color: "bg-gray-500",
        purpose: "View",
        label: <Eye size={16} />,
        onClick: (appointment: Appointment) => {
          handleViewAppointment(appointment);
        },
      },
    ],
    Completed: [
      {
        color: "bg-gray-500",
        purpose: "View",
        label: <Eye size={16} />,
        onClick: (appointment: Appointment) => {
          handleViewAppointment(appointment);
        },
      },
    ],
  };

  return (
    <Layout title="Appointments">
      <div className="space-y-6">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="flex items-center gap-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
            <button
              onClick={clearError}
              className="ml-auto text-sm underline hover:no-underline"
            >
              Dismiss
            </button>
          </Alert>
        )}

        {/* Success Alert */}
        {success && (
          <Alert className="flex items-center gap-3 bg-green-50 border-green-200">
            <Check className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>Note:</strong> Students request appointments in their
            portal. This page is for approving, rejecting, or managing
            appointment requests.
          </p>
        </div>

        {/* Quick Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-6 rounded-lg shadow border border-gray-200">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilterType)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              From Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              To Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <AdminCalendar
            currentYear={currentMonth.getFullYear()}
            currentMonth={currentMonth.getMonth()}
            previousMonth={previousMonth}
            nextMonth={nextMonth}
            monthName={monthName}
            emptyDays={emptyDays}
            days={days}
            bookedDates={bookedDates}
            isCurrentMonth={
              currentMonth.getMonth() === new Date().getMonth() &&
              currentMonth.getFullYear() === new Date().getFullYear()
            }
            todayDate={new Date().getDate()}
            selectedDate={selectedDate}
            onDateClick={(day) => {
              const newDate = new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth(),
                day
              );
              setSelectedDate(newDate);
            }}
            touchStartX={touchStartX}
            legends={calendarLegends[statusFilter]}
            occupiedDayColor={statusColors[statusFilter]}
          />

          {/* Appointments Table */}
          <AppointmentsList
            title={`${statusFilter} Appointments (${formatDate(selectedDate?.toISOString() || "")})`}
            appointments={appointments}
            students={students}
            status={statusFilter}
            selectedDate={selectedDate}
            className="lg:col-span-3"
            actions={appointmentActions[statusFilter]}
            isLoading={isLoading}
          />
        </div>

        {/* Appointment Action Modal */}
        <AppointmentActionModal
          isOpen={modalOpen}
          appointment={selectedAppointment}
          action={modalAction}
          onClose={handleModalClose}
          onConfirm={handleModalConfirm}
          isLoading={isLoading}
        />
      </div>
    </Layout>
  );
}


