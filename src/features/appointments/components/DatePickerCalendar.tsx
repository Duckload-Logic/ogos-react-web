import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DatePickerCalendarProps {
  currentMonth: Date;
  selectedDate: Date | undefined;
  onMonthChange: (date: Date) => void;
  onDateSelect: (date: Date) => void;
}

export default function DatePickerCalendar({
  currentMonth,
  selectedDate,
  onMonthChange,
  onDateSelect,
}: DatePickerCalendarProps) {
  const handlePrevMonth = () => {
    onMonthChange(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    onMonthChange(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateAvailable = (date: Date): boolean => {
    // Only future dates, excluding weekends
    return date > new Date() && date.getDay() !== 0 && date.getDay() !== 6;
  };

  const firstDay = getFirstDayOfMonth(currentMonth);
  const daysInMonth = getDaysInMonth(currentMonth);

  return (
    <div className="flex-1 lg:min-w-0">
      <Card className="border-0 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
          <CardTitle className="text-xl">Select Date</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold min-w-40 text-center">
              {currentMonth.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="space-y-4">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-3 text-center">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div
                  key={day}
                  className="font-semibold text-sm text-gray-600"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-3">
              {Array.from({ length: 42 }).map((_, index) => {
                if (index < firstDay || index >= firstDay + daysInMonth) {
                  return <div key={index} />;
                }

                const day = index - firstDay + 1;
                const date = new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth(),
                  day
                );

                const isSelected =
                  selectedDate &&
                  selectedDate.toDateString() === date.toDateString();
                const isAvailable = isDateAvailable(date);

                return (
                  <button
                    key={index}
                    onClick={() => isAvailable && onDateSelect(date)}
                    disabled={!isAvailable}
                    className={`h-12 rounded-lg font-semibold transition-colors text-sm flex items-center justify-center ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : isAvailable
                          ? "bg-gray-100 hover:bg-gray-200 text-gray-900"
                          : "text-gray-300 cursor-not-allowed"
                    }`}
                    aria-label={`${day} ${currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}`}
                    aria-pressed={isSelected}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 pt-6 border-t border-gray-200 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-primary rounded" />
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 rounded border border-gray-200" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-300 rounded" />
              <span>Unavailable</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
