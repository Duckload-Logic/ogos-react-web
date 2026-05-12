import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, Plus, Tag, CalendarX } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
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
  "overflow-hidden rounded-[18px] border border-white/20 bg-white/45 shadow-[0_8px_22px_rgba(15,23,42,0.06)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]";

const STATUS_CARD_META = {
  pending: {
    emoji: "⏳",
    label: "text-amber-700 dark:text-amber-200",
    card: "border-amber-200/80 bg-gradient-to-br from-amber-100/80 via-white/65 to-yellow-100/70 shadow-amber-200/30 dark:border-amber-400/20 dark:from-amber-950/55 dark:via-zinc-900 dark:to-zinc-950 dark:shadow-[0_10px_24px_rgba(0,0,0,0.35)]",
    glow: "bg-amber-300/35 dark:bg-amber-400/10",
  },
  scheduled: {
    emoji: "📅",
    label: "text-sky-700 dark:text-sky-200",
    card: "border-sky-200/80 bg-gradient-to-br from-sky-100/80 via-white/65 to-blue-100/70 shadow-sky-200/30 dark:border-sky-400/20 dark:from-sky-950/55 dark:via-zinc-900 dark:to-zinc-950 dark:shadow-[0_10px_24px_rgba(0,0,0,0.35)]",
    glow: "bg-sky-300/35 dark:bg-sky-400/10",
  },
  completed: {
    emoji: "✅",
    label: "text-emerald-700 dark:text-emerald-200",
    card: "border-emerald-200/80 bg-gradient-to-br from-emerald-100/80 via-white/65 to-green-100/70 shadow-emerald-200/30 dark:border-emerald-400/20 dark:from-emerald-950/55 dark:via-zinc-900 dark:to-zinc-950 dark:shadow-[0_10px_24px_rgba(0,0,0,0.35)]",
    glow: "bg-emerald-300/35 dark:bg-emerald-400/10",
  },
  cancelled: {
    emoji: "❌",
    label: "text-rose-700 dark:text-rose-200",
    card: "border-rose-200/80 bg-gradient-to-br from-rose-100/80 via-white/65 to-red-100/70 shadow-rose-200/30 dark:border-rose-400/20 dark:from-rose-950/55 dark:via-zinc-900 dark:to-zinc-950 dark:shadow-[0_10px_24px_rgba(0,0,0,0.35)]",
    glow: "bg-rose-300/35 dark:bg-rose-400/10",
  },
  rejected: {
    emoji: "🚫",
    label: "text-red-700 dark:text-red-200",
    card: "border-red-200/80 bg-gradient-to-br from-red-100/80 via-white/65 to-rose-100/70 shadow-red-200/30 dark:border-red-400/20 dark:from-red-950/55 dark:via-zinc-900 dark:to-zinc-950 dark:shadow-[0_10px_24px_rgba(0,0,0,0.35)]",
    glow: "bg-red-300/35 dark:bg-red-400/10",
  },
  rescheduled: {
    emoji: "🔁",
    label: "text-violet-700 dark:text-violet-200",
    card: "border-violet-200/80 bg-gradient-to-br from-violet-100/80 via-white/65 to-purple-100/70 shadow-violet-200/30 dark:border-violet-400/20 dark:from-violet-950/55 dark:via-zinc-900 dark:to-zinc-950 dark:shadow-[0_10px_24px_rgba(0,0,0,0.35)]",
    glow: "bg-violet-300/35 dark:bg-violet-400/10",
  },
  "no-show": {
    emoji: "🚷",
    label: "text-slate-700 dark:text-slate-200",
    card: "border-slate-200/90 bg-gradient-to-br from-slate-100/90 via-white/65 to-zinc-100/75 shadow-slate-200/30 dark:border-slate-500/20 dark:from-slate-800/65 dark:via-zinc-900 dark:to-zinc-950 dark:shadow-[0_10px_24px_rgba(0,0,0,0.35)]",
    glow: "bg-slate-300/35 dark:bg-slate-400/10",
  },
  default: {
    emoji: "🗓️",
    label: "text-primary dark:text-white",
    card: "border-primary/20 bg-gradient-to-br from-primary/10 via-white/65 to-muted/70 shadow-primary/10 dark:border-white/10 dark:from-zinc-800 dark:via-zinc-900 dark:to-zinc-950 dark:shadow-[0_10px_24px_rgba(0,0,0,0.35)]",
    glow: "bg-primary/25 dark:bg-white/10",
  },
};

