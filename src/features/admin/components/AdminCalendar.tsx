import { ChevronLeft, ChevronRight } from "lucide-react";

interface AdminCalendarProps {
  currentYear: number;
  currentMonth: number;
  previousMonth: () => void;
  nextMonth: () => void;
  monthName: string;
  emptyDays: number[];
  days: number[];
  bookedDates: Set<string>;
  isCurrentMonth: boolean;
  todayDate: number;
  touchStartX: React.MutableRefObject<number | null>;
  selectedDate?: Date;
  onDateClick?: (day: number) => void;
  legends?: { color: string; label: string }[];
  occupiedDayColor?: string;
}


export const AdminCalendar = (
  { currentYear, currentMonth, 
    previousMonth, nextMonth, 
    monthName, emptyDays, 
    days, bookedDates, 
    isCurrentMonth, todayDate, 
    touchStartX, selectedDate, 
    onDateClick, legends, occupiedDayColor }: AdminCalendarProps) => {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={previousMonth}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <ChevronLeft size={16} className="text-foreground" />
        </button>
        <h2 className="text-base font-bold text-foreground">
          {monthName}
        </h2>
        <button
          onClick={nextMonth}
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

      {/* Calendar Days - desktop (7 columns) */}
      <div className="hidden sm:grid grid-cols-7 gap-1 mb-4">
        {emptyDays.map((_, idx) => (
          <button key={`empty-${idx}`} disabled/>
        ))}
        {days.map((day) => {
          const dateObj = new Date(currentYear, currentMonth, day);
          const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 6 = Saturday
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

          const isBooked = bookedDates.has(`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
          const isToday = isCurrentMonth && day === todayDate;

          const isSelected = selectedDate?.getDate() === day && 
                     selectedDate.getMonth() === currentMonth && 
                     selectedDate.getFullYear() === currentYear;

          return (
            <button
              key={day}
              disabled={isWeekend || day < todayDate}
              className={
                `p-1 rounded text-center font-medium text-xs 
                transition-colors w-full hover:ring-2 
                hover:ring-primary focus:outline-none 
                focus:ring-2 focus:ring-primary/50 
                pressed:scale-95
                ${isWeekend || day < todayDate ? "opacity-50 cursor-not-allowed" : ""}
                ${isBooked 
                  ? `${occupiedDayColor || "bg-primary"} text-white` 
                  : isSelected 
                    ? "bg-primary/10 text-primary font-bold ring-2 ring-primary" 
                    : "bg-gray-100 text-foreground"
                }
                ${isToday ? "border-2 border-primary" : ""}
              `}
              onClick={() => onDateClick?.(day)}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Mobile calendar: stacked list for small screens */}
      <div className="sm:hidden mb-2 flex items-center justify-between gap-2">
        <button
          onClick={previousMonth}
          aria-label="Previous month"
          className="p-2 bg-gray-100 rounded-md"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="text-sm font-medium">{monthName}</div>
        <button
          onClick={nextMonth}
          aria-label="Next month"
          className="p-2 bg-gray-100 rounded-md"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div
        className="sm:hidden mb-6 space-y-2"
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current == null) return;
          const dx = e.changedTouches[0].clientX - touchStartX.current;
          const threshold = 50;
          if (dx < -threshold) {
            nextMonth();
          } else if (dx > threshold) {
            previousMonth();
          }
          touchStartX.current = null;
        }}
      >
        {days.map((day) => {
          const isBooked = bookedDates.has(`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
          const isToday = isCurrentMonth && day === todayDate;
          return (
            <div
              key={`mobile-${day}`}
              className={`flex items-center justify-between p-3 rounded-lg text-sm font-medium transition-colors ${
                isToday
                  ? "border-2 border-primary bg-white text-foreground"
                  : isBooked
                    ? "bg-primary text-primary-foreground"
                    : "bg-gray-100 text-foreground"
              }`}
            >
              <div>Day {day}</div>
              <div className="text-xs font-medium">
                {isToday ? "Today" : isBooked ? "Booked" : "Available"}
              </div>
            </div>
          );
        })}

        <div className="text-center text-xs text-gray-500 mt-2">
          Swipe left/right to change month
        </div>
      </div>

      {/* legends */}
      <div className="pt-4 border-t border-gray-200 space-y-2">
        <div className="flex items-center gap-2 text-xs">
          <div className={`w-3 h-3 rounded bg-gray-200 border border-primary`}></div>
          <span className="text-foreground">Today</span>
        </div>
        {legends?.map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2 text-xs">
            <div className={`w-3 h-3 rounded ${color}`}></div>
            <span className="text-foreground">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}