/**
 * UpcomingAppointmentsList Component
 * Displays a list of upcoming appointments or an empty state
 */

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import {
  AppointmentCard,
  Appointment,
} from "@/features/schedules/components/AppointmentCard";

export interface UpcomingAppointmentsListProps {
  appointments: Appointment[];
  onDeleteClick: (id: number) => void;
  isDeleting: boolean;
}

export function UpcomingAppointmentsList({
  appointments,
  onDeleteClick,
  isDeleting,
}: UpcomingAppointmentsListProps) {
  const upcomingAppointments = appointments
    .filter((appt) => appt.status !== "Cancelled")
    .sort(
      (a, b) =>
        new Date(a.scheduledDate).getTime() -
        new Date(b.scheduledDate).getTime(),
    );

  if (upcomingAppointments.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="pt-12 pb-12 text-center">
          <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">
            No upcoming appointments scheduled
          </p>
          <Link to="/schedule" className="mt-4 inline-block">
            <Button className="bg-primary hover:bg-primary-dark text-primary-foreground font-semibold">
              Schedule an Appointment
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {upcomingAppointments.map((appointment) => (
        <AppointmentCard
          key={appointment.id}
          appointment={appointment}
          onDelete={onDeleteClick}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  );
}
