/**
 * AppointmentActionModal Component
 * Handles appointment actions such as viewing, approving, rejecting, and rescheduling
 * with confirmation dialogs for destructive actions
 */

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Appointment, CreateAppointmentRequest } from "@/features/appointments/services";
import { AlertCircle, CheckCircle, XCircle, Clock, Loader } from "lucide-react";
import { formatDate } from "@/features/schedules/utils/formatters";
import { useAppointments } from "@/features/appointments/hooks/useAppointments";

interface AppointmentActionModalProps {
  isOpen: boolean;
  appointment: Appointment | null;
  action: "view" | "reschedule" | "approve" | "reject" | "complete" | null;
  onClose: () => void;
  onConfirm?: (data?: any) => Promise<void>;
  isLoading?: boolean;
}

export const AppointmentActionModal = ({
  isOpen,
  appointment,
  action,
  onClose,
  onConfirm,
  isLoading,
}: AppointmentActionModalProps) => {
  const { fetchAvailableSlots, availableSlots, loading: slotsLoading } = useAppointments();
  
  const [rescheduleData, setRescheduleData] = useState<CreateAppointmentRequest>({
    reason: appointment?.reason || "",
    scheduledDate: appointment?.scheduledDate || "",
    scheduledTime: appointment?.scheduledTime || "",
    concernCategory: appointment?.concernCategory || "",
    status: "Rescheduled",
  });
  const [error, setError] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [occupiedTimes, setOccupiedTimes] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen && appointment) {
      setRescheduleData({
        reason: appointment.reason || "",
        scheduledDate: appointment.scheduledDate ? appointment.scheduledDate.split('T')[0] : "",
        scheduledTime: appointment.scheduledTime || "",
        concernCategory: appointment.concernCategory || "",
        status: "Rescheduled",
      });
      setError(null); 
    }
  }, [isOpen, appointment]);

  // Fetch available slots when date changes
  useEffect(() => {
    if (rescheduleData.scheduledDate && action === "reschedule") {
      fetchAvailableSlots(rescheduleData.scheduledDate);
    }
  }, [rescheduleData.scheduledDate, action, fetchAvailableSlots]);

  // Filter occupied times from available slots
  useEffect(() => {
    const occupied = new Set<string>();
    availableSlots.forEach((slot) => {
      if (!slot.isNotTaken) {
        occupied.add(slot.startTime);
      }
    });
    setOccupiedTimes(occupied);
  }, [availableSlots]);

  // Open confirmation dialog when action changes to approve, reject, or complete
  useEffect(() => {
    if (isOpen && (action === "approve" || action === "reject" || action === "complete")) {
      setConfirmDialogOpen(true);
    }
  }, [isOpen, action]);

  // Reset confirmation dialog when modal closes
  useEffect(() => {
    if (!isOpen) {
      setConfirmDialogOpen(false);
    }
  }, [isOpen]);

  const handleRescheduleSubmit = async () => {
    if (
      !rescheduleData.reason ||
      !rescheduleData.scheduledDate ||
      !rescheduleData.scheduledTime
    ) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      if (onConfirm) {
        await onConfirm(rescheduleData);
      }
      setConfirmDialogOpen(false);
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
    }
  };

  const getActionConfig = () => {
    switch (action) {
      case "approve":
        return {
          title: "Approve Appointment",
          description: appointment 
            ? `Are you sure you want to approve this appointment for ${formatDate(new Date(appointment.scheduledDate))} at ${appointment.scheduledTime}?`
            : "Loading appointment details...",
          confirmText: "Approve",
          icon: <CheckCircle className="h-6 w-6 text-green-600" />,
          color: "bg-green-50 border-green-200",
        };
      case "reject":
        return {
          title: "Reject Appointment",
          description: `Are you sure you want to reject this appointment? This action cannot be undone.`,
          confirmText: "Reject",
          icon: <XCircle className="h-6 w-6 text-red-600" />,
          color: "bg-red-50 border-red-200",
          destructive: true,
        };
      case "complete":
        return {
          title: "Mark as Completed",
          description: `Mark this appointment as completed?`,
          confirmText: "Complete",
          icon: <CheckCircle className="h-6 w-6 text-blue-600" />,
          color: "bg-blue-50 border-blue-200",
        };
      case "reschedule":
        return {
          title: "Reschedule Appointment",
          description: `Update the appointment date and time`,
          confirmText: "Reschedule",
          icon: <Clock className="h-6 w-6 text-amber-600" />,
          color: "bg-amber-50 border-amber-200",
        };
      default:
        return null;
    }
  };

  const actionConfig = getActionConfig();

  const handleActionConfirm = async () => {
    if (action === "reschedule") {
      // Reschedule requires form validation
      await handleRescheduleSubmit();
    } else {
      // Other actions trigger the onConfirm callback directly
      try {
        if (onConfirm) {
          await onConfirm();
        }
        setConfirmDialogOpen(false);
        onClose();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
      }
    }
  };

  return (
    <>
      {/* Main Modal */}
      <Dialog open={isOpen && action !== "approve" && action !== "reject" && action !== "complete"} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          {action === "view" && appointment && (
            <>
              <DialogHeader>
                <DialogTitle>Appointment Details</DialogTitle>
                <DialogDescription>
                  View full details of this appointment
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label className="font-semibold text-foreground">Student ID</Label>
                  <p className="text-sm text-gray-600">{appointment.userId}</p>
                </div>

                <div>
                  <Label className="font-semibold text-foreground">Date</Label>
                  <p className="text-sm text-gray-600">{appointment.scheduledDate}</p>
                </div>

                <div>
                  <Label className="font-semibold text-foreground">Time</Label>
                  <p className="text-sm text-gray-600">{appointment.scheduledTime}</p>
                </div>

                <div>
                  <Label className="font-semibold text-foreground">Reason</Label>
                  <p className="text-sm text-gray-600">{appointment.reason}</p>
                </div>

                <div>
                  <Label className="font-semibold text-foreground">Category</Label>
                  <p className="text-sm text-gray-600">
                    {appointment.concernCategory || "N/A"}
                  </p>
                </div>

                <div>
                  <Label className="font-semibold text-foreground">Status</Label>
                  <p className="text-sm text-gray-600">{appointment.status}</p>
                </div>

                <div>
                  <Label className="font-semibold text-foreground">Created</Label>
                  <p className="text-sm text-gray-600">
                    {new Date(appointment.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 justify-end mt-6">
                <Button className="border-foreground " variant="outline" onClick={onClose}>
                  Close
                </Button>
              </div>
            </>
          )}

          {action === "reschedule" && appointment && (
            <>
              <DialogHeader>
                <DialogTitle>Reschedule Appointment</DialogTitle>
                <DialogDescription>
                  Update the appointment date and time
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {error && (
                  <Alert variant="destructive" className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div>
                  <Label htmlFor="reschedule-reason" className="text-sm font-medium">
                    Reason
                  </Label>
                  <Input
                    id="reschedule-reason"
                    value={rescheduleData.reason}
                    onChange={(e) =>
                      setRescheduleData((prev) => ({
                        ...prev,
                        reason: e.target.value,
                      }))
                    }
                    placeholder="Enter appointment reason"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="reschedule-date" className="text-sm font-medium">
                    Date
                  </Label>
                  <Input
                    id="reschedule-date"
                    type="date"
                    value={rescheduleData.scheduledDate}
                    onChange={(e) =>
                      setRescheduleData((prev) => ({
                        ...prev,
                        scheduledDate: e.target.value,
                      }))
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="reschedule-time" className="text-sm font-medium">
                    Time
                  </Label>
                  {slotsLoading ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader className="w-5 h-5 animate-spin text-blue-500" />
                    </div>
                  ) : availableSlots.length > 0 ? (
                    <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto p-2 border rounded-lg bg-gray-50">
                      {availableSlots.map((slot) => {
                        const isOccupied = occupiedTimes.has(slot.startTime);
                        const isSelected = rescheduleData.scheduledTime === slot.startTime;
                        
                        return (
                          <button
                            key={slot.startTime}
                            onClick={() => {
                              if (!isOccupied) {
                                setRescheduleData({
                                  ...rescheduleData,
                                  scheduledTime: slot.startTime,
                                });
                              }
                            }}
                            disabled={isOccupied}
                            className={`px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                              isOccupied
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : isSelected
                                ? "bg-blue-600 text-white"
                                : "bg-white border border-gray-300 text-gray-700 hover:border-blue-500 hover:bg-blue-50"
                            }`}
                          >
                            {slot.startTime}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <Alert className="border-yellow-300 bg-yellow-50">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <AlertTitle className="text-yellow-800">No available slots</AlertTitle>
                      <AlertDescription className="text-yellow-700">
                        Please select a different date
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="reschedule-category"
                    className="text-sm font-medium"
                  >
                    Concern Category (Optional)
                  </Label>
                  <Input
                    id="reschedule-category"
                    value={rescheduleData.concernCategory || ""}
                    onChange={(e) =>
                      setRescheduleData((prev) => ({
                        ...prev,
                        concernCategory: e.target.value,
                      }))
                    }
                    placeholder="Enter concern category"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end mt-6">
                <Button variant="outline" onClick={onClose} disabled={isLoading}>
                  Cancel
                </Button>
                <Button
                  onClick={() => setConfirmDialogOpen(true)}
                  disabled={isLoading}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isLoading ? "Processing..." : "Next"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for Actions (Approve, Reject, Complete, Reschedule) */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={(open) => {
        setConfirmDialogOpen(open);
        if (!open) {
          onClose();
        }
      }}>
        <AlertDialogContent className={`${actionConfig?.color}`}>
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              {actionConfig?.icon}
              <AlertDialogTitle>{actionConfig?.title}</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              {actionConfig?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {action === "reschedule" && (
            <div className="space-y-3 border-t pt-4 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-medium text-gray-700">Date:</span>
                  <p className="text-gray-600">{rescheduleData.scheduledDate}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Time:</span>
                  <p className="text-gray-600">{rescheduleData.scheduledTime}</p>
                </div>
              </div>
              <div>
                <span className="font-medium text-gray-700">Reason:</span>
                <p className="text-gray-600">{rescheduleData.reason}</p>
              </div>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-gray-50 hover:bg-gray-200 text-black hover:text-black border border-foreground"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleActionConfirm}
              disabled={isLoading}
              className={
                actionConfig?.destructive
                  ? "bg-red-600 hover:opacity-90 text-white"
                  : undefined
              }
            >
              {isLoading ? "Processing..." : actionConfig?.confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
