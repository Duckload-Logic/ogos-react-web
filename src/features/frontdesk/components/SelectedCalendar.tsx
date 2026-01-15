/**
 * Schedule Calendar
 * Selectable calendar that highlights days with scheduled appointments
 */

import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, isSameDay, parseISO } from "date-fns";
import { Appointment } from "@/features/appointments/services";

interface ScheduleCalendarProps {
  appointments: Appointment[];
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

export const ScheduleCalendar = ({
  appointments,
  selectedDate,
  onDateSelect,
}: ScheduleCalendarProps) => {
  // Get dates that have scheduled appointments (Approved or Rescheduled)
  const scheduledDates = appointments
    .filter((apt) => apt.status === "Approved" || apt.status === "Rescheduled")
    .map((apt) => parseISO(apt.scheduledDate));

  // Check if a date has schedules
  const hasSchedule = (date: Date) => {
    return scheduledDates.some((scheduledDate) => isSameDay(date, scheduledDate));
  };

  // Custom day class for highlighting
  const getCalendarDayClass = (date: Date) => {
    const baseClass =
      "relative inline-flex items-center justify-center rounded-md text-sm p-0 font-normal aria-selected:opacity-100 [&:has([aria-selected].day-range-end)]:rounded-r-none rounded-l-none [&:has([aria-selected])]:bg-blue-100 [&>[aria-selected]]:bg-blue-600 [&>[aria-selected]]:text-white focus-within:relative focus-within:z-20";

    if (hasSchedule(date)) {
      return `${baseClass} relative`;
    }

    return baseClass;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Schedule Calendar</CardTitle>
        <CardDescription>
          Select a date to view scheduled appointments
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center">
          <Calendar
            mode="single"
            selected={selectedDate || undefined}
            onSelect={(date) => date && onDateSelect(date)}
            disabled={(date) => date > new Date()}
            className="rounded-md border"
            modifiers={{
              scheduled: hasSchedule,
            }}
            modifiersClassNames={{
              scheduled: "bg-blue-100 font-bold relative",
            }}
            modifiersStyles={{
              scheduled: {
                backgroundColor: "#dbeafe",
              },
            }}
          />
        </div>

        {selectedDate && (
          <div className="pt-4 border-t">
            <p className="text-sm font-semibold text-gray-700">
              Selected Date: {format(selectedDate, "MMMM dd, yyyy")}
            </p>
            <div className="mt-2">
              {hasSchedule(selectedDate) ? (
                <Badge className="bg-green-100 text-green-800">
                  Has Scheduled Appointments
                </Badge>
              ) : (
                <Badge variant="outline">No appointments scheduled</Badge>
              )}
            </div>
          </div>
        )}

        <div className="pt-4 space-y-2">
          <p className="text-xs font-semibold text-gray-600">Legend:</p>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded bg-blue-100 border border-blue-300" />
            <span>Has scheduled appointments</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};