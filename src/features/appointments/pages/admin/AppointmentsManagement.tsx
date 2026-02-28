import { useMemo, useState } from "react";
import {
  useAppointments,
  useAppointmentsStats,
  useUpdateAppointment,
} from "@/features/appointments/hooks";
import {
  AppointmentCalendar,
  AppointmentsList,
} from "@/features/appointments/components";
import { Appointment, AppointmentStatus } from "@/features/appointments/types";
import AppointmentViewModal from "@/features/appointments/components/AppointmentViewModal";
import { useStatuses } from "../../hooks/useLookups";
import { STATUS_COLORS } from "@/config/constants";
import { Card, CardContent } from "@/components/ui/card";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "@/components/ui/use-toast";
import { toISODateString } from "../../utils";

export default function AppointmentsManagement() {
  const { data: appointmentStatuses } = useStatuses();
  const statusWithAll = useMemo(() => {
    if (!appointmentStatuses) return [];
    return [{ id: 0, name: "All", colorKey: "stale" }, ...appointmentStatuses];
  }, [appointmentStatuses]);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedStatus, setSelectedStatus] = useState<AppointmentStatus>(
    statusWithAll?.[0] || { id: 0, name: "All", colorKey: "stale" },
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState(toISODateString(new Date()));
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [endDate, setEndDate] = useState(
    toISODateString(new Date(new Date().setMonth(new Date().getMonth() + 1))),
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    startDate ? new Date(startDate) : undefined,
  );

  const getLocalDateString = (date?: Date, fallback?: string) => {
    if (!date) return fallback || "";
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const { data: statusCounts } = useAppointmentsStats({
    params: {
      startDate: getLocalDateString(selectedDate, startDate),
      endDate: getLocalDateString(selectedDate, endDate),
    },
  });
  const { data: allStatusCounts } = useAppointmentsStats({});
  const { data, isLoading } = useAppointments({
    isMe: false,
    params: {
      page: currentPage,
      search: debouncedSearch,
      statusId: selectedStatus?.id === 0 ? undefined : selectedStatus?.id,
      startDate: getLocalDateString(selectedDate, startDate),
      endDate: getLocalDateString(selectedDate, endDate),
    },
  });
  const appointments = data?.appointments || [];
  const totalPages = data?.totalPages;

  const bookedDates = new Set(
    appointments.map((apt) => {
      const date = new Date(apt.whenDate);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    }),
  );

  // Use full update hook for all actions (can send status + adminNotes)
  const { mutate: updateAppointment } = useUpdateAppointment();

  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const handleViewAppointment = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setIsViewOpen(true);
  };

  const getStatusIdByAction = (action: string): number | undefined => {
    const statusMap: { [key: string]: number } = {
      Approve: appointmentStatuses?.find((s) =>
        s.name.toLowerCase().includes("scheduled"),
      )?.id!,
      Reject: appointmentStatuses?.find((s) =>
        s.name.toLowerCase().includes("rejected"),
      )?.id!,
      Reschedule: appointmentStatuses?.find((s) =>
        s.name.toLowerCase().includes("rescheduled"),
      )?.id!,
      Cancel: appointmentStatuses?.find((s) =>
        s.name.toLowerCase().includes("cancelled"),
      )?.id!,
      Complete: appointmentStatuses?.find((s) =>
        s.name.toLowerCase().includes("completed"),
      )?.id!,
      "No-show": appointmentStatuses?.find((s) =>
        s.name.toLowerCase().includes("no-show"),
      )?.id!,
    };

    return statusMap[action];
  };

  const handleStatusAction = async (
    apt: Appointment,
    action: string,
    message?: string,
  ): Promise<boolean> => {
    const statusId = getStatusIdByAction(action);
    if (!statusId) {
      toast({
        title: "Error",
        description: "Target status not found",
        variant: "destructive",
      });
      return false;
    }

    const payload: any = {
      status: { id: statusId },
    };

    if (message) {
      payload.adminNotes = message;
    }
    console.log("Calling updateAppointment with", {
      id: apt.id!,
      data: payload,
    });

    try {
      await updateAppointment({ id: apt.id!, data: payload });

      setIsViewOpen(false);
      return true;
    } catch (error) {
      console.error(`${action} failed:`, error);
      return false;
    }
  };

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const handleReschedule = async (
    apt: Appointment,
    newDate: string,
    newTimeSlotId: number,
  ): Promise<boolean> => {
    if (isWeekend(new Date(newDate))) {
      alert("Selected date falls on a weekend. Please choose a weekday.");
      return false;
    }

    const payload = {
      whenDate: newDate,
      timeSlot: { id: newTimeSlotId },
      status: {
        id: appointmentStatuses?.find((s) =>
          s.name.toLowerCase().includes("rescheduled"),
        )?.id,
      },
    };

    console.log("Calling updateAppointment for reschedule with", {
      id: apt.id!,
      data: payload,
    });

    try {
      await updateAppointment({
        id: apt.id!,
        // @ts-ignore
        data: payload,
      });
      setIsViewOpen(false);
      return true;
    } catch (error) {
      console.error("Reschedule failed:", error);
      return false;
    }
  };

  return (
    <div className="max-w-8xl mx-auto px-4 py-2 space-y-6">
      {/* Info Banner */}
      <div className="bg-blue-500/10 border border-blue-300 rounded-lg p-4">
        <p className="text-sm text-blue-600 dark:text-blue-300">
          <strong>Note:</strong> Students request appointments in their portal.
          This page is for approving, rejecting, or managing appointment
          requests.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {appointmentStatuses?.map((stat) => (
          <Card
            key={stat.id}
            className={`${STATUS_COLORS[stat.colorKey]} border-0`}
          >
            <CardContent className="py-4 px-4">
              <p className="text-xs font-medium uppercase tracking-wide">
                Total {stat.name}
              </p>
              <p className="text-xl font-semibold text-foreground">
                {allStatusCounts?.find((s) => s.id === stat.id)?.count || 0}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Calendar and List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        <AppointmentCalendar
          title="Appointments Calendar"
          className="col-span-1 lg:col-span-2"
          currentMonth={currentMonth}
          selectedDate={selectedDate}
          onMonthChange={setCurrentMonth}
          onDateSelect={(date) => {
            if (!date) return;
            const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
            setSelectedDate(date);
            setStartDate(dateStr);
            setEndDate(dateStr);
            setCurrentPage(1);
          }}
          bookedDates={bookedDates}
          legends={appointmentStatuses
            ?.filter(
              (status) =>
                status.name.includes("Pending") ||
                status.name.includes("Scheduled") ||
                status.name.includes("Rescheduled"),
            )
            .map((status) => ({
              color: STATUS_COLORS[status.colorKey],
              label: status.name,
            }))}
          hasHeader
          isAdmin
        />

        <AppointmentsList
          title={`Appointment List - ${selectedDate ? selectedDate.toDateString() : "All Dates"}`}
          className="col-span-1 lg:col-span-4"
          searchTerm={searchTerm}
          onSearchChange={(value: string) => {
            setSearchTerm(value);
            setCurrentPage(1);
          }}
          statuses={statusWithAll || []}
          selectedStatus={selectedStatus}
          statusCounts={statusCounts || []}
          onStatusChange={setSelectedStatus}
          appointments={appointments}
          onViewClick={handleViewAppointment}
          onPageChange={setCurrentPage}
          currentPage={currentPage}
          totalPages={totalPages || 1}
          isLoading={isLoading}
        />
      </div>

      <AppointmentViewModal
        appointment={selectedAppointment}
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        statuses={appointmentStatuses || []}
        onStatusAction={handleStatusAction}
        onReschedule={handleReschedule}
      />
    </div>
  );
}
