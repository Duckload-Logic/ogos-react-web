import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

const TIME_SLOTS = [
  "9:00 AM - 9:30 AM",
  "9:30 AM - 10:00 AM",
  "10:00 AM - 10:30 AM",
  "10:30 AM - 11:00 AM",
  "11:00 AM - 11:30 AM",
  "11:30 AM - 12:00 PM",
  "1:00 PM - 1:30 PM",
  "1:30 PM - 2:00 PM",
  "2:00 PM - 2:30 PM",
  "2:30 PM - 3:00 PM",
  "3:00 PM - 3:30 PM",
  "3:30 PM - 4:00 PM",
];

export default function ScheduleAppointment() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [reason, setReason] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 11));

  const handleSchedule = () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select both date and time");
      return;
    }
    alert(
      `Appointment scheduled for ${selectedDate.toDateString()} at ${selectedTime}`,
    );
    setSelectedDate(undefined);
    setSelectedTime("");
    setReason("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary text-primary-foreground py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h1 className="text-3xl md:text-4xl font-bold">
            Schedule an Appointment
          </h1>
          <p className="text-base md:text-lg mt-2 opacity-90">
            Select a date and time for your counseling session
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 py-6 sm:py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Calendar Section */}
          <div className="flex-1 lg:min-w-0">
            <Card className="border-0 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                <CardTitle className="text-xl">Select Date</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() =>
                      setCurrentMonth(
                        new Date(
                          currentMonth.getFullYear(),
                          currentMonth.getMonth() - 1,
                        ),
                      )
                    }
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-lg font-semibold">
                    {currentMonth.toLocaleString("default", {
                      month: "long",
                      year: "numeric",
                    })}
                  </h2>
                  <button
                    onClick={() =>
                      setCurrentMonth(
                        new Date(
                          currentMonth.getFullYear(),
                          currentMonth.getMonth() + 1,
                        ),
                      )
                    }
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Calendar Grid */}
                <div className="space-y-4">
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

                  <div className="grid grid-cols-7 gap-3">
                    {Array.from({ length: 42 }).map((_, index) => {
                      const firstDay = new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth(),
                        1,
                      ).getDay();
                      const daysInMonth = new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth() + 1,
                        0,
                      ).getDate();

                      if (index < firstDay || index >= firstDay + daysInMonth) {
                        return <div key={index} />;
                      }

                      const day = index - firstDay + 1;
                      const date = new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth(),
                        day,
                      );

                      const isSelected =
                        selectedDate &&
                        selectedDate.toDateString() === date.toDateString();
                      const isAvailable =
                        date > new Date() &&
                        date.getDay() !== 0 &&
                        date.getDay() !== 6;

                      return (
                        <button
                          key={index}
                          onClick={() => isAvailable && setSelectedDate(date)}
                          disabled={!isAvailable}
                          className={`h-12 rounded-lg font-semibold transition-colors text-sm flex items-center justify-center ${
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : isAvailable
                                ? "bg-gray-100 hover:bg-gray-200 text-gray-900"
                                : "text-gray-300 cursor-not-allowed"
                          }`}
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

          {/* Time Slots Section */}
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
                    <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                      {TIME_SLOTS.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setSelectedTime(slot)}
                          className={`py-2 px-2 rounded-lg font-medium transition-colors text-xs sm:text-sm ${
                            selectedTime === slot
                              ? "bg-primary text-primary-foreground"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500 text-center py-8 text-sm">
                    Select a date to see available times
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reason Section */}
        <Card className="border-0 shadow-sm mt-8">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
            <CardTitle className="text-lg">Appointment Details</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reason for Appointment
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full border rounded p-2 h-24 resize-none"
                  placeholder="Enter reason for appointment"
                />
              </div>

              {selectedDate && selectedTime && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900">
                    <span className="font-semibold">Appointment Summary:</span>
                  </p>
                  <p className="text-sm text-blue-800 mt-1">
                    Date: {selectedDate.toDateString()}
                  </p>
                  <p className="text-sm text-blue-800">Time: {selectedTime}</p>
                </div>
              )}

              <Button
                onClick={handleSchedule}
                disabled={!selectedDate || !selectedTime}
                className="w-full bg-primary hover:bg-primary-dark text-primary-foreground font-semibold py-3 text-base"
              >
                Confirm Appointment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