const getStatusKey = (name?: string) => {
  const normalized = (name || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");

  if (normalized === "canceled") return "cancelled";
  if (normalized === "noshow" || normalized === "no-show") return "no-show";

  return normalized as keyof typeof STATUS_CARD_META;
};

const getStatusCardMeta = (name?: string) => {
  const key = getStatusKey(name);
  return STATUS_CARD_META[key] || STATUS_CARD_META.default;
};

export default function StudentAppointments() {
  const { user } = useAuth();
  const navigate = useNavigate();
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

  const isGlobalLoading = isStatsLoading;

  usePageMetadata({
    title: "My Appointments",
    description: "View and manage your counseling appointments",
    badgeText: "Appointments",
    badgeIcon: <Calendar className="h-4 w-4" />,
    isLoading: isGlobalLoading,
    headerActions: (
      <Button
        asChild={!!user?.studentCorUrl}
        disabled={!user?.studentCorUrl}
        className="h-10 gap-2 rounded-xl shadow-lg shadow-primary/20"
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

  return (
    <div className="space-y-6">
      {!user?.studentCorUrl && (
        <Alert
          variant="destructive"
          className="animate-fade-in-up border-rose-500/50 bg-rose-500/10 text-rose-600 dark:border-rose-500/30 dark:text-rose-400"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            Action Required: Missing Certificate of Registration
          </AlertTitle>
          <AlertDescription>
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
        <div className="grid min-w-[1260px] grid-cols-7 gap-4 xl:min-w-0">
          {appointmentStatuses.map((stat: AppointmentStatus, index: number) => {
            const count =
              statusCounts?.find((s) => String(s.id) === String(stat.id))
                ?.count || 0;

            const statusMeta = getStatusCardMeta(stat.name);

            return (
              <Card
                key={stat.id}
                className={cn(
                  "animate-fade-in-up group relative h-[124px] overflow-hidden rounded-[18px]",
                  "border bg-white/45 shadow-[0_10px_26px_rgba(15,23,42,0.07)] backdrop-blur-xl",
                  "transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(15,23,42,0.11)]",
                  "dark:border-white/10 dark:bg-white/[0.04]",
                  statusMeta.card,
                )}
                style={{
                  animationDelay: `${0.05 * (index + 1)}s`,
                  animationFillMode: "both",
                }}
              >
                <div
                  className={cn(
                    "pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl",
                    statusMeta.glow,
                  )}
                />

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white/45 to-transparent dark:from-black/25" />

                <CardContent className="relative flex h-full flex-col justify-between p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p
                        title={stat.name}
                        className={cn(
                          "whitespace-nowrap text-[11px] font-extrabold uppercase tracking-[0.17em]",
                          statusMeta.label,
                        )}
                      >
                        {stat.name}
                      </p>

                      <p className="mt-1 whitespace-nowrap text-[11px] font-medium text-muted-foreground/80">
                        Appointment status
                      </p>
                    </div>

                    <div
                      className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px]",
                        "border border-white/50 bg-white/60 text-[22px] shadow-sm backdrop-blur-xl",
                        "transition-transform duration-300 group-hover:scale-110",
                        "dark:border-white/10 dark:bg-white/[0.05]",
                      )}
                    >
                      <span aria-hidden="true">{statusMeta.emoji}</span>
                    </div>
                  </div>

                  <div className="flex items-end justify-between gap-3">
                    <p className="text-[34px] font-black leading-none tracking-tight text-foreground tabular-nums">
                      {count}
                    </p>

                    <span
                      className={cn(
                        "rounded-full border border-white/50 bg-white/55 px-3 py-1",
                        "text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground",
                        "shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/[0.04] dark:text-white/55",
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

      <Card className={`${GLASS_CARD} animate-fade-in-up`}>
        <CardHeader className="border-b border-white/20 px-4 py-3 dark:border-white/10">
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
          {isAppointmentsLoading ? (
            <div className="flex items-center justify-center py-16">
              <Spinner size="md" message="Loading your appointments..." />
            </div>
          ) : appointments.length > 0 ? (
            <>
              <div className="divide-y divide-white/20 dark:divide-white/10">
                {appointments.map((appointment: Appointment, index: number) => (
                  <div
                    key={appointment.id}
                    className={cn(
                      "animate-fade-in-up cursor-pointer p-4 transition-colors duration-200",
                      "hover:bg-black/5 dark:hover:bg-white/[0.03] sm:p-5",
                    )}
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
                          "hidden h-20 w-20 shrink-0 flex-col items-center",
                          "justify-center rounded-[18px] border border-white/20",
                          "bg-white/50 shadow-[0_8px_22px_rgba(15,23,42,0.05)]",
                          "backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]",
                          "sm:flex",
                        )}
                      >
                        <div className="mb-1 text-xs font-semibold uppercase text-primary">
                          {new Date(appointment.whenDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                            },
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
                                className={cn(
                                  "border-white/30 bg-white/60 text-xs font-medium",
                                  "backdrop-blur-md dark:border-white/10 dark:bg-white/[0.05]",
                                )}
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
              <div className="px-4 py-10 sm:px-6 sm:py-12">
                <div className="mx-auto flex max-w-md flex-col items-center text-center">
                  <div
                    className={cn(
                      "mb-4 flex h-20 w-20 items-center justify-center rounded-full",
                      "border border-white/20 bg-white/60 backdrop-blur-md",
                      "dark:border-white/10 dark:bg-white/[0.05]",
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
                      className="rounded-xl shadow-lg shadow-primary/20"
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