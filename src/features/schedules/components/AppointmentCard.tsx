/**
 * AppointmentCard Component
 * Displays a single appointment with details and action buttons
 */

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader, Trash2 } from "lucide-react";
import { formatDate, formatTime, getStatusColor } from "@/features/schedules/utils/formatters";
import { Appointment } from "@/features/appointments";

export interface AppointmentCardProps {
  appointment: Appointment;
  onDelete: (apt: Appointment) => void;
  isDeleting: boolean;
}

export function AppointmentCard({
  appointment,
  onDelete,
  isDeleting,
}: AppointmentCardProps) {
  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="bg-blue-50 border-b pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg text-gray-900">
            {appointment.concernCategory}
          </CardTitle>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
              appointment.status,
            )}`}
          >
            {appointment.status}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-600">Date</p>
            <p className="text-base font-semibold text-gray-900">
              {formatDate(appointment.scheduledDate)}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600">Time</p>
            <p className="text-base font-semibold text-gray-900">
              {formatTime(appointment.scheduledTime)}
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-600">Appointment ID</p>
          <p className="text-base text-gray-900">#{appointment.id}</p>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-600">Created</p>
          <p className="text-base text-gray-900">
            {new Date(appointment.createdAt).toLocaleDateString()}
          </p>
        </div>

        {appointment.status === "Pending" && (
          <div className="pt-4 flex gap-3">
            <Button
              variant="outline"
              className="flex-1 border-blue-500 text-blue-600 hover:bg-blue-50 bg-blue-50"
              disabled
            >
              Reschedule (Soon)
            </Button>
            <Button
              onClick={() => onDelete(appointment)}
              disabled={isDeleting}
              variant="outline"
              className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
            >
              {isDeleting ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </Button>
          </div>
        )}

        {appointment.status !== "Pending" && (
          <div className="pt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Status:{" "}
              <span className="font-semibold text-gray-900">
                {appointment.status}
              </span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
