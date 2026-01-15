/**
 * Upcoming Schedules
 * Shows filtered schedules for the selected date
 */

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Edit2 } from "lucide-react";
import { Appointment } from "@/features/appointments/services";

// Helper function to check if two dates are the same day
const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

// Helper function to parse ISO date string to Date object
const parseISO = (dateStr: string): Date => {
  return new Date(dateStr);
};

interface UpcomingSchedulesProps {
  appointments: Appointment[];
  selectedDate: Date | null;
  onView: (appointment: Appointment) => void;
  onReschedule: (appointment: Appointment) => void;
}

export const UpcomingSchedules = ({
  appointments,
  selectedDate,
  onView,
  onReschedule,
}: UpcomingSchedulesProps) => {
  // Filter appointments for the selected date
  const filteredAppointments = selectedDate
    ? appointments.filter((apt) => {
        const aptDate = parseISO(apt.scheduledDate);
        return (
          isSameDay(aptDate, selectedDate) &&
          (apt.status === "Approved" || apt.status === "Rescheduled")
        );
      })
    : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rescheduled":
        return "bg-blue-100 text-blue-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
        return "bg-purple-100 text-purple-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Scheduled Appointments</CardTitle>
        <CardDescription>
          {selectedDate
            ? `Showing appointments for the selected date`
            : "Select a date to view appointments"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {filteredAppointments.length > 0 ? (
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="font-medium">{appointment.userId}</TableCell>
                    <TableCell>{appointment.scheduledTime}</TableCell>
                    <TableCell>{appointment.reason}</TableCell>
                    <TableCell>{appointment.concernCategory}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onView(appointment)}
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onReschedule(appointment)}
                        title="Reschedule"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {selectedDate
                ? "No appointments scheduled for this date"
                : "Select a date to see appointments"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
