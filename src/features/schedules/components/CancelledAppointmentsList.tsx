/**
 * CancelledAppointmentsList Component
 * Displays cancelled appointments in a muted style
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import {
  Appointment,
} from "@/features/schedules/components/AppointmentCard";
import { formatDate, formatTime } from "@/features/schedules/utils/formatters";

export interface CancelledAppointmentsListProps {
  appointments: Appointment[];
}

export function CancelledAppointmentsList({
  appointments,
}: CancelledAppointmentsListProps) {
  const cancelledAppointments = appointments.filter(
    (appt) => appt.status === "Cancelled",
  );

  if (cancelledAppointments.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-600 mb-6 flex items-center gap-2">
        <Calendar className="w-6 h-6" />
        Cancelled Appointments
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cancelledAppointments.map((appointment) => (
          <Card key={appointment.id} className="border-0 shadow-sm opacity-75">
            <CardHeader className="bg-red-50 border-b pb-3">
              <CardTitle className="text-lg text-gray-600 line-through">
                {appointment.concernCategory}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600">Date</p>
                  <p className="text-base text-gray-600 line-through">
                    {formatDate(appointment.scheduledDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Time</p>
                  <p className="text-base text-gray-600 line-through">
                    {formatTime(appointment.scheduledTime)}
                  </p>
                </div>
              </div>
              <p className="text-sm text-red-600 font-semibold">Cancelled</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
