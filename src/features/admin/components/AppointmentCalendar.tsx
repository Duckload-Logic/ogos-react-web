import { ChevronLeft, ChevronRight } from "lucide-react";

interface Appointment {
  id: string;
  studentName: string;
  date: string;
  time: string;
  reason: string;
  status: "scheduled" | "completed" | "cancelled";
  date_raw: string;
}

interface CalendarProps {
  currentMonth: Date;
  appointments: Appointment[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export default function AppointmentCalendar({
  currentMonth,
  appointments,
  onPrevMonth,
  onNextMonth,
}: CalendarProps) {
  const bookedDates = new Set(
    appointments.map((apt) => new Date(apt.date_raw).getDate()),
  );

  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === currentMonth.getFullYear() &&
    today.getMonth() === currentMonth.getMonth();
  const todayDate = today.getDate();

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthName = currentMonth.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onPrevMonth}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <ChevronLeft size={16} className="text-foreground" />
        </button>
        <h2 className="text-base font-bold text-foreground">{monthName}</h2>
        <button
          onClick={onNextMonth}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <ChevronRight size={16} className="text-foreground" />
        </button>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 gap-1 mb-3">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div
            key={day}
            className="text-center font-semibold text-gray-600 text-xs"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">
        {emptyDays.map((_, idx) => (
          <div key={`empty-${idx}`} />
        ))}
        {days.map((day) => {
          const isBooked = bookedDates.has(day);
          const isToday = isCurrentMonth && day === todayDate;

          return (
            <div
              key={day}
              className={`
                aspect-square flex items-center justify-center rounded text-xs font-medium cursor-pointer
                transition-colors hover:bg-gray-100
                ${
                  isToday
                    ? "bg-primary text-primary-foreground font-bold"
                    : isBooked
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "text-foreground"
                }
              `}
            >
              {day}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground mt-4 text-center">
        Blue dates have appointments
      </p>
    </div>
  );
}
