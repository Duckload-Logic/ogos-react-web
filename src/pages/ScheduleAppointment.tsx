import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ChevronLeft, ChevronRight, Check, AlertCircle } from "lucide-react";
import { useAppointments } from "@/features/appointments/hooks/useAppointments";
import { useAuth } from "@/context";

export default function ScheduleAppointment() {
  const { user } = useAuth();
  const {
    availableSlots,
    loading,
    error,
    fetchAvailableSlots,
    createAppointment,
    clearError,
  } = useAppointments();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [reason, setReason] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch available slots when date changes
  useEffect(() => {
  if (selectedDate) {
    // 1. Extract local year, month, and day
    const year = selectedDate.getFullYear();
    // Months are 0-indexed in JS, so add 1. Pad with '0' for YYYY-MM-DD format.
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    
    // 2. Combine into the accurate date string
    const formattedDate = `${year}-${month}-${day}`;
    
    // 3. Trigger the fetch with the accurate string
    fetchAvailableSlots(formattedDate);
    setSelectedTime("");
  }
}, [selectedDate, fetchAvailableSlots]);

  const handleSchedule = async () => {
    if (!selectedDate || !selectedTime || !reason.trim()) {
      alert("Please fill in all fields");
      return;
    }

    if (!user?.id) {
      alert("User not authenticated");
      return;
    }

    setIsSubmitting(true);
    clearError();

    try {
      const appointment = await createAppointment({
        userId: user.id,
        reason: reason,
        scheduledDate: selectedDate.toISOString().split('T')[0],
        scheduledTime: selectedTime,
        concernCategory: '',
      });

      if (appointment) {
        setSuccessMessage(
          `Appointment scheduled successfully! ID: ${appointment.id}`,
        );

        // Reset form
        setSelectedDate(undefined);
        setSelectedTime("");
        setReason("");

        // Clear success message after 5 seconds
        setTimeout(() => setSuccessMessage(""), 5000);
      }
    } catch (err) {
      console.error("Failed to schedule appointment:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary text-primary-foreground py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center gap-4">
            <Link to="/guidance-services">
              <ArrowLeft className="w-6 h-6 hover:opacity-80 transition" />
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Schedule an Appointment
              </h1>
              <p className="text-base md:text-lg mt-2 opacity-90">
                Select a date and time for your counseling session
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div>
              <p className="font-semibold text-red-900">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 py-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <Check className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-semibold text-green-900">{successMessage}</p>
              <p className="text-sm text-green-700">
                You will receive a confirmation email shortly.
              </p>
            </div>
          </div>
        </div>
      )}

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
                    onClick={handlePrevMonth}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
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
          
          {availableSlots.length}
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
                    {loading ? (
                      <p className="text-gray-500 text-center py-8 text-sm">
                        Loading available times...
                      </p>
                    ) : availableSlots.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                        {availableSlots.map((slot) => (
                          <button
                            key={slot.slotId}
                            onClick={() => setSelectedTime(slot.startTime)}
                            disabled={!slot.isNotTaken}
                            className={`pill py-2 px-2 rounded-lg font-medium transition-colors text-xs sm:text-sm ${
                              selectedTime === slot.startTime
                                ? "bg-primary text-primary-foreground"
                                : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                            }`}
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
                  Concern Category
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full border rounded p-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your concern or reason for appointment"
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
                  <p className="text-sm text-blue-800">
                    Time: {selectedTime}
                  </p>
                </div>
              )}

              <Button
                onClick={handleSchedule}
                disabled={!selectedDate || !selectedTime || isSubmitting || loading}
                className="w-full bg-primary hover:bg-primary-dark text-primary-foreground font-semibold py-3 text-base"
              >
                {isSubmitting ? "Scheduling..." : "Confirm Appointment"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}