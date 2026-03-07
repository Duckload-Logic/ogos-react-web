import {
  Calendar,
  Users,
  FileText,
  TrendingUp,
  Clock,
  Tag,
  AlertTriangle,
  Sparkles,
  X,
  Inbox,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useAppointments } from "@/features/appointments/hooks/useAppointments";
import { Appointment } from "@/features/appointments/types";
import AppointmentViewModal from "@/features/appointments/components/AppointmentViewModal";
import { STATUS_COLORS } from "@/config/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStatuses } from "@/features/appointments/hooks/useLookups";
import { toISODateString } from "@/features/appointments/utils";

export default function Dashboard() {
  const today = new Date();
  const todayStr = toISODateString(today);

  const { data: statuses } = useStatuses();

  const { data } = useAppointments({
    params: {
      startDate: todayStr,
      endDate: todayStr,
    },
  });

  const appointments = data?.appointments || [];
  const nextAppointment = appointments[0] || null;

  const pendingCount = appointments.filter((a) =>
    a.status?.name?.toLowerCase().includes("pending"),
  ).length;

  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const [showDailyTip, setShowDailyTip] = useState(false);

  const tipQuotes = useMemo(
    () => [
      "Data-driven guidance is effective; check student records before each session.",
      "A short review before every session helps you guide with more confidence.",
      "Consistent follow-up turns one-time visits into meaningful student support.",
      "Clear records make every counseling session faster, smoother, and more effective.",
      "Small notes today can become valuable guidance insights tomorrow.",
      "Prepared counselors create calmer, more productive student conversations.",
    ],
    [],
  );

  const dailyTip = useMemo(() => {
    const dayIndex = new Date().getDate() % tipQuotes.length;
    return tipQuotes[dayIndex];
  }, [tipQuotes]);

  useEffect(() => {
    const todayKey = new Date().toISOString().slice(0, 10);
    const lastShownDate = localStorage.getItem("dashboard-tip-date");

    if (lastShownDate !== todayKey) {
      setShowDailyTip(true);
      localStorage.setItem("dashboard-tip-date", todayKey);
    }
  }, []);

  const handleView = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setIsViewOpen(true);
  };

  const formatTime = (time: string) => {
    const [hourStr, minute] = time.split(":");
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  };

  const quickActions = [
    {
      title: "View Appointments",
      description: "Manage requests",
      icon: Calendar,
      href: "/admin/appointments",
      border: "border-info-foreground/50",
    },
    {
      title: "Student Records",
      description: "Manage info",
      icon: Users,
      href: "/admin/student-records",
      border: "border-success-foreground/50",
    },
    {
      title: "Review Excuses",
      description: "Approve slips",
      icon: FileText,
      href: "/admin/review-excuses",
      border: "border-warning-foreground/50",
    },
    {
      title: "Reports",
      description: "Analyze data",
      icon: TrendingUp,
      href: "/admin/reports",
      border: "border-notice-foreground/50",
    },
  ];

  return (
    <div className="max-w-[1600px] mx-auto space-y-10 relative">
      {/* TIP OF THE DAY */}
      {showDailyTip && (
        <div className="fixed top-24 right-6 z-50 w-[340px] max-w-[calc(100vw-2rem)] animate-in fade-in slide-in-from-top-2 duration-300">
          <Card className="border border-rose-100 shadow-lg bg-rose-50/95 backdrop-blur">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-lg bg-white/70 text-destructive">
                    <Sparkles className="size-5" />
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-destructive">
                      Tip of the Day
                    </p>

                    <p className="text-sm font-medium italic text-slate-700 leading-relaxed">
                      "{dailyTip}"
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowDailyTip(false)}
                  className="text-muted-foreground hover:text-foreground transition"
                  aria-label="Close daily tip"
                >
                  <X className="size-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* HEADER */}
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Guidance Dashboard</h1>

        <p className="text-sm text-muted-foreground">
          {today.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </header>

      {/* TOP SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* TODAY'S LOAD */}
        <Card className="rounded-lg border border-border shadow-sm">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Today's Load
                </p>

                <p className="text-4xl font-bold tabular-nums">
                  {appointments.length}
                </p>

                <p className="text-xs text-muted-foreground">
                  Sessions scheduled today
                </p>
              </div>

              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10">
                <Calendar className="size-5 text-primary" />
              </div>
            </div>

            {pendingCount > 0 && (
              <div className="flex items-center justify-between bg-warning-foreground/10 border border-warning-foreground rounded-md px-3 py-2 text-xs">
                <div className="flex items-center gap-2">
                  <AlertTriangle
                    size={14}
                    className="text-warning-foreground"
                  />

                  <span className="font-medium">
                    {pendingCount} requests need review
                  </span>
                </div>

                <Link
                  to="/admin/appointments"
                  className="text-primary hover:underline"
                >
                  Review
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* NEXT APPOINTMENT */}
        <Card
          className="
          lg:col-span-2
          border-border
          shadow-sm
          ring-1 ring-primary/10
          bg-gradient-to-r from-card via-card to-primary/5
          "
        >
          <CardContent className="p-6">
            {nextAppointment ? (
              <div className="grid grid-cols-[1fr_auto] items-center gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-primary">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    Next session coming up
                  </div>

                  <div className="flex items-center gap-2 text-primary text-sm">
                    <Clock className="size-4" />
                    {formatTime(nextAppointment.timeSlot.time)}
                  </div>

                  <h3 className="text-xl font-bold">
                    {nextAppointment.user?.firstName}{" "}
                    {nextAppointment.user?.lastName}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Tag className="size-3" />
                    {nextAppointment.appointmentCategory.name}
                  </div>
                </div>

                <div className="flex items-center">
                  <Button
                    onClick={() => handleView(nextAppointment)}
                    className="px-6"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[96px] items-center">
                <p className="text-muted-foreground italic">
                  No upcoming appointments
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* MANAGEMENT ACTIONS */}
      <section className="space-y-5">
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
          Management Actions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                to={action.href}
                className={`
                group
                bg-card
                border-2 ${action.border}
                p-5
                rounded-lg
                transition-all
                duration-200
                hover:-translate-y-1
                hover:shadow-md
                hover:bg-primary/5
                hover:border-primary
                flex items-center gap-4
                `}
              >
                <div
                  className="
                  p-2 border rounded-md
                  transition-transform
                  group-hover:rotate-6
                  "
                >
                  <Icon size={20} />
                </div>

                <div>
                  <h3 className="font-semibold text-sm">{action.title}</h3>

                  <p className="text-xs text-muted-foreground">
                    {action.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* DAILY QUEUE */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
          Daily Queue
        </h2>

        <Card className="border-border shadow-sm overflow-hidden">
          {appointments.length > 0 ? (
            <table className="w-full text-left">
              <thead className="bg-muted/40 text-muted-foreground text-xs">
                <tr>
                  <th className="py-4 px-5">Student</th>
                  <th className="py-4 px-5">Schedule</th>
                  <th className="py-4 px-5">Category</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {appointments.map((apt) => (
                  <tr
                    key={apt.id}
                    className="
                    group
                    hover:bg-muted/30
                    transition-colors
                    cursor-pointer
                    "
                  >
                    <td className="py-5 px-5 font-semibold group-hover:text-primary relative">
                      <span
                        className="
                        absolute left-0 top-0 h-full w-1
                        bg-primary opacity-0
                        group-hover:opacity-100
                        transition
                        rounded-r
                        "
                      />

                      {apt.user?.firstName} {apt.user?.lastName}
                    </td>

                    <td className="py-5 px-5 text-muted-foreground">
                      {formatTime(apt.timeSlot.time)}
                    </td>

                    <td className="py-5 px-5 text-muted-foreground">
                      {apt.appointmentCategory.name}
                    </td>

                    <td className="py-5 px-5">
                      <span
                        className={`px-2 py-1 text-xs rounded-full border ${STATUS_COLORS[apt.status?.colorKey || "info"]}`}
                      >
                        {apt.status?.name}
                      </span>
                    </td>

                    <td className="py-5 px-5">
                      <Button
                        variant="outline"
                        size="sm"
                        className="opacity-80 group-hover:opacity-100"
                        onClick={() => handleView(apt)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <CardContent className="py-14 px-6">
              <div className="flex flex-col items-center justify-center text-center space-y-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                  <Inbox className="size-6 text-muted-foreground" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-semibold">
                    No appointments in today's queue
                  </h3>

                  <p className="text-sm text-muted-foreground max-w-md">
                    You’re all caught up for today. New appointments will appear 
                    here once scheduled.
                  </p>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </section>

      <AppointmentViewModal
        appointment={selectedAppointment}
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        statuses={statuses || []}
        onStatusAction={async () => {}}
        onReschedule={async () => {}}
        hasActions={false}
      />
    </div>
  );
}