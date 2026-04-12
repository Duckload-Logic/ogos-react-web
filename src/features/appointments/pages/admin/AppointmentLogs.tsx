import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "@/hooks/useDebounce";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { useAppointments, useAppointmentsStats } from "../../hooks";
import type { Appointment, StatusCount } from "../../types";
import { AppointmentList } from "../../components";
import { STATUS_COLORS } from "@/config/constants";
import {
  getMonthsList,
  getYearsList,
  getMonthRange,
} from "../../utils/dateFilters";
import { Dropdown } from "@/components/form";
import { usePageMetadata } from "@/components/layout/Layout";

export default function AppointmentLogs() {
  const navigate = useNavigate();

  // Memoize year and month lists to keep them stable across renders
  const monthsList = useMemo(() => getMonthsList(), []);
  const yearsList = useMemo(() => getYearsList(), []);

  // State for Year/Month filtering
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState<{
    id: number;
    name: string;
  }>(() => {
    const found = yearsList.find(
      (y) => y.name === String(currentDate.getFullYear()),
    );
    return found || yearsList[0];
  });
  const [selectedMonth, setSelectedMonth] = useState<{
    id: number;
    name: string;
  }>(() => {
    const found = monthsList.find((m) => m.id === currentDate.getMonth() + 1);
    return found || monthsList[0];
  });

  // Handle year/month selection from Dropdown
  const handleYearChange = (yearId: number) => {
    const year = yearsList.find((y) => y.id === yearId);
    if (year) setSelectedYear(year);
  };

  const handleMonthChange = (monthId: number) => {
    const month = monthsList.find((m) => m.id === monthId);
    if (month) setSelectedMonth(month);
  };

  // State for other filters
  const [statusFilter, setStatusFilter] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearch = useDebounce(searchTerm, 500);

  // Get date range from selected year/month
  const dateRange = useMemo(() => {
    const year = parseInt(selectedYear.name);
    const month = selectedMonth.id;
    return getMonthRange(year, month);
  }, [selectedYear, selectedMonth]);

  // Fetch logs with year/month and other filters
  const { data, isLoading } = useAppointments({
    isMe: false,
    params: {
      page: currentPage,
      statusId: statusFilter !== 0 ? statusFilter : undefined,
      search: debouncedSearch,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    },
  });

  const { data: appointmentStats = [], isLoading: isStatsLoading } =
    useAppointmentsStats({
      params: {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      },
    });

  const appointmentStatusesWithAll = useMemo(() => {
    const totalCount = (appointmentStats ?? []).reduce(
      (sum: number, stat: any) => sum + (stat.count || 0),
      0,
    );

    return [
      {
        id: 0,
        name: "All Status",
        colorKey: "stale" as const,
        count: totalCount,
      },
      ...appointmentStats.map(stat => ({
        ...stat,
        colorKey: (stat.name.toLowerCase() === "pending" ? "pending" :
          stat.name.toLowerCase() === "scheduled" ? "scheduled" :
            stat.name.toLowerCase() === "completed" ? "completed" :
              stat.name.toLowerCase() === "cancelled" ? "cancelled" :
                stat.name.toLowerCase() === "rejected" ? "rejected" :
                  stat.name.toLowerCase() === "rescheduled" ? "rescheduled" :
                    "stale") as keyof typeof STATUS_COLORS
      })),
    ];
  }, [appointmentStats]);

  // Extract appointments and total pages from response
  const appointments = data?.appointments || [];
  const totalPages = data?.totalPages || 1;

  // Handle actions
  const handleViewAppointment = (apt: Appointment) => {
    navigate(`/admin/appointments/${apt.id}`);
  };

  const isPageLoading = isLoading || isStatsLoading;

  usePageMetadata({
    title: "Appointment Logs",
    description: "Historical record of all counseling sessions with date and status filters",
    badgeText: "Audit Trail",
    badgeIcon: <Calendar className="h-4 w-4" />,
    isLoading: isPageLoading,
  });

  const currentSelectedStatus = useMemo(() => {
    return appointmentStatusesWithAll.find(s => s.id === statusFilter) || appointmentStatusesWithAll[0];
  }, [appointmentStatusesWithAll, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <Card className="border-glass-border bg-glass-bg/40 shadow-2xl backdrop-blur-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Filter by Date
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Dropdown
              label="Year"
              options={yearsList}
              value={selectedYear.id}
              onChange={handleYearChange}
            />
            <Dropdown
              label="Month"
              options={monthsList}
              value={selectedMonth.id}
              onChange={handleMonthChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      <AppointmentList
        title="Session Archives"
        appointments={appointments}
        isLoading={isLoading}
        onViewClick={handleViewAppointment}
        searchTerm={searchTerm}
        onSearchChange={(value: string) => {
          setSearchTerm(value);
          setCurrentPage(1);
        }}
        statuses={appointmentStatusesWithAll as any}
        selectedStatus={currentSelectedStatus as any}
        statusCounts={appointmentStats}
        onStatusChange={(status) => {
          setStatusFilter(status.id);
          setCurrentPage(1);
        }}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        totalPages={totalPages}
      />
    </div>
  );
}
