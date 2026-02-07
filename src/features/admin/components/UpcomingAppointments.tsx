import { Eye } from "lucide-react";

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
    <div className="rounded-lg shadow border border-border p-4">
      <h3 className="font-semibold text-foreground mb-4">
        Upcoming Appointments
      </h3>
      <div className="space-y-3">
        {appointments.slice(0, 5).map((appointment) => (
          <div
            key={appointment.id}
            className="flex items-center justify-between p-3 border border-border rounded hover:bg-muted/50 dark:hover:bg-muted/30 transition-colors"
          >
            <div className="flex-1">
              <p className="font-medium text-foreground text-sm">
                {appointment.studentName}
              </p>
              <p className="text-xs text-muted-foreground">
                {appointment.date} at {appointment.time}
              </p>
              <p className="text-xs text-muted-foreground">{appointment.reason}</p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs px-2 py-1 rounded font-medium ${getStatusColor(
                  appointment.status,
                )}`}
              >
                {appointment.status}
              </span>
              <button
                onClick={() => onViewClick(appointment)}
                className="p-1 hover:bg-muted rounded transition-colors"
              >
                <Eye size={14} className="text-foreground" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
