import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  Ban,
  Calendar,
  CalendarClock,
  CalendarDays,
  CalendarX,
  CheckCircle2,
  Clock,
  Hourglass,
  Plus,
  RotateCcw,
  Tag,
  UserX,
  XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { STATUS_COLORS } from "@/config/constants";
import {
  Appointment,
  AppointmentStatus,
  useAppointments,
} from "@/features/appointments";
import { useStatuses } from "@/features/appointments/hooks/useLookups";
import type { StatusCount } from "@/features/appointments/types";
import { useAppointmentsStats } from "@/features/appointments/hooks/useAppointments";
import { Pagination, Spinner } from "@/components/shared";
import { format12HourTime } from "@/features/appointments/utils";
import { useAuth, usePageMetadata } from "@/context";
import { cn } from "@/lib/utils";

const GLASS_CARD =
  "overflow-hidden rounded-[18px] border border-white/55 bg-white/40 shadow-[0_10px_26px_rgba(15,23,42,0.055)] backdrop-blur-2xl backdrop-saturate-150 dark:border-white/10 dark:bg-white/[0.045] dark:shadow-[0_10px_26px_rgba(0,0,0,0.24)]";

const GLASS_INNER =
  "border border-white/55 bg-white/45 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.055]";

const ACTION_REQUIRED_ALERT =
  "animate-fade-in-up rounded-[18px] border border-rose-400/45 bg-rose-50/80 px-5 py-4 text-rose-600 shadow-[0_10px_26px_rgba(244,63,94,0.08)] backdrop-blur-xl dark:border-rose-500/25 dark:bg-rose-500/10 dark:text-rose-400 [&>svg]:!left-5 [&>svg]:!top-5 [&>svg~*]:!pl-8";

const ALL_APPOINTMENT_STATUS: AppointmentStatus = {
  id: 0,
  name: "All",
  colorKey: "stale",
};

type StatusCardMeta = {
  icon: LucideIcon;
  label: string;
  card: string;
  glow: string;
  iconBox: string;
};

