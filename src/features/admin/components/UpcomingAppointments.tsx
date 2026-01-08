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
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
      <h3 className="font-semibold text-foreground mb-4">
        Upcoming Appointments
      </h3>
      <div className="space-y-3">
        {appointments.slice(0, 5).map((appointment) => (
          <div
            key={appointment.id}
            className="flex items-center justify-between p-3 border border-gray-100 rounded hover:bg-gray-50 transition-colors"
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
                className="p-1 hover:bg-gray-200 rounded transition-colors"
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
