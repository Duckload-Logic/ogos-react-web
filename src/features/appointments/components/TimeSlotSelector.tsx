import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AvailableTimeSlotView, TimeSlot } from "../types";
import { Sun, Moon } from "lucide-react";

interface TimeSlotselectorProps {
  selectedDate: Date | undefined;
  selectedTime: TimeSlot | undefined;
  availableSlots: AvailableTimeSlotView[];
  loading: boolean;
  onTimeSelect: (slot: AvailableTimeSlotView) => void;
}

export default function TimeSlotSelector({
  selectedDate,
  selectedTime,
  availableSlots,
  loading,
  onTimeSelect,
}: TimeSlotselectorProps) {
  const formatTime12hr = (time24: string) => {
    const [hours, minutes] = time24.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  const getHour = (time24: string) => {
    return Number(time24.split(":")[0]);
  };

  const amSlots = availableSlots.filter((slot) => getHour(slot.time) < 12);
  const pmSlots = availableSlots.filter((slot) => getHour(slot.time) >= 12);

  const renderSlotButton = (slot: AvailableTimeSlotView) => (
    <button
      key={slot.id}
      onClick={() => onTimeSelect(slot)}
      disabled={!slot.isAvailable}
      className={`py-2 px-2 rounded-lg font-medium transition-colors text-xs sm:text-sm ${
        selectedTime?.id === slot.id
          ? "bg-primary text-primary-foreground ring-2 ring-primary"
          : slot.isAvailable
            ? "bg-muted hover:bg-muted/80 text-foreground hover:ring-2 hover:ring-primary/50"
            : "bg-muted/50 text-muted-foreground cursor-not-allowed"
      }`}
      aria-label={`Select ${slot.time}`}
      aria-pressed={selectedTime?.id === slot.id}
    >
      {formatTime12hr(slot.time)}
    </button>
  );

  return (
    <div className="w-full">
      <Card className="border border-border shadow-sm h-full bg-card">
        <CardHeader className="bg-gradient-to-r from-muted/50 to-muted border-b border-border rounded-t-md">
          <CardTitle className="text-lg text-foreground">Select Time</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {selectedDate ? (
            <>
              <p className="text-sm font-semibold text-muted-foreground mb-4">
                {selectedDate.toDateString()}
              </p>
              {loading ? (
                <p className="text-muted-foreground text-center py-8 text-sm">
                  Loading available times...
                </p>
              ) : availableSlots.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* AM Column */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-400">
                      <Sun className="w-4 h-4" />
                      <span>Morning</span>
                      <span className="text-xs font-normal text-muted-foreground">
                        ({amSlots.length} slots)
                      </span>
                    </div>
                    {amSlots.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto p-2">
                        {amSlots.map(renderSlotButton)}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-4 text-sm bg-muted/30 rounded-lg">
                        No morning slots
                      </p>
                    )}
                  </div>

                  {/* PM Column */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                      <Moon className="w-4 h-4" />
                      <span>Afternoon</span>
                      <span className="text-xs font-normal text-muted-foreground">
                        ({pmSlots.length} slots)
                      </span>
                    </div>
                    {pmSlots.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto p-2">
                        {pmSlots.map(renderSlotButton)}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-4 text-sm bg-muted/30 rounded-lg">
                        No afternoon slots
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8 text-sm">
                  No available slots for this date
                </p>
              )}
            </>
          ) : (
            <p className="text-muted-foreground text-center py-8 text-sm">
              Select a date to see available times
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
