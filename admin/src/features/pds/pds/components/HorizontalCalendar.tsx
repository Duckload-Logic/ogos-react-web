import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HorizontalCalendarProps {
  value?: string;
  onChange?: (date: string) => void;
  minDate?: string;
  maxDate?: string;
}

export function HorizontalCalendar({
  value = "",
  onChange,
  minDate,
  maxDate,
}: HorizontalCalendarProps) {
  const today = new Date();
  const [displayMonth, setDisplayMonth] = useState(today.getMonth());
  const [displayYear, setDisplayYear] = useState(today.getFullYear());

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const previousMonth = () => {
    if (displayMonth === 0) {
      setDisplayMonth(11);
      setDisplayYear(displayYear - 1);
    } else {
      setDisplayMonth(displayMonth - 1);
    }
  };

  const nextMonth = () => {
    if (displayMonth === 11) {
      setDisplayMonth(0);
      setDisplayYear(displayYear + 1);
    } else {
      setDisplayMonth(displayMonth + 1);
    }
  };

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(displayYear, displayMonth, day);
    const formattedDate = selectedDate.toISOString().split("T")[0];
    onChange?.(formattedDate);
  };

  const daysInMonth = getDaysInMonth(displayMonth, displayYear);
  const firstDay = getFirstDayOfMonth(displayMonth, displayYear);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const selectedDate = value ? new Date(value + "T00:00:00") : null;
  const isCurrentMonth =
    selectedDate?.getMonth() === displayMonth &&
    selectedDate?.getFullYear() === displayYear;

  return (
    <div className="w-full p-4 border border-gray-300 rounded-lg bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={previousMonth}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="text-center min-w-[200px]">
          <h2 className="text-lg font-semibold text-gray-900">
            {monthNames[displayMonth]} {displayYear}
          </h2>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={nextMonth}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Weekday Headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}

        {/* Empty cells for days before the 1st */}
        {emptyDays.map((i) => (
          <div key={`empty-${i}`} className="p-2" />
        ))}

        {/* Calendar days */}
        {days.map((day) => {
          const currentDate = new Date(displayYear, displayMonth, day);
          const formattedCurrentDate = currentDate.toISOString().split("T")[0];
          const isSelected = isCurrentMonth && selectedDate?.getDate() === day;

          return (
            <button
              key={day}
              onClick={() => handleDateSelect(day)}
              className={`p-2 text-sm font-medium rounded transition ${
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-gray-100 text-gray-900"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Selected Date Display */}
      {value && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Selected: <span className="font-semibold text-gray-900">{value}</span>
          </p>
        </div>
      )}
    </div>
  );
}
