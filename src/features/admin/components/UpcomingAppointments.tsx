import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface Appointment {
  id: string;
  studentName: string;
  date: string;
  time: string;
  reason: string;
  status: "scheduled" | "completed" | "cancelled";
  date_raw: string;
}

interface UpcomingAppointmentsProps {
  appointments: Appointment[];
  onViewClick: (appointment: Appointment) => void;
}

export default function UpcomingAppointments({
  appointments,
  onViewClick,
}: UpcomingAppointmentsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-500/20 text-blue-600 dark:text-blue-400";
      case "completed":
        return "bg-green-500/20 text-green-600 dark:text-green-400";
      case "cancelled":
        return "bg-red-500/20 text-red-600 dark:text-red-400";
      default:
        return "bg-muted text-foreground";
    }
  };

  return (
    <div className="rounded-lg border border-border p-4 shadow">
      <h3 className="mb-4 font-semibold text-foreground">
        Upcoming Appointments
      </h3>
      <div className="space-y-3">
        {appointments.slice(0, 5).map((appointment) => (
          <div
            key={appointment.id}
            className={cn(
              "flex items-center justify-between rounded border",
              "border-border p-3 transition-colors hover:bg-muted/50",
              "dark:hover:bg-muted/30",
            )}
          >
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                {appointment.studentName}
              </p>
              <p className="text-xs text-muted-foreground">
                {appointment.date} at {appointment.time}
              </p>
              <p className="text-xs text-muted-foreground">
                {appointment.reason}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`rounded px-2 py-1 text-xs font-medium ${getStatusColor(
                  appointment.status,
                )}`}
              >
                {appointment.status}
              </span>
              <button
                onClick={() => onViewClick(appointment)}
                className="rounded p-1 transition-colors hover:bg-muted"
              >
                <Eye
                  size={14}
                  className="text-foreground"
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
