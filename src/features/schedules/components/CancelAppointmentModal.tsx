/**
 * CancelAppointmentModal Component
 * Displays a confirmation dialog for cancelling an appointment
 */

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Loader } from "lucide-react";

export interface CancelAppointmentModalProps {
  isOpen: boolean;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function CancelAppointmentModal({
  isOpen,
  isDeleting,
  onConfirm,
  onCancel,
}: CancelAppointmentModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-sm w-full border-0 shadow-xl">
        <div className="bg-red-600 text-white px-6 py-4 flex items-center gap-3 rounded-t-lg">
          <AlertCircle className="w-6 h-6" />
          <h3 className="text-lg font-bold">Cancel Appointment</h3>
        </div>
        <CardContent className="pt-6 pb-6">
          <p className="text-gray-700 mb-6">
            Are you sure you want to cancel this appointment? This action cannot
            be undone.
          </p>
          <div className="flex gap-3">
            <Button
              onClick={onCancel}
              disabled={isDeleting}
              variant="outline"
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              No, Keep it
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              {isDeleting ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                "Yes, Cancel"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
