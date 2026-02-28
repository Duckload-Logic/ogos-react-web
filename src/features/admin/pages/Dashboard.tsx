import {
  Calendar,
  Users,
  FileText,
  TrendingUp,
  Eye,
  Clock,
  ChevronRight,
  Tag,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAppointments } from "@/features/appointments/hooks/useAppointments";
import { Appointment } from "@/features/appointments/types";
import AppointmentViewModal from "@/features/appointments/components/AppointmentViewModal";
import { STATUS_COLORS } from "@/config/constants";
import { Card, CardContent, Button } from "@/components";
import { useStatuses } from "@/features/appointments/hooks/useLookups";
import { toISODateString } from "@/features/appointments/utils";

export default function Dashboard() {
  const today = new Date();
  const todayStr = toISODateString(today);
  const { data: statuses } = useStatuses();

  const { data, isLoading } = useAppointments({
    params: {
      startDate: todayStr,
      endDate: todayStr,
    },
  });

  // Use real data if available, fallback to mock for preview
  const upcomingAppointments = data?.appointments || [];
  const nextAppointment = upcomingAppointments[0] || null;

  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

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
    <div className="max-w-[1600px] mx-auto space-y-8">
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Guidance Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            {today.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </header>

      {/* METRICS & NEXT APPOINTMENT */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="rounded-md border-border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Today's Load
                </p>
                <p className="text-4xl font-black">
                  {upcomingAppointments.length}
                </p>
              </div>
              <div className="p-2 bg-primary/10 rounded-md">
                <Calendar className="size-5 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-[11px] text-muted-foreground">
              <span className="text-success-foreground font-bold">
                Scheduled
              </span>
              <span>sessions for processing</span>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 rounded-md border-border shadow-sm bg-gradient-to-r from-card to-muted/20">
          <CardContent className="p-6 h-full flex flex-col justify-center">
            {nextAppointment ? (
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="size-4 rounded-full bg-primary animate-pulse" />
                    <span className="text-sm font-medium text-primary flex items-center gap-1">
                      <Clock className="size-3" />
                      {formatTime(nextAppointment.timeSlot.time)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold tracking-tight">
                      {nextAppointment.user?.firstName}{" "}
                      {nextAppointment.user?.lastName}
                    </h3>
                    <div className="flex gap-2 items-center">
                      <Tag className="size-3 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {nextAppointment.appointmentCategory.name}
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => handleView(nextAppointment)}
                  className="rounded-md shadow-sm px-6"
                >
                  View Details
                </Button>
              </div>
            ) : (
              <div className="text-center md:text-left">
                <p className="text-muted-foreground italic font-medium">
                  No upcoming appointments recorded for the current timeframe.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* QUICK ACTIONS GRID */}
      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
          Management Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                to={action.href}
                className={`bg-card rounded-md border-2 ${action.border} p-4 hover:bg-primary/5 hover:border-primary transition-all group flex items-center justify-between duration-300`}
              >
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-background border border-border rounded-md text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                    <Icon size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm tracking-tight">
                      {action.title}
                    </h3>
                    <p className="text-[11px] text-muted-foreground leading-tight">
                      {action.description}
                    </p>
                  </div>
                </div>
                <ChevronRight
                  size={14}
                  className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </Link>
            );
          })}
        </div>
      </section>

      {/* SCHEDULE TABLE-LIKE LIST */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
            Daily Queue
          </h2>
          <Badge variant="outline" className="rounded-md text-[10px]">
            {upcomingAppointments.length} Entries
          </Badge>
        </div>

        <Card className="rounded-md border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Student Name
                  </th>
                  <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Schedule
                  </th>
                  <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Category
                  </th>
                  <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>
                  <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    View
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-8 text-center text-sm text-muted-foreground"
                    >
                      Loading data...
                    </td>
                  </tr>
                ) : upcomingAppointments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-12 text-center text-sm text-muted-foreground italic"
                    >
                      Queue is currently empty.
                    </td>
                  </tr>
                ) : (
                  upcomingAppointments.map((apt) => (
                    <tr
                      key={apt.id}
                      className="hover:bg-muted/20 transition-colors group"
                    >
                      <td className="p-4">
                        <span className="font-bold text-sm tracking-tight">
                          {apt.user?.firstName} {apt.user?.lastName}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="size-3.5 text-muted-foreground" />
                          <span className="font-medium">
                            {formatTime(apt.timeSlot.time)}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Tag className="size-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {apt.appointmentCategory.name}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_COLORS[apt.status?.colorKey || "info"]}`}
                        >
                          {apt.status?.name}
                        </span>
                      </td>
                      <td className="p-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(apt)}
                          className="rounded-md h-8 text-xs font-bold border border-transparent hover:border-border"
                        >
                          <Eye className="size-3" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      <AppointmentViewModal
        appointment={selectedAppointment}
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        statuses={statuses || []}
        onStatusAction={async () => {}}
        onReschedule={async () => {}}
        hasActions={false} // Disable actions in this modal since it's just a preview
      />
    </div>
  );
}

// Minimal Badge for the header
function Badge({
  children,
  variant,
  className,
}: {
  children: React.ReactNode;
  variant?: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium border border-border ${className}`}
    >
      {children}
    </span>
  );
}
