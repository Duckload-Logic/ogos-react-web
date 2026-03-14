import { useEffect, useMemo, useRef } from "react";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCalendarStats } from "../hooks/useCalendar";
import { DailyStatusCount } from "../types/calendar";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { Button } from "react-day-picker";

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
    <>
      {/* Mobile View: Modal Trigger */}
      <div className="sm:hidden w-full">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="w-full flex justify-between items-center h-12 px-4
              border-dashed border-2"
            >
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-primary" />
                <span className="font-semibold">
                  {selectedDate
                    ? selectedDate.toLocaleDateString()
                    : "Select Appointment Date"}
                </span>
              </div>
              <span
                className="text-xs text-muted-foreground bg-muted px-2
              py-1 rounded"
              >
                Change
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent
            className="w-[95%] max-w-md p-0 overflow-hidden
          rounded-2xl border-none"
          >
            <DialogTitle className="sr-only">Select Date</DialogTitle>
            <CalendarContent />
          </DialogContent>
        </Dialog>
      </div>

      {/* Desktop View: Inline Card */}
      <div className="hidden sm:block">
        <Card
          className={`shadow-sm bg-card border border-border h-fit
        ${className ?? ""}`}
        >
          {hasHeader && (
            <CardHeader
              className="bg-gradient-to-r from-muted/50 to-muted
            border-b border-border rounded-t-md"
            >
              <CardTitle className="text-xl text-foreground">{title}</CardTitle>
            </CardHeader>
          )}
          <CardContent className="pt-6 bg-card rounded-b-md">
            <CalendarContent />
          </CardContent>
        </Card>
      </div>
    </>
  );

  // Internal Component to avoid code duplication
  function CalendarContent() {
    return (
      <div className="flex flex-col p-4 sm:p-0">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-muted rounded transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold min-w-40 text-center">
            {monthName}
          </h2>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-muted rounded transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="space-y-4">
          {/* Day Headers */}
          <div className="grid grid-cols-7 text-center">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <div
                key={day}
                className="font-bold text-xs text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
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
                <div key={day} className="relative group flex justify-center">
                  <button
                    onClick={() => {
                      handleDateClick(day);
                      // If on mobile, you might want logic to close modal here
                    }}
                    disabled={isDisabled}
                    className={`
                    size-10 sm:size-12 rounded-xl font-semibold text-sm
                    flex items-center justify-center transition-all text-nowrap
                    ${
                      isSelected
                        ? "bg-primary text-primary-foreground scale-110 shadow-lg"
                        : "bg-muted hover:bg-muted/80 text-foreground"
                    }
                    ${isDisabled ? "opacity-30 cursor-not-allowed" : ""}
                    ${isToday && !isSelected ? "border-2 border-primary" : ""}
                  `}
                  >
                    {day}
                  </button>
                  {/* Admin Stats Dots */}
                  {isAdmin && statsMap[dateKey] && (
                    <div className="absolute -bottom-1 flex gap-0.5">
                      {statsMap[dateKey].PendingCount > 0 && (
                        <div className="size-1.5 rounded-full bg-warning" />
                      )}
                      {statsMap[dateKey].ScheduledCount > 0 && (
                        <div className="size-1.5 rounded-full bg-info" />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 pt-4 border-t border-border flex flex-wrap gap-3">
          {displayLegends.map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2 text-xs">
              <div className={`size-3 rounded-full border ${color}`} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
