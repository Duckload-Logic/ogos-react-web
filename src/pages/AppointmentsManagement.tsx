import Layout from "@/components/Layout";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Eye, Check, X, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface PendingAppointment {
  id: string;
  studentName: string;
  requestedDate: string;
  requestedTime: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  requestedDate_raw: string;
}

export default function AppointmentsManagement() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 0)); // January 2025
  const [pendingAppointments, setPendingAppointments] = useState<
    PendingAppointment[]
  >([
    {
      id: "101",
      studentName: "Juan Dela Cruz",
      requestedDate: "Jan 20, 2025",
      requestedTime: "9:00 AM - 10:00 AM",
      reason: "Academic counseling",
      status: "pending",
      requestedDate_raw: "2025-01-20",
    },
    {
      id: "102",
      studentName: "Maria Santos",
      requestedDate: "Jan 22, 2025",
      requestedTime: "2:00 PM - 3:00 PM",
      reason: "Course selection help",
      status: "pending",
      requestedDate_raw: "2025-01-22",
    },
    {
      id: "103",
      studentName: "Carlos Reyes",
      requestedDate: "Jan 25, 2025",
      requestedTime: "10:00 AM - 11:00 AM",
      reason: "Scholarship inquiry",
      status: "approved",
      requestedDate_raw: "2025-01-25",
    },
  ]);

  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const bookedDates = new Set([3, 5, 10, 15, 20, 22, 25]); // Dates with appointments

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

  const updateAppointmentStatus = (id: string, status: string) => {
    setPendingAppointments(
      pendingAppointments.map((apt) =>
        apt.id === id ? { ...apt, status: status as any } : apt,
      ),
    );
  };

  const filteredAppointments = pendingAppointments.filter((apt) => {
    const statusMatch = statusFilter === "all" || apt.status === statusFilter;

    let dateMatch = true;
    if (startDate || endDate) {
      const aptDate = new Date(apt.requestedDate_raw).getTime();
      const start = startDate ? new Date(startDate).getTime() : 0;
      const end = endDate ? new Date(endDate).getTime() + 86400000 : Infinity;
      dateMatch = aptDate >= start && aptDate <= end;
    }

    return statusMatch && dateMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout title="Appointments">
      <div className="space-y-6">
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>Note:</strong> Students request appointments in their
            portal. This page is for approving, rejecting, or managing
            appointment requests.
          </p>
        </div>

        {/* Quick Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-6 rounded-lg shadow border border-gray-200">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              From Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              To Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar View */}
          <div className="lg:col-span-1">
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

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {emptyDays.map((_, idx) => (
                  <div key={`empty-${idx}`} />
                ))}
                {days.map((day) => {
                  const isBooked = bookedDates.has(day);

                  return (
                    <div
                      key={day}
                      className={`p-1 rounded text-center font-medium text-xs transition-colors ${
                        isBooked
                          ? "bg-primary text-primary-foreground"
                          : "bg-gray-100 text-foreground"
                      }`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 bg-primary rounded"></div>
                  <span className="text-foreground">Booked</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 bg-gray-100 rounded border border-gray-300"></div>
                  <span className="text-foreground">No Appts</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Requests Table */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
              <div className="p-5 border-b border-gray-200">
                <h2 className="text-lg font-bold text-foreground">
                  Appointment Requests
                </h2>
                <p className="text-xs text-gray-600 mt-1">
                  Review and approve/reject requests
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-primary text-primary-foreground">
                      <th className="px-4 py-3 text-left font-semibold text-xs">
                        Student
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-xs">
                        Req. Date
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
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredAppointments.map((apt, idx) => (
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
                          {apt.requestedDate}
                        </td>
                        <td className="px-4 py-3 text-foreground text-xs">
                          {apt.requestedTime}
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
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <button className="flex items-center gap-1 px-2 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-xs font-medium">
                              <Eye size={12} />
                              View
                            </button>
                            {apt.status === "pending" && (
                              <>
                                <button
                                  onClick={() =>
                                    updateAppointmentStatus(apt.id, "approved")
                                  }
                                  className="flex items-center gap-1 px-2 py-1.5 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-xs font-medium"
                                >
                                  <Check size={12} />
                                  OK
                                </button>
                                <button
                                  onClick={() =>
                                    updateAppointmentStatus(apt.id, "rejected")
                                  }
                                  className="flex items-center gap-1 px-2 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-xs font-medium"
                                >
                                  <X size={12} />
                                  No
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {pendingAppointments.length === 0 && (
                <div className="px-6 py-12 text-center">
                  <p className="text-gray-500">
                    No appointment requests pending.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Available Time Slots Management */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">
            Manage Availability
          </h2>
          <AvailabilityForm />
        </div>
      </div>
    </Layout>
  );
}

function AvailabilityForm() {
  const schema = z.object({
    days: z.array(z.string()).nonempty("Select at least one day"),
    slots: z.array(z.string()).nonempty("Select at least one time slot"),
  });

  type FormValues = z.infer<typeof schema>;

  const { register, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      slots: ["8:00 AM - 9:00 AM", "9:00 AM - 10:00 AM"],
    },
  });

  const daysList = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const slotsList = [
    "8:00 AM - 9:00 AM",
    "9:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "2:00 PM - 3:00 PM",
  ];

  const onSubmit = (values: FormValues) => {
    alert("Availability saved");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Set Available Days
          </label>
          <div className="space-y-2">
            {daysList.map((day) => (
              <label
                key={day}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  value={day}
                  {...register("days")}
                  className="w-4 h-4 rounded"
                />
                <span className="text-foreground">{day}</span>
              </label>
            ))}
          </div>
          {formState.errors.days && (
            <p className="text-sm text-destructive">
              {String(formState.errors.days?.message)}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Available Time Slots
          </label>
          <div className="space-y-2">
            {slotsList.map((slot) => (
              <label
                key={slot}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  value={slot}
                  {...register("slots")}
                  className="w-4 h-4 rounded"
                />
                <span className="text-foreground text-sm">{slot}</span>
              </label>
            ))}
          </div>
          {formState.errors.slots && (
            <p className="text-sm text-destructive">
              {String(formState.errors.slots?.message)}
            </p>
          )}
        </div>
      </div>
      <button className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
        Save Availability Settings
      </button>
    </form>
  );
}