const STATUS_CARD_META: Record<string, StatusCardMeta> = {
  pending: {
    icon: Hourglass,
    label: "text-amber-700/90 dark:text-amber-200",
    card: "border-amber-300/30 bg-gradient-to-br from-amber-50/55 via-white/35 to-white/25 shadow-amber-100/20 dark:border-amber-400/15 dark:from-amber-400/5 dark:via-white/[0.035] dark:to-white/[0.02]",
    glow: "bg-amber-200/20 dark:bg-amber-400/10",
    iconBox:
      "border-amber-300/30 bg-amber-50/45 text-amber-700 dark:border-amber-400/15 dark:bg-amber-400/10 dark:text-amber-200",
  },
  scheduled: {
    icon: CalendarClock,
    label: "text-sky-700/90 dark:text-sky-200",
    card: "border-sky-300/30 bg-gradient-to-br from-sky-50/55 via-white/35 to-white/25 shadow-sky-100/20 dark:border-sky-400/15 dark:from-sky-400/5 dark:via-white/[0.035] dark:to-white/[0.02]",
    glow: "bg-sky-200/20 dark:bg-sky-400/10",
    iconBox:
      "border-sky-300/30 bg-sky-50/45 text-sky-700 dark:border-sky-400/15 dark:bg-sky-400/10 dark:text-sky-200",
  },
  completed: {
    icon: CheckCircle2,
    label: "text-emerald-700/90 dark:text-emerald-200",
    card: "border-emerald-300/30 bg-gradient-to-br from-emerald-50/55 via-white/35 to-white/25 shadow-emerald-100/20 dark:border-emerald-400/15 dark:from-emerald-400/5 dark:via-white/[0.035] dark:to-white/[0.02]",
    glow: "bg-emerald-200/20 dark:bg-emerald-400/10",
    iconBox:
      "border-emerald-300/30 bg-emerald-50/45 text-emerald-700 dark:border-emerald-400/15 dark:bg-emerald-400/10 dark:text-emerald-200",
  },
  cancelled: {
    icon: XCircle,
    label: "text-rose-700/90 dark:text-rose-200",
    card: "border-rose-300/30 bg-gradient-to-br from-rose-50/55 via-white/35 to-white/25 shadow-rose-100/20 dark:border-rose-400/15 dark:from-rose-400/5 dark:via-white/[0.035] dark:to-white/[0.02]",
    glow: "bg-rose-200/20 dark:bg-rose-400/10",
    iconBox:
      "border-rose-300/30 bg-rose-50/45 text-rose-700 dark:border-rose-400/15 dark:bg-rose-400/10 dark:text-rose-200",
  },
  rejected: {
    icon: Ban,
    label: "text-red-700/90 dark:text-red-200",
    card: "border-red-300/30 bg-gradient-to-br from-red-50/55 via-white/35 to-white/25 shadow-red-100/20 dark:border-red-400/15 dark:from-red-400/5 dark:via-white/[0.035] dark:to-white/[0.02]",
    glow: "bg-red-200/20 dark:bg-red-400/10",
    iconBox:
      "border-red-300/30 bg-red-50/45 text-red-700 dark:border-red-400/15 dark:bg-red-400/10 dark:text-red-200",
  },
  rescheduled: {
    icon: RotateCcw,
    label: "text-violet-700/90 dark:text-violet-200",
    card: "border-violet-300/30 bg-gradient-to-br from-violet-50/55 via-white/35 to-white/25 shadow-violet-100/20 dark:border-violet-400/15 dark:from-violet-400/5 dark:via-white/[0.035] dark:to-white/[0.02]",
    glow: "bg-violet-200/20 dark:bg-violet-400/10",
    iconBox:
      "border-violet-300/30 bg-violet-50/45 text-violet-700 dark:border-violet-400/15 dark:bg-violet-400/10 dark:text-violet-200",
  },
  "no-show": {
    icon: UserX,
    label: "text-slate-700/90 dark:text-slate-200",
    card: "border-slate-300/35 bg-gradient-to-br from-slate-50/65 via-white/35 to-white/25 shadow-slate-100/20 dark:border-slate-400/15 dark:from-slate-400/5 dark:via-white/[0.035] dark:to-white/[0.02]",
    glow: "bg-slate-200/20 dark:bg-slate-400/10",
    iconBox:
      "border-slate-300/35 bg-slate-50/55 text-slate-700 dark:border-slate-400/15 dark:bg-slate-400/10 dark:text-slate-200",
  },
  default: {
    icon: CalendarDays,
    label: "text-primary/90 dark:text-white",
    card: "border-primary/20 bg-gradient-to-br from-primary/10 via-white/35 to-white/25 shadow-primary/10 dark:border-white/10 dark:from-white/[0.055] dark:via-white/[0.035] dark:to-white/[0.02]",
    glow: "bg-primary/15 dark:bg-white/10",
    iconBox:
      "border-primary/20 bg-primary/10 text-primary dark:border-white/10 dark:bg-white/[0.055] dark:text-white",
  },
};

