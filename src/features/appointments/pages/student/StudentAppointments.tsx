import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  Plus,
  Tag,
  MoreHorizontal,
  Eye,
  X,
  CalendarX,
  ClipboardCheck,
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
import { Pagination } from "@/components/shared";
import { format12HourTime } from "../../utils";
import { usePageMetadata } from "@/components/layout/Layout";

const GLASS_CARD =
  "overflow-hidden rounded-[18px] border border-white/20 bg-white/45 shadow-[0_8px_22px_rgba(15,23,42,0.06)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]";

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

  const { data, isLoading: isAppointmentsLoading } = useAppointments({
    isMe: true,
    params: {
      page: currentPage,
      statusId: selectedStatus?.id === 0 ? undefined : selectedStatus?.id,
    },
  });

  const { data: appointmentStats, isLoading: isStatsLoading } =
    useAppointmentsStats({});

  const isLoading = isAppointmentsLoading || isStatsLoading;

  usePageMetadata({
    title: "My Appointments",
    description: "View and manage your counseling appointments",
    badgeText: "Appointments",
    badgeIcon: <Calendar className="h-4 w-4" />,
    isLoading,
    headerActions: (
      <Button asChild className="h-10 gap-2 rounded-xl shadow-lg shadow-primary/20">
        <Link to="/student/appointments/schedule">
          <Plus className="h-4 w-4" />
          New Appointment
        </Link>
      </Button>
    ),
  });

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

  const getStatusColor = (colorKey: string) => {
    const key = colorKey as keyof typeof STATUS_COLORS;
    return STATUS_COLORS[key] || STATUS_COLORS.secondary;
  };

  const getStatAccent = (colorKey: string) => {
    switch (colorKey) {
      case "warning":
      case "yellow":
        return "from-amber-500/15 to-yellow-500/5 text-amber-700 dark:text-amber-300 border-amber-500/20";
      case "info":
      case "blue":
        return "from-blue-500/15 to-sky-500/5 text-blue-700 dark:text-blue-300 border-blue-500/20";
      case "success":
      case "green":
        return "from-emerald-500/15 to-green-500/5 text-emerald-700 dark:text-emerald-300 border-emerald-500/20";
      case "danger":
      case "red":
        return "from-rose-500/15 to-red-500/5 text-rose-700 dark:text-rose-300 border-rose-500/20";
      case "purple":
      case "violet":
        return "from-violet-500/15 to-fuchsia-500/5 text-violet-700 dark:text-violet-300 border-violet-500/20";
      default:
        return "from-slate-500/15 to-slate-500/5 text-slate-700 dark:text-slate-300 border-slate-500/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-7">
        {appointmentStatuses.map((stat: AppointmentStatus, index: number) => {
          const count =
            statusCounts?.find((s) => String(s.id) === String(stat.id))?.count || 0;

          return (
            <Card
              key={stat.id}
              className="group animate-fade-in-up overflow-hidden rounded-[18px] border border-white/20 bg-white/45 shadow-[0_8px_22px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/[0.04]"
              style={{
                animationDelay: `${0.05 * (index + 1)}s`,
                animationFillMode: "both",
              }}
            >
              <CardContent className="p-0">
                <div
                  className={`${STATUS_COLORS[stat.colorKey]} flex items-start justify-between gap-3 rounded-[18px] px-4 py-4`}
                >
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                      {stat.name}
                    </p>
                    <p className="text-2xl font-bold tracking-tight tabular-nums text-foreground">
                      {count}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/30 bg-white/50 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.06]">
                    <ClipboardCheck className="h-5 w-5 text-foreground/80" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* Main Content Card */}
      <Card className={`${GLASS_CARD} animate-fade-in-up`}>
        {/* Filter Tabs */}
        <CardHeader className="border-b border-white/20 px-4 py-3 dark:border-white/10">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide sm:pb-0">
            {filterStatuses?.map((filter: AppointmentStatus) => {
              const isActive = selectedStatus.id === filter.id;
              const count =
                filter.id === 0
                  ? statusCounts.reduce((sum, item) => sum + (item.count || 0), 0)
                  : statusCounts?.find((s) => s.id === filter.id)?.count || 0;

              return (
                <Button
                  key={filter.id}
                  onClick={() => {
                    setSelectedStatus(filter);
                    setCurrentPage(1);
                  }}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className={`flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl px-3 text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? "shadow-md shadow-primary/20"
                      : "hover:bg-white/60 dark:hover:bg-white/[0.06]"
                  }`}
                >
                  <span>{filter.name}</span>
                  <Badge
                    className={`flex h-5 min-w-[20px] items-center justify-center px-1.5 text-[10px] font-bold ${
                      isActive
                        ? "bg-primary-foreground/40 text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {count}
                  </Badge>
                </Button>
              );
            })}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {appointments.length > 0 ? (
            <>
              {/* Appointments List */}
              <div className="divide-y divide-white/20 dark:divide-white/10">
                {appointments.map((appointment: Appointment, index: number) => (
                  <div
                    key={appointment.id}
                    className="animate-fade-in-up p-4 transition-colors duration-200 hover:bg-white/35 dark:hover:bg-white/[0.03] sm:p-5"
                    style={{
                      animationDelay: `${0.04 * (index + 1)}s`,
                      animationFillMode: "both",
                    }}
                  >
                    <div className="flex items-start gap-4">
                      {/* Date Badge */}
                      <div className="hidden h-20 w-20 shrink-0 flex-col items-center justify-center rounded-[18px] border border-white/20 bg-white/50 shadow-[0_8px_22px_rgba(15,23,42,0.05)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04] sm:flex">
                        <div className="mb-1 text-xs font-semibold uppercase text-primary">
                          {new Date(appointment.whenDate).toLocaleDateString("en-US", {
                            month: "short",
                          })}
                        </div>
                        <div className="text-2xl font-bold text-primary">
                          {new Date(appointment.whenDate).getDate()}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge
                                variant="outline"
                                className="border-white/30 bg-white/60 text-xs font-medium backdrop-blur-md dark:border-white/10 dark:bg-white/[0.05]"
                              >
                                <Tag className="mr-1 h-3 w-3" />
                                {appointment.appointmentCategory.name}
                              </Badge>

                              <Badge
                                className={`text-xs ${getStatusColor(
                                  appointment.status?.colorKey || "",
                                )} hover:opacity-90`}
                              >
                                {appointment.status?.name}
                              </Badge>
                            </div>

                            <p className="line-clamp-2 text-sm font-medium text-foreground">
                              {appointment.reason}
                            </p>
                          </div>

                          {/* Actions Dropdown */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 shrink-0 rounded-xl hover:bg-white/60 dark:hover:bg-white/[0.06]"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="rounded-xl border-white/20 bg-white/85 backdrop-blur-xl dark:border-white/10 dark:bg-[#111]/80"
                            >
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              {appointment.status?.name === "Pending" && (
                                <DropdownMenuItem className="text-destructive">
                                  <X className="mr-2 h-4 w-4" />
                                  Cancel
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Date & Time Info */}
                        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            <span className="sm:hidden">
                              {formatDate(appointment.whenDate)}
                            </span>
                            <span className="hidden sm:inline">
                              {new Date(appointment.whenDate).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                },
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            {format12HourTime(appointment.timeSlot.time)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="bg-white/20 dark:bg-white/10" />

              <Pagination
                currentPage={currentPage}
                totalPages={data?.totalPages || 1}
                onPageChange={(page) => setCurrentPage(page)}
                className="mt-0 border-t-0 px-4 py-3"
              />
            </>
          ) : (
            <>
              {/* Empty State */}
              <div className="px-4 py-10 sm:px-6 sm:py-12">
                <div className="mx-auto flex max-w-md flex-col items-center text-center">
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-white/60 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.05]">
                    <CalendarX className="h-9 w-9 text-muted-foreground" />
                  </div>

                  <h3 className="mb-2 text-xl font-semibold text-foreground">
                    No appointments found
                  </h3>

                  <p className="mb-6 text-sm text-muted-foreground">
                    {selectedStatus.id === 0
                      ? "You haven't scheduled any appointments yet. Book your first counseling session now."
                      : `No ${selectedStatus.name.toLowerCase()} appointments found.`}
                  </p>

                  {selectedStatus.id === 0 && (
                    <Button
                      asChild
                      className="rounded-xl shadow-lg shadow-primary/20"
                    >
                      <Link to="/student/appointments/schedule">
                        <Plus className="mr-2 h-4 w-4" />
                        Schedule Appointment
                      </Link>
                    </Button>
                  )}
                </div>
              </div>

              <Separator className="bg-white/20 dark:bg-white/10" />

              <Pagination
                currentPage={currentPage}
                totalPages={data?.totalPages || 1}
                onPageChange={(page) => setCurrentPage(page)}
                className="mt-0 border-t-0 px-4 py-3"
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}