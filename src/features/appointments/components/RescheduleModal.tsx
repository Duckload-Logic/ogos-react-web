import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAvailableSlots } from "@/features/appointments/hooks";
import { DropdownField, InputField } from "@/components/form";
import { AvailableTimeSlotView, TimeSlot } from "../types";
import { format12HourTime, toISODateString } from "../utils";

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newDate: string, newTimeSlotId: number) => void;
  currentDate: string;
  currentTimeSlotId: number;
}

export default function RescheduleModal({
  isOpen,
  onClose,
  onConfirm,
  currentDate,
  currentTimeSlotId,
}: RescheduleModalProps) {
  const today = new Date();
  const dateOptions: { value: string; label: string }[] = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const label = date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    dateOptions.push({ value, label });
  }

  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0); // Reset time to start of today

    const cur = new Date(currentDate);
    // Ensure we compare midnight to midnight to avoid time-of-day bugs
    const isFutureOrToday = cur >= todayStart;

    return isFutureOrToday ? toISODateString(cur) : dateOptions[0].value;
  });

  const [selectedSlotId, setSelectedSlotId] = useState<number | undefined>(
    currentTimeSlotId,
  );

  const dateObj = selectedDateStr ? new Date(selectedDateStr) : undefined;
  const { data: availableSlots, isLoading } = useAvailableSlots(dateObj);

  // Reset selected slot when date changes
  useEffect(() => {
    setSelectedSlotId(undefined);
  }, [selectedDateStr]);

  const handleConfirm = () => {
    if (!selectedDateStr || !selectedSlotId) return;
    onConfirm(selectedDateStr, selectedSlotId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reschedule Appointment</DialogTitle>
          <DialogDescription>
            Select a new date and time slot.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <InputField
            type="date"
            label="New Date"
            min={dateOptions[0].value}
            max={dateOptions[dateOptions.length - 1].value}
            value={selectedDateStr}
            onChange={setSelectedDateStr}
          />

          <DropdownField
            label={"New time"}
            options={
              availableSlots?.map((slot: AvailableTimeSlotView) => ({
                id: slot.id,
                name: format12HourTime(slot.time),
                isEnabled: slot.isAvailable,
              })) || []
            }
            enabled={!!selectedDateStr && !isLoading}
            value={selectedSlotId}
            onChange={(val) => setSelectedSlotId(Number(val))}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedDateStr || !selectedSlotId}
          >
            Confirm Reschedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
