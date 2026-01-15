import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TimeSlot } from "@/types";

interface TimeSlotselectorProps {
  selectedDate: Date | undefined;
  selectedTime: string;
  availableSlots: TimeSlot[];
  loading: boolean;
  onTimeSelect: (time: string) => void;
}

export default function TimeSlotSelector({
  selectedDate,
  selectedTime,
  availableSlots,
  loading,
  onTimeSelect,
}: TimeSlotselectorProps) {
  return (
    <div className="lg:w-72 lg:flex-shrink-0">
      <Card className="border-0 shadow-sm h-full">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
          <CardTitle className="text-lg">Select Time</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {selectedDate ? (
            <>
              <p className="text-sm font-semibold text-gray-600 mb-4">
                {selectedDate.toDateString()}
              </p>
              {loading ? (
                <p className="text-gray-500 text-center py-8 text-sm">
                  Loading available times...
                </p>
              ) : availableSlots.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot.slotId}
                      onClick={() => onTimeSelect(slot.startTime)}
                      disabled={!slot.isNotTaken}
                      className={`py-2 px-2 rounded-lg font-medium transition-colors text-xs sm:text-sm ${
                        selectedTime === slot.startTime
                          ? "bg-primary text-primary-foreground"
                          : slot.isNotTaken
                            ? "bg-gray-100 hover:bg-gray-200 text-gray-900"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                      aria-label={`Select ${slot.startTime}`}
                      aria-pressed={selectedTime === slot.startTime}
                    >
                      {slot.startTime.slice(0, 5)}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8 text-sm">
                  No available slots for this date
                </p>
              )}
            </>
          ) : (
            <p className="text-gray-500 text-center py-8 text-sm">
              Select a date to see available times
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
