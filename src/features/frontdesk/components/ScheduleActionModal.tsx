/**
 * Schedule Action Modal
 * Handles viewing and rescheduling appointments
 */

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, AlertTriangle, CheckCircle2, AlertCircle, Loader } from "lucide-react";
import { Appointment, CreateAppointmentRequest } from "@/features/appointments/services";
import { formatDate } from "@/features/schedules/utils/formatters";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAppointments } from "@/features/appointments/hooks/useAppointments";

interface ScheduleActionModalProps {
  isOpen: boolean;
  appointment: Appointment | null;
  action: "view" | "reschedule" | null;
  onClose: () => void;
  onConfirm: (data: CreateAppointmentRequest) => Promise<void>;
  isLoading: boolean;
}

export const ScheduleActionModal = ({
  isOpen,
  appointment,
  action,
  onClose,
  onConfirm,
  isLoading,
}: ScheduleActionModalProps) => {
  const { fetchAvailableSlots, availableSlots, loading: slotsLoading } = useAppointments();
  const [stage, setStage] = useState<"form" | "confirmation">("form");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formData, setFormData] = useState<CreateAppointmentRequest>({
    reason: appointment?.reason || "",
    scheduledDate: appointment?.scheduledDate?.split("T")[0] || "",
    scheduledTime: appointment?.scheduledTime || "",
    concernCategory: appointment?.concernCategory || "",
    status: "Rescheduled",
  });
  const [confirmData, setConfirmData] = useState<CreateAppointmentRequest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [occupiedTimes, setOccupiedTimes] = useState<Set<string>>(new Set());

  // Initialize form data when appointment changes
  useEffect(() => {
    if (isOpen && appointment) {
      setFormData({
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
    if (formData.scheduledDate && action === "reschedule") {
      fetchAvailableSlots(formData.scheduledDate);
    }
  }, [formData.scheduledDate, action, fetchAvailableSlots]);

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

  const handleClose = () => {
    setStage("form");
    setShowConfirmDialog(false);
    setError(null);
    onClose();
  };

  const handleRescheduleNext = () => {
    if (!formData.reason || !formData.scheduledDate || !formData.scheduledTime) {
      setError("Please fill in all required fields");
      return;
    }
    setConfirmData(formData);
    setShowConfirmDialog(true);
  };

  const handleRescheduleConfirm = async () => {
    try {
      if (confirmData) {
        await onConfirm(confirmData);
      }
      setShowConfirmDialog(false);
      handleClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
    }
  };

  return (
    <>
      {/* Main Modal */}
      <Dialog open={isOpen && !showConfirmDialog} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {action === "view" ? "Appointment Details" : "Reschedule Appointment"}
            </DialogTitle>
            <DialogDescription>
              {action === "view"
                ? "View the appointment details"
                : "Update the appointment schedule"}
            </DialogDescription>
          </DialogHeader>

          {action === "view" && appointment && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-500">Student ID</Label>
                  <p className="font-semibold">{appointment.userId}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Status</Label>
                  <p className="font-semibold capitalize">{appointment.status}</p>
                </div>
              </div>

              <div>
                <Label className="text-xs text-gray-500">Reason</Label>
                <p className="font-semibold">{appointment.reason}</p>
              </div>

              <div>
                <Label className="text-xs text-gray-500">Category</Label>
                <p className="font-semibold">{appointment.concernCategory}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-500">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Date
                  </Label>
                  <p className="font-semibold">{appointment.scheduledDate}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Time
                  </Label>
                  <p className="font-semibold">{appointment.scheduledTime}</p>
                </div>
              </div>

              <div className="text-xs text-gray-400 pt-2 border-t">
                Created: {formatDate(new Date(appointment.createdAt))}
              </div>
            </div>
          )}

          {action === "reschedule" && appointment && (
            <div className="space-y-4 py-4">
              {error && (
                <Alert variant="destructive" className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div>
                <Label htmlFor="reason">Reason</Label>
                <Textarea
                  id="reason"
                  placeholder="Enter appointment reason"
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  className="mt-1 resize-none"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="scheduledDate">Date</Label>
                  <Input
                    id="scheduledDate"
                    type="date"
                    value={formData.scheduledDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        scheduledDate: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="scheduledTime">Time</Label>
                  {slotsLoading ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader className="w-5 h-5 animate-spin text-blue-500" />
                    </div>
                  ) : availableSlots.length > 0 ? (
                    <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto p-2 border rounded-lg bg-gray-50">
                      {availableSlots.map((slot) => {
                        const isOccupied = occupiedTimes.has(slot.startTime);
                        const isSelected = formData.scheduledTime === slot.startTime;
                        
                        return (
                          <button
                            key={slot.startTime}
                            onClick={() => {
                              if (!isOccupied) {
                                setFormData({
                                  ...formData,
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
              </div>

              <div>
                <Label htmlFor="concernCategory">Category</Label>
                <Input
                  id="concernCategory"
                  placeholder="Concern category"
                  value={formData.concernCategory}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      concernCategory: e.target.value,
                    })
                  }
                  className="mt-1"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            {action === "reschedule" && (
              <Button
                onClick={handleRescheduleNext}
                disabled={
                  isLoading ||
                  !formData.reason ||
                  !formData.scheduledDate ||
                  !formData.scheduledTime
                }
                className="bg-primary hover:bg-primary/90"
              >
                Next
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-amber-600" />
              Confirm Reschedule
            </AlertDialogTitle>
            <AlertDialogDescription>
              Please review the new appointment details before confirming.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-3 py-4 bg-amber-50 p-3 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">New Date:</span>
                <p className="font-semibold">{confirmData?.scheduledDate}</p>
              </div>
              <div>
                <span className="text-gray-600">New Time:</span>
                <p className="font-semibold">{confirmData?.scheduledTime}</p>
              </div>
            </div>
            <div>
              <span className="text-gray-600 text-sm">Reason:</span>
              <p className="font-semibold text-sm">{confirmData?.reason}</p>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRescheduleConfirm}
              disabled={isLoading}
              className="bg-amber-600 hover:bg-amber-700"
            >
              {isLoading ? "Confirming..." : "Confirm Reschedule"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};