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
import { useDebounce } from "@/hooks/useDebounce";
import { toISODateString } from "../../utils";
import { Card, CardContent } from "@/components/ui/card";
import { STATUS_COLORS } from "@/config/constants";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";

const chartConfig = {
  pending: {
    label: "Pending",
    color: "#E7C66A",
  },
  scheduled: {
    label: "Scheduled",
    color: "#6FA8DC",
  },
  completed: {
    label: "Completed",
    color: "#74C69D",
  },
  cancelled: {
    label: "Cancelled",
    color: "#F4A261",
  },
  rejected: {
    label: "Rejected",
    color: "#E57373",
  },
  rescheduled: {
    label: "Rescheduled",
    color: "#B388EB",
  },
  noShow: {
    label: "No-show",
    color: "#94A3B8",
  },
};

export default function AppointmentsManagement() {
  const { data: appointmentStatuses } = useStatuses();

  const statusWithAll = useMemo(() => {
    if (!appointmentStatuses) return [];
    return [{ id: 0, name: "All", colorKey: "stale" }, ...appointmentStatuses];
  }, [appointmentStatuses]);

  const [currentMonth, setCurrentMonth] = useState(new Date());

  const defaultStatus: AppointmentStatus = {
    id: 0,
    name: "All",
    colorKey: "stale",
  };

  const [selectedStatus, setSelectedStatus] =
    useState<AppointmentStatus>(defaultStatus);

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
  const totalPages = data?.totalPages || 1;

  const bookedDates = new Set(
    appointments.map((apt) => {
      const date = new Date(apt.whenDate);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0",
      )}-${String(date.getDate()).padStart(2, "0")}`;
    }),
  );

  const { mutateAsync: updateAppointment } = useUpdateAppointment();

  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const handleViewAppointment = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setIsViewOpen(true);
  };

  const getStatusIdByAction = (action: string): number | undefined => {
    const statusMap: Record<string, number | undefined> = {
      Approve: appointmentStatuses?.find((s) =>
        s.name.toLowerCase().includes("scheduled"),
      )?.id,
      Reject: appointmentStatuses?.find((s) =>
        s.name.toLowerCase().includes("rejected"),
      )?.id,
      Reschedule: appointmentStatuses?.find((s) =>
        s.name.toLowerCase().includes("rescheduled"),
      )?.id,
      Cancel: appointmentStatuses?.find((s) =>
        s.name.toLowerCase().includes("cancelled"),
      )?.id,
      Complete: appointmentStatuses?.find((s) =>
        s.name.toLowerCase().includes("completed"),
      )?.id,
      "No-show": appointmentStatuses?.find((s) =>
        s.name.toLowerCase().includes("no-show"),
      )?.id,
    };

    return statusMap[action];
  };

  const handleStatusAction = async (
    apt: Appointment,
    action: string,
    message?: string,
  ): Promise<boolean> => {
    const statusId = getStatusIdByAction(action);

    if (!statusId) return false;

    const payload: any = {
      status: { id: statusId },
    };

    if (message) {
      payload.adminNotes = message;
    }

    try {
      await updateAppointment({
        id: apt.id!,
        data: payload,
      });
      setIsViewOpen(false);
      return true;
    } catch {
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
      alert("Selected date falls on a weekend.");
      return false;
    }

    try {
      await updateAppointment({
        id: apt.id!,
        data: {
          whenDate: newDate,
          timeSlot: { id: newTimeSlotId },
        } as any,
      });

      setIsViewOpen(false);
      return true;
    } catch {
      return false;
    }
  };

  const chartData = (appointmentStatuses || []).map((stat) => {
    const count = allStatusCounts?.find((s) => s.id === stat.id)?.count || 0;

    let key: keyof typeof chartConfig = "noShow";

    if (stat.name.toLowerCase() === "pending") key = "pending";
    else if (stat.name.toLowerCase() === "scheduled") key = "scheduled";
    else if (stat.name.toLowerCase() === "completed") key = "completed";
    else if (stat.name.toLowerCase() === "cancelled") key = "cancelled";
    else if (stat.name.toLowerCase() === "rejected") key = "rejected";
    else if (stat.name.toLowerCase() === "rescheduled") key = "rescheduled";

    return {
      status: stat.name,
      count,
      fill: chartConfig[key].color,
    };
  });

  return (
    <div className="max-w-8xl mx-auto px-4 py-2 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-blue-500/10 border border-blue-300 shadow-sm rounded-lg p-4">
        <p className="text-sm text-blue-600 dark:text-blue-300">
          <strong>Note:</strong> Students request appointments in their portal.
          This page is for approving, rejecting, or managing appointment
          requests.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-stretch">
        <Card className="lg:col-span-6 border border-border bg-background/80 shadow-sm overflow-hidden">
          <div className="border-b border-border bg-muted/45 px-6 py-5">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Appointment Overview
            </h2>
          </div>

          <CardContent className="p-5 flex flex-col min-h-[250px]">
            <p className="text-sm text-muted-foreground mb-4">
              Current appointment status distribution
            </p>

            <div className="rounded-2xl border border-border bg-background/90 px-2 py-3 sm:px-3">
              <div className="h-[236px]">
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <BarChart
                    layout="vertical"
                    accessibilityLayer
                    data={chartData}
                    margin={{ top: 4, right: 8, left: 0, bottom: 2 }}
                    barCategoryGap="16%"
                  >
                    <CartesianGrid
                      horizontal
                      vertical={false}
                      strokeDasharray="3 3"
                      stroke="rgba(148,163,184,0.10)"
                    />

                    <XAxis
                      type="number"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 10, fill: "#94a3b8" }}
                      allowDecimals={false}
                    />

                    <YAxis
                      type="category"
                      dataKey="status"
                      tickLine={false}
                      axisLine={false}
                      width={88}
                      interval={0}
                      tickMargin={6}
                      tick={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }}
                    />

                    <Bar
                      dataKey="count"
                      radius={[999, 999, 999, 999]}
                      maxBarSize={18}
                    >
                      {chartData.map((item) => (
                        <Cell key={item.status} fill={item.fill} />
                      ))}

                      <LabelList
                        dataKey="count"
                        position="right"
                        offset={8}
                        className="fill-foreground"
                        fontSize={11}
                      />
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {chartData.map((item) => (
                  <div
                    key={item.status}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1"
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: item.fill }}
                    />
                    <span
                      className="text-[11px] font-semibold"
                      style={{ color: item.fill }}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 h-full">
          <AppointmentCalendar
            title="Appointments Calendar"
            className="col-span-1 h-full"
            currentMonth={currentMonth}
            selectedDate={selectedDate}
            onMonthChange={setCurrentMonth}
            onDateSelect={(date) => {
              if (!date) return;

              const dateStr = `${date.getFullYear()}-${String(
                date.getMonth() + 1,
              ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

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
        </div>

        <div className="lg:col-span-4 h-full">
          <AppointmentsList
            title={`Appointment List - ${
              selectedDate ? selectedDate.toDateString() : "All Dates"
            }`}
            className="col-span-1 h-full"
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
            totalPages={totalPages}
            isLoading={isLoading}
          />
        </div>
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