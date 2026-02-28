import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Plus,
  Tag,
  MoreHorizontal,
  Eye,
  X,
  CalendarX,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { STATUS_COLORS } from "@/config/constants";
import {
  Appointment,
  AppointmentStatus,
  useAppointments,
} from "@/features/appointments";
import { useStatuses } from "../../hooks/useLookups";
import { StatusCount } from "../../types";
import { useAppointmentsStats } from "../../hooks/useAppointments";
import Pagination from "@/components/Pagination";

export default function StudentAppointments() {
  const { data: appointmentStatuses = [] } = useStatuses();
  const filterStatuses = [
    { id: 0, name: "All", colorKey: "stale" },
    ...appointmentStatuses,
  ];
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<AppointmentStatus>(
    filterStatuses[0],
  );

  const { data } = useAppointments({
    isMe: true,
    params: {
      page: currentPage,
      statusId: selectedStatus?.id === 0 ? undefined : selectedStatus?.id,
    },
  });
  const { data: appointmentStats } = useAppointmentsStats({});

  const appointments = data?.appointments || [];
  const statusCounts = appointmentStats || ([] as StatusCount[]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime12hr = (time24: string) => {
    const [hours, minutes] = time24.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  const getStatusColor = (colorKey: string) => {
    const key = colorKey as keyof typeof STATUS_COLORS;
    return STATUS_COLORS[key] || STATUS_COLORS.secondary;
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            My Appointments
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            View and manage your counseling appointments
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link to="/student/appointments/schedule">
            <Plus className="w-4 h-4" />
            New Appointment
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className={`grid grid-cols-2 md:grid-cols-7 gap-4`}>
        {appointmentStatuses.map((stat: AppointmentStatus) => (
          <Card
            key={stat.id}
            className={`${STATUS_COLORS[stat.colorKey]} border-0`}
          >
            <CardContent className="py-4 px-4">
              <p className="text-xs font-medium uppercase tracking-wide">
                {stat.name}
              </p>
              <p className="text-xl font-semibold text-foreground">
                {statusCounts?.find((s) => s.id === stat.id)?.count || 0}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Card */}
      <Card className="border border-border shadow-sm">
        {/* Filter Tabs */}
        <CardHeader className="border-b border-border py-3 px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {filterStatuses?.map((filter: AppointmentStatus) => (
                <button
                  key={filter.id}
                  onClick={() => {
                    setSelectedStatus(filter);
                    setCurrentPage(1);
                  }}
                  className={`
                    px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors
                    ${
                      selectedStatus.id === filter.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }
                  `}
                >
                  {filter.name} (
                  {statusCounts?.find((s) => s.id === filter.id)?.count || 0})
                </button>
              ))}
            </div>
            {/* <p className="text-sm text-muted-foreground">
              {filteredAppointments.length} appointment
              {filteredAppointments.length !== 1 ? "s" : ""}
            </p> */}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {appointments.length > 0 ? (
            <>
              {/* Appointments List */}
              <div className="divide-y divide-border">
                {appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      {/* Date Badge */}
                      <div className="hidden sm:flex flex-col items-center justify-center w-16 h-16 bg-primary/10 rounded-lg shrink-0">
                        <span className="text-xs font-medium text-primary uppercase">
                          {new Date(appointment.whenDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                            },
                          )}
                        </span>
                        <span className="text-xl font-bold text-primary">
                          {new Date(appointment.whenDate).getDate()}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge
                                variant="outline"
                                className="text-xs font-medium"
                              >
                                <Tag className="w-3 h-3 mr-1" />
                                {appointment.appointmentCategory.name}
                              </Badge>
                              <Badge
                                className={`text-xs ${getStatusColor(
                                  appointment.status?.colorKey || "",
                                )} hover:bg-primary/30`}
                              >
                                {appointment.status?.name}
                              </Badge>
                            </div>
                            <p className="text-sm text-foreground line-clamp-2">
                              {appointment.reason}
                            </p>
                          </div>

                          {/* Actions Dropdown */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="shrink-0"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              {appointment.status?.name === "Pending" && (
                                <DropdownMenuItem className="text-destructive">
                                  <X className="w-4 h-4 mr-2" />
                                  Cancel
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Date & Time Info */}
                        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span className="sm:hidden">
                              {formatDate(appointment.whenDate)}
                            </span>
                            <span className="hidden sm:inline">
                              {new Date(
                                appointment.whenDate,
                              ).toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {formatTime12hr(appointment.timeSlot.time)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={data?.totalPages || 1}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="p-4 bg-muted rounded-full mb-4">
                <CalendarX className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                No appointments found
              </h3>
              <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">
                {selectedStatus === undefined || selectedStatus.id === 0
                  ? "You haven't scheduled any appointments yet. Book your first counseling session now."
                  : `No ${selectedStatus.name.toLowerCase()} appointments found.`}
              </p>
              {selectedStatus === undefined ||
                (selectedStatus.id === 0 && (
                  <Button asChild>
                    <Link to="/student/appointments/schedule">
                      <Plus className="w-4 h-4 mr-2" />
                      Schedule Appointment
                    </Link>
                  </Button>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
