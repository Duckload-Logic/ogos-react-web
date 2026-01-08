import Layout from "@/components/Layout";
import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Eye, Clock } from "lucide-react";

interface Appointment {
  id: string;
  studentName: string;
  date: string;
  time: string;
  reason: string;
  status: "scheduled" | "completed" | "cancelled";
  date_raw: string;
}

export default function Appointments() {
  const [appointments] = useState<Appointment[]>([
    {
      id: "001",
      studentName: "Juan Dela Cruz",
      date: "Jan 15, 2025",
      time: "09:00 AM",
      reason: "Academic counseling",
      status: "scheduled",
      date_raw: "2025-01-15",
    },
    {
      id: "002",
      studentName: "Maria Santos",
      date: "Jan 15, 2025",
      time: "10:00 AM",
      reason: "Personal concerns",
      status: "scheduled",
      date_raw: "2025-01-15",
    },
    {
      id: "003",
      studentName: "Carlos Reyes",
      date: "Jan 14, 2025",
      time: "02:00 PM",
      reason: "Course selection",
      status: "completed",
      date_raw: "2025-01-14",
    },
    {
      id: "004",
      studentName: "Angela Dela Cruz",
      date: "Jan 13, 2025",
      time: "11:00 AM",
      reason: "Scholarship inquiry",
      status: "cancelled",
      date_raw: "2025-01-13",
    },
  ]);

  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 0)); // January 2025
  const touchStartX = useRef<number | null>(null);

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

  const previousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
    );
  };

  const monthName = currentMonth.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout title="View Schedule">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Total Appointments",
              value: appointments.length,
              color: "bg-blue-100 text-blue-600",
            },
            {
              label: "Scheduled",
              value: appointments.filter((a) => a.status === "scheduled")
                .length,
              color: "bg-yellow-100 text-yellow-600",
            },
            {
              label: "Completed",
              value: appointments.filter((a) => a.status === "completed")
                .length,
              color: "bg-green-100 text-green-600",
            },
            {
              label: "Cancelled",
              value: appointments.filter((a) => a.status === "cancelled")
                .length,
              color: "bg-red-100 text-red-600",
            },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.color} p-4 rounded-lg`}>
              <p className="text-sm font-medium opacity-75">{stat.label}</p>
              <p className="text-3xl font-bold mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar */}
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
                <div key={`empty-${idx}`} />
              ))}
              {days.map((day) => {
                const isBooked = bookedDates.has(day);
                const isToday = isCurrentMonth && day === todayDate;

                return (
                  <div
                    key={day}
                    className={`p-1 rounded text-center font-medium text-xs transition-colors ${
                      isToday
                        ? "border-2 border-primary bg-white text-foreground"
                        : isBooked
                          ? "bg-primary text-primary-foreground"
                          : "bg-gray-100 text-foreground"
                    }`}
                  >
                    {day}
                  </div>
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
                const isBooked = bookedDates.has(day);
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

            {/* Legend */}
            <div className="pt-4 border-t border-gray-200 space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-primary rounded"></div>
                <span className="text-foreground">Scheduled</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-foreground">Completed</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span className="text-foreground">Cancelled</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-gray-100 rounded border border-gray-300"></div>
                <span className="text-foreground">No Appts</span>
              </div>
            </div>
          </div>

          {/* Appointments List */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
              <div className="p-5 border-b border-gray-200">
                <h2 className="text-lg font-bold text-foreground">
                  All Appointments
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-primary text-primary-foreground">
                      <th className="px-4 py-3 text-left font-semibold text-xs">
                        Student
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-xs">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-xs">
                        Time
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-xs">
                        Reason
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-xs">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-xs">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {appointments.map((apt, idx) => (
                      <tr
                        key={apt.id}
                        className={`hover:bg-gray-50 transition-colors ${
                          idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        <td className="px-4 py-3 font-medium text-foreground text-xs">
                          {apt.studentName}
                        </td>
                        <td className="px-4 py-3 text-foreground text-xs">
                          {apt.date}
                        </td>
                        <td className="px-4 py-3 text-foreground text-xs">
                          {apt.time}
                        </td>
                        <td className="px-4 py-3 text-foreground text-xs">
                          {apt.reason}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}
                          >
                            {apt.status.charAt(0).toUpperCase() +
                              apt.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button className="flex items-center gap-1 px-2 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-xs font-medium">
                            <Eye size={12} />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {appointments.length === 0 && (
                <div className="px-6 py-12 text-center">
                  <p className="text-gray-500">No appointments scheduled.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}