const getStatusKey = (name?: string) => {
  const normalized = (name || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");

  if (normalized === "canceled") return "cancelled";
  if (normalized === "noshow" || normalized === "no-show") return "no-show";

  return normalized;
};

const getStatusCardMeta = (name?: string) => {
  const key = getStatusKey(name);
  return STATUS_CARD_META[key] || STATUS_CARD_META.default;
};

export default function StudentAppointments() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: appointmentStatuses = [], isLoading: isStatusesLoading } =
    useStatuses();

  const filterStatuses = useMemo(
    () => [ALL_APPOINTMENT_STATUS, ...appointmentStatuses],
    [appointmentStatuses],
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<AppointmentStatus>(
    ALL_APPOINTMENT_STATUS,
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

  const appointments = data?.appointments || [];
  const statusCounts = appointmentStats || ([] as StatusCount[]);
  const isGlobalLoading = isStatsLoading || isStatusesLoading;

  const pageBadgeIcon = useMemo(() => <Calendar className="h-4 w-4" />, []);

  const pageHeaderActions = useMemo(
    () => (
      <Button
        asChild={!!user?.studentCorUrl}
        disabled={!user?.studentCorUrl}
        className="h-10 gap-2 rounded-xl shadow-lg shadow-primary/15"
        title={
          !user?.studentCorUrl
            ? "Please upload your COR in your profile to book an appointment"
            : ""
        }
        onClick={(e) => {
          if (!user?.studentCorUrl) {
            e.preventDefault();
          }
        }}
      >
        {user?.studentCorUrl ? (
          <Link to="/student/appointments/schedule">
            <Plus className="h-4 w-4" />
            New Appointment
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <Plus className="h-4 w-4 opacity-50" />
            New Appointment
          </div>
        )}
      </Button>
    ),
    [user?.studentCorUrl],
  );

  usePageMetadata({
    title: "My Appointments",
    description: "View and manage your counseling appointments",
    badgeText: "Appointments",
    badgeIcon: pageBadgeIcon,
    isLoading: isGlobalLoading,
    headerActions: pageHeaderActions,
  });

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

  return (
    <div className="relative isolate space-y-6 overflow-visible">
      <div className="pointer-events-none absolute -left-24 -top-24 -z-10 h-72 w-72 rounded-full bg-slate-300/10 blur-3xl dark:bg-slate-500/10" />
      <div className="pointer-events-none absolute right-0 top-10 -z-10 h-80 w-80 rounded-full bg-primary/5 blur-3xl dark:bg-primary/10" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 -z-10 h-72 w-72 rounded-full bg-sky-200/10 blur-3xl dark:bg-sky-400/10" />

      {!user?.studentCorUrl && (
        <Alert variant="destructive" className={ACTION_REQUIRED_ALERT}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="text-base font-medium">
            Action Required: Missing Certificate of Registration
          </AlertTitle>
          <AlertDescription className="text-sm">
            You need to upload your COR before you can book appointments.{" "}
            <Link
              to="/student/cor-management"
              className="font-semibold underline hover:text-rose-700 dark:hover:text-rose-300"
            >
              Go to COR Management
            </Link>
          </AlertDescription>
        </Alert>
      )}

      <section className="overflow-x-auto pb-1">
        <div
          className="grid min-w-[1180px] gap-4 xl:min-w-0"
          style={{
            gridTemplateColumns: `repeat(${Math.max(
              appointmentStatuses.length,
              1,
            )}, minmax(150px, 1fr))`,
          }}
        >
          {appointmentStatuses.map((stat: AppointmentStatus, index: number) => {
            const count =
              statusCounts?.find((s) => String(s.id) === String(stat.id))
                ?.count || 0;

            const statusMeta = getStatusCardMeta(stat.name);
            const StatusIcon = statusMeta.icon;

            return (
              <Card
                key={stat.id}
                className={cn(
                  GLASS_CARD,
                  "animate-fade-in-up group relative h-[124px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(15,23,42,0.075)]",
                  statusMeta.card,
                )}
                style={{
                  animationDelay: `${0.05 * (index + 1)}s`,
                  animationFillMode: "both",
                }}
              >
                <div
                  className={cn(
                    "pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full blur-2xl",
                    statusMeta.glow,
                  )}
                />

                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/70 dark:bg-white/15" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white/28 to-transparent dark:from-black/15" />

                <CardContent className="relative flex h-full flex-col justify-between p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p
                        title={stat.name}
                        className={cn(
                          "whitespace-nowrap text-[11px] font-extrabold uppercase tracking-[0.18em]",
                          statusMeta.label,
                        )}
                      >
                        {stat.name}
                      </p>

                      <p className="mt-1 whitespace-nowrap text-[11px] font-medium text-muted-foreground/75">
                        Appointment status
                      </p>
                    </div>

                    <div
                      className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] transition-transform duration-300 group-hover:scale-105",
                        statusMeta.iconBox,
                      )}
                    >
                      <StatusIcon className="h-5 w-5" strokeWidth={2} />
                    </div>
                  </div>

                  <div className="flex items-end justify-between gap-3">
                    <p className="text-[34px] font-black leading-none tracking-tight text-foreground tabular-nums">
                      {count}
                    </p>

                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground/85",
                        GLASS_INNER,
                      )}
                    >
                      Total
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <Card className={cn(GLASS_CARD, "animate-fade-in-up")}>
        <CardHeader className="border-b border-white/30 px-4 py-3 dark:border-white/10">
          <div className="scrollbar-hide flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {filterStatuses?.map((filter: AppointmentStatus) => {
              const isActive = selectedStatus.id === filter.id;
              const count =
                filter.id === 0
                  ? statusCounts.reduce(
                      (sum, item) => sum + (item.count || 0),
                      0,
                    )
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
                  className={cn(
                    "flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl px-3 text-xs font-medium transition-all duration-200",
                    isActive
                      ? "shadow-md shadow-primary/15"
                      : "hover:bg-white/40 dark:hover:bg-white/[0.06]",
                  )}
                >
                  <span>{filter.name}</span>
                  <Badge
                    className={cn(
                      "flex h-5 min-w-[20px] items-center justify-center px-1.5 text-[10px] font-bold",
                      isActive
                        ? "bg-primary-foreground/35 text-primary-foreground"
                        : "bg-white/45 text-muted-foreground backdrop-blur-xl dark:bg-white/[0.07]",
                    )}
                  >
                    {count}
                  </Badge>
                </Button>
              );
            })}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isAppointmentsLoading ? (
            <div className="flex items-center justify-center py-16">
              <Spinner size="md" message="Loading your appointments..." />
            </div>
          ) : appointments.length > 0 ? (
            <>
              <div className="divide-y divide-white/25 dark:divide-white/10">
                {appointments.map((appointment: Appointment, index: number) => (
                  <div
                    key={appointment.id}
                    className="animate-fade-in-up cursor-pointer p-4 transition-colors duration-200 hover:bg-white/30 dark:hover:bg-white/[0.035] sm:p-5"
                    style={{
                      animationDelay: `${0.04 * (index + 1)}s`,
                      animationFillMode: "both",
                    }}
                    onClick={() =>
                      navigate(`/student/appointments/${appointment.id}`)
                    }
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          "hidden h-20 w-20 shrink-0 flex-col items-center justify-center rounded-[18px] sm:flex",
                          GLASS_INNER,
                        )}
                      >
                        <div className="mb-1 text-xs font-semibold uppercase text-primary">
                          {new Date(appointment.whenDate).toLocaleDateString(
                            "en-US",
                            { month: "short" },
                          )}
                        </div>

                        <div className="text-2xl font-bold text-primary">
                          {new Date(appointment.whenDate).getDate()}
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge
                                variant="outline"
                                className="border-white/45 bg-white/40 text-xs font-medium backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.05]"
                              >
                                <Tag className="mr-1 h-3 w-3" />
                                {appointment.appointmentCategory.name}
                              </Badge>

                              <Badge
                                className={cn(
                                  "text-xs hover:opacity-90",
                                  getStatusColor(
                                    appointment.status?.colorKey || "",
                                  ),
                                )}
                              >
                                {appointment.status?.name}
                              </Badge>
                            </div>

                            <p className="line-clamp-2 text-sm font-medium text-foreground">
                              {appointment.reason}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
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
                            <Clock className="h-3.5 w-3.5" />
                            {format12HourTime(appointment.timeSlot.time)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="bg-white/25 dark:bg-white/10" />

              <Pagination
                currentPage={currentPage}
                totalPages={data?.totalPages || 1}
                onPageChange={(page) => setCurrentPage(page)}
                className="mt-0 border-t-0 px-4 py-3"
              />
            </>
          ) : (
            <>
              <div className="px-4 py-10 sm:px-6 sm:py-12">
                <div className="mx-auto flex max-w-md flex-col items-center text-center">
                  <div
                    className={cn(
                      "mb-4 flex h-20 w-20 items-center justify-center rounded-full",
                      GLASS_INNER,
                    )}
                  >
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
                      asChild={!!user?.studentCorUrl}
                      disabled={!user?.studentCorUrl}
                      className="rounded-xl shadow-lg shadow-primary/15"
                      title={
                        !user?.studentCorUrl
                          ? "Please upload your COR in your profile to book an appointment"
                          : ""
                      }
                      onClick={(e) => {
                        if (!user?.studentCorUrl) {
                          e.preventDefault();
                        }
                      }}
                    >
                      {user?.studentCorUrl ? (
                        <Link to="/student/appointments/schedule">
                          <Plus className="mr-2 h-4 w-4" />
                          Schedule Appointment
                        </Link>
                      ) : (
                        <div className="flex items-center">
                          <Plus className="mr-2 h-4 w-4 opacity-50" />
                          Schedule Appointment
                        </div>
                      )}
                    </Button>
                  )}
                </div>
              </div>

              <Separator className="bg-white/25 dark:bg-white/10" />

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