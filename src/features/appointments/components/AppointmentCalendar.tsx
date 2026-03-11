import { useEffect, useMemo, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCalendarStats } from "../hooks/useCalendar";
import { DailyStatusCount } from "../types/calendar";

interface Legend {
  color: string;
  label: string;
}

interface AppointmentCalendarProps {
  /** Current month being displayed */
  currentMonth: Date;
  /** Currently selected date */
  selectedDate?: Date;
  /** Callback when month changes */
  onMonthChange: (date: Date) => void;
  /** Callback when a date is selected */
  onDateSelect: (date: Date) => void;
  /** Set of booked dates in "YYYY-MM-DD" format */
  bookedDates?: Set<string>;
  /** Custom legends to display */
  legends?: Legend[];
  /** Color class for occupied/booked days */
  occupiedDayColor?: string;
  /** Title shown in card header */
  title?: string;
  /** Allow selecting past dates */
  allowPastDates?: boolean;
  /** Allow selecting current date */
  allowCurrentDate?: boolean;
  /** Allow selecting weekends */
  allowWeekends?: boolean;
  /** Show header with month navigation */
  hasHeader?: boolean;
  /** Additional CSS classes for the card container */
  className?: string;
  /** If admin, add badges */
  isAdmin?: boolean;
}

export default function AppointmentCalendar({
  currentMonth,
  selectedDate,
  onMonthChange,
  onDateSelect,
  bookedDates = new Set(),
  legends,
  occupiedDayColor = "bg-primary",
  title = "Select Date",
  allowPastDates = false,
  allowCurrentDate = true,
  allowWeekends = false,
  hasHeader = false,
  className,
  isAdmin = false,
}: AppointmentCalendarProps) {
  const touchStartX = useRef<number | null>(null);
  const today = new Date();
  const todayDate = today.getDate();
  const currentYear = currentMonth.getFullYear();
  const currentMonthIndex = currentMonth.getMonth();

  const { data: daysMeta, isLoading: isLoadingDaysMeta } = useCalendarStats({
    isAdmin: isAdmin,
    params: {
      startDate: `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}-01`,
    },
  });

  const statsMap = useMemo(() => {
    if (!daysMeta) return {};

    return daysMeta.reduce((acc: any, curr: any) => {
      const rawDate = curr.Date;
      if (rawDate) {
        const key = rawDate.split("T")[0];
        acc[key] = curr;
      }
      return acc;
    }, {});
  }, [daysMeta]);

  const isCurrentMonth =
    today.getFullYear() === currentYear &&
    today.getMonth() === currentMonthIndex;

  const handlePrevMonth = () => {
    onMonthChange(new Date(currentYear, currentMonthIndex - 1));
  };

  const handleNextMonth = () => {
    onMonthChange(new Date(currentYear, currentMonthIndex + 1));
  };

  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const firstDay = getFirstDayOfMonth(currentMonth);
  const daysInMonth = getDaysInMonth(currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  const monthName = currentMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const isDateDisabled = (day: number): boolean => {
    const date = new Date(currentYear, currentMonthIndex, day);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isPast = isCurrentMonth ? day < todayDate : currentMonth < today;
    const isToday = isCurrentMonth && day === todayDate;

    if (!allowWeekends && isWeekend) return true;
    if (!allowPastDates && isPast) return true;
    if (!allowCurrentDate && isToday) return true;
    return false;
  };

  const formatDateKey = (day: number): string => {
    return `${currentYear}-${String(currentMonthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  const handleDateClick = (day: number) => {
    if (!isDateDisabled(day)) {
      onDateSelect(new Date(currentYear, currentMonthIndex, day));
    }
  };

  const defaultLegends: Legend[] = [
    { color: "bg-primary", label: "Selected" },
    { color: "bg-muted border border-border", label: "Available" },
    { color: "bg-muted/50 opacity-50", label: "Unavailable" },
  ];

  const displayLegends = legends || defaultLegends;

  const hasInitialCalendarChecked = useRef(false);

  useEffect(() => {
    if (hasInitialCalendarChecked.current) return;

    const checkAndSkip = () => {
      const allDaysDisabled = Array.from(
        { length: daysInMonth },
        (_, i) => i + 1,
      ).every((day) => isDateDisabled(day));

      if (allDaysDisabled) {
        const nextMonth = new Date(currentYear, currentMonthIndex + 1, 1);
        onMonthChange(nextMonth);
      } else {
        hasInitialCalendarChecked.current = true;
      }
    };

    checkAndSkip();
  }, [currentMonth, isDateDisabled, onMonthChange]);

  return (
    <Card
      className={`shadow-sm bg-card border border-border rounded-md h-fit ${className ?? ""}`}
    >
      {hasHeader && (
        <CardHeader className="bg-gradient-to-r from-muted/50 to-muted border-b border-border rounded-md rounded-b-none">
          <CardTitle className="text-xl text-foreground">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="pt-6 bg-card rounded-md flex flex-col">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-muted rounded transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <h2 className="text-lg font-semibold min-w-40 text-center text-foreground">
            {monthName}
          </h2>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-muted rounded transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Calendar Grid - Desktop */}
        <div className="hidden sm:block space-y-4 gap-2">
          {/* Day Headers */}
          <div className="grid grid-cols-7 text-center">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <div
                key={day}
                className="font-semibold text-sm text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {emptyDays.map((_, idx) => (
              <div key={`empty-${idx}`} className="p-1" />
            ))}
            {days.map((day) => {
              const dateKey = formatDateKey(day);
              const isToday = isCurrentMonth && day === todayDate;
              const isSelected =
                selectedDate?.getDate() === day &&
                selectedDate.getMonth() === currentMonthIndex &&
                selectedDate.getFullYear() === currentYear;
              const isDisabled = isDateDisabled(day);

              return (
                <div
                  key={day}
                  className="relative group p-1 flex justify-center"
                >
                  <button
                    onClick={() => handleDateClick(day)}
                    disabled={isDisabled}
                    className={`
                      size-12
                      rounded-lg font-semibold transition-colors text-sm
                      flex items-center justify-center
                      focus:outline-none focus:ring-1 focus:ring-primary/50
                      text-nowrap
                      ${isDisabled ? "opacity-50 cursor-not-allowed" : "hover:ring-1 hover:ring-primary"}
                      ${
                        isSelected
                          ? "bg-primary text-primary-foreground ring-1 ring-primary"
                          : isDisabled
                            ? "bg-muted/50 text-muted-foreground"
                            : "bg-muted hover:bg-muted/80 text-foreground"
                      }
                      ${isToday ? "ring-1 ring-primary" : ""}
                    `}
                    aria-label={`${day} ${monthName}`}
                    aria-pressed={isSelected}
                  >
                    {day}
                  </button>
                  {isAdmin && statsMap[dateKey] && (
                    <div className="absolute flex -space-x-1 transform -translate-y-1 justify-center pointer-events-none">
                      {/* Pending is first in row-reverse order to be on top-right */}
                      {statsMap[dateKey].RescheduledCount > 0 && (
                        <div
                          className="size-3 rounded-full bg-notice-background border-2 border-notice-foreground"
                          title="Rescheduled"
                        />
                      )}

                      {/* Scheduled is rendered second (middle) */}
                      {statsMap[dateKey].ScheduledCount > 0 && (
                        <div
                          className="size-3 rounded-full bg-info-background border-2 border-info-foreground"
                          title="Scheduled"
                        />
                      )}

                      {/* Pending is rendered last (right-most, top of stack) */}
                      {statsMap[dateKey].PendingCount > 0 && (
                        <div
                          className="size-3 rounded-full bg-warning-background border-2 border-warning-foreground"
                          title="Pending"
                        />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Calendar */}
        <div
          className="sm:hidden space-y-2"
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            if (touchStartX.current == null) return;
            const dx = e.changedTouches[0].clientX - touchStartX.current;
            const threshold = 50;
            if (dx < -threshold) handleNextMonth();
            else if (dx > threshold) handlePrevMonth();
            touchStartX.current = null;
          }}
        >
          {days.map((day) => {
            const dateKey = formatDateKey(day);
            const isBooked = bookedDates.has(dateKey);
            const isToday = isCurrentMonth && day === todayDate;
            const isSelected =
              selectedDate?.getDate() === day &&
              selectedDate.getMonth() === currentMonthIndex &&
              selectedDate.getFullYear() === currentYear;
            const isDisabled = isDateDisabled(day);

            return (
              <button
                key={`mobile-${day}`}
                onClick={() => handleDateClick(day)}
                disabled={isDisabled}
                className={`
                  w-full flex items-center justify-between p-3 rounded-lg
                  text-sm font-medium transition-colors
                  ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
                  ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }
                  ${isToday ? "border-2 border-primary" : ""}
                `}
              >
                <span>Day {day}</span>
                <span className="text-xs">
                  {isToday
                    ? "Today"
                    : isSelected
                      ? "Selected"
                      : isBooked
                        ? "Booked"
                        : isDisabled
                          ? "Unavailable"
                          : "Available"}
                </span>
              </button>
            );
          })}
          <p className="text-center text-xs text-muted-foreground mt-2">
            Swipe left/right to change month
          </p>
        </div>

        {/* Legend */}
        <div className="mt-6 pt-6 border-t border-border flex flex-wrap gap-4 text-sm">
          {isCurrentMonth && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-muted border-2 border-primary" />
              <span className="text-foreground">Today</span>
            </div>
          )}
          {displayLegends.map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded border-2 ${color}`} />
              <span className="text-foreground">{label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
