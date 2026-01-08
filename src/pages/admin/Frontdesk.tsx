import Layout from "@/components/Layout";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Edit2, Trash2, Plus, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Schedule {
  id: string;
  adminName: string;
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  description?: string;
}

export default function Frontdesk() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0)); // January 2026
  const [schedules, setSchedules] = useState<Schedule[]>([
    {
      id: "1",
      adminName: "Ms. Garcia",
      date: "2026-01-06",
      startTime: "09:00",
      endTime: "10:00",
      title: "Student Counseling",
      description: "Academic guidance session",
    },
    {
      id: "2",
      adminName: "Mr. Santos",
      date: "2026-01-06",
      startTime: "10:30",
      endTime: "11:30",
      title: "Curriculum Review",
      description: "Course planning discussion",
    },
    {
      id: "3",
      adminName: "Ms. Garcia",
      date: "2026-01-07",
      startTime: "14:00",
      endTime: "15:00",
      title: "Staff Meeting",
      description: "Department meeting",
    },
  ]);

  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDateForNewSchedule, setSelectedDateForNewSchedule] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Schedule, "id">>({
    adminName: "",
    date: "",
    startTime: "",
    endTime: "",
    title: "",
    description: "",
  });

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getDayOfWeek = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Format date functions
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Get schedules for a specific date
  const getSchedulesForDate = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return schedules.filter((s) => s.date === dateStr);
  };

  // Handle add/edit schedule
  const handleSaveSchedule = () => {
    if (!formData.adminName || !formData.date || !formData.startTime || !formData.endTime || !formData.title) {
      alert("Please fill in all required fields");
      return;
    }

    if (editingSchedule) {
      setSchedules(
        schedules.map((s) =>
          s.id === editingSchedule.id ? { ...formData, id: editingSchedule.id } : s
        )
      );
    } else {
      setSchedules([
        ...schedules,
        {
          ...formData,
          id: Date.now().toString(),
        },
      ]);
    }

    setFormData({
      adminName: "",
      date: "",
      startTime: "",
      endTime: "",
      title: "",
      description: "",
    });
    setEditingSchedule(null);
    setIsDialogOpen(false);
  };

  // Handle edit schedule
  const handleEditSchedule = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setFormData(schedule);
    setSelectedDateForNewSchedule(null);
    setIsDialogOpen(true);
  };

  // Handle add schedule for a specific date
  const handleAddScheduleForDate = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setEditingSchedule(null);
    setSelectedDateForNewSchedule(dateStr);
    setFormData({
      adminName: "",
      date: dateStr,
      startTime: "",
      endTime: "",
      title: "",
      description: "",
    });
    setIsDialogOpen(true);
  };

  // Handle delete schedule
  const handleDeleteSchedule = (id: string) => {
    if (confirm("Are you sure you want to delete this schedule?")) {
      setSchedules(schedules.filter((s) => s.id !== id));
    }
  };

  // Generate calendar grid
  const calendarDays = [];
  const daysInMonth = getDaysInMonth(currentMonth);
  const startingDayOfWeek = getDayOfWeek(currentMonth);

  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const monthName = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Frontdesk Dashboard</h1>
          <p className="text-gray-600 mt-2">View and manage admin schedules</p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="col-span-2 p-6">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">{monthName}</h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 gap-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center font-semibold text-sm text-gray-600 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, index) => {
                  const daySchedules = day ? getSchedulesForDate(day) : [];
                  const isToday = day === new Date().getDate() && currentMonth.getMonth() === new Date().getMonth() && currentMonth.getFullYear() === new Date().getFullYear();

                  return (
                    <div
                      key={index}
                      onClick={() => day && handleAddScheduleForDate(day)}
                      className={`min-h-24 p-2 border rounded-lg transition-colors ${
                        day
                          ? "bg-white hover:bg-blue-50 cursor-pointer border-gray-200 hover:border-blue-400"
                          : "bg-gray-50"
                      } ${isToday ? "border-blue-500 bg-blue-50" : ""}`}
                    >
                      {day && (
                        <div className="space-y-1 h-full flex flex-col">
                          <div className={`text-sm font-semibold ${isToday ? "text-blue-600" : "text-gray-900"}`}>
                            {day}
                          </div>
                          <div className="flex-1 space-y-1 overflow-y-auto">
                            {daySchedules.length === 0 && (
                              <div className="text-xs text-gray-400 italic">Click to add schedule</div>
                            )}
                            {daySchedules.map((schedule) => (
                              <div
                                key={schedule.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditSchedule(schedule);
                                }}
                                className="bg-blue-100 text-blue-700 text-xs p-1 rounded truncate hover:bg-blue-200 cursor-pointer transition-colors"
                                title={`${schedule.title}\n${formatTime(schedule.startTime)} - ${formatTime(schedule.endTime)}\n${schedule.adminName}`}
                              >
                                {schedule.title}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Sidebar - Schedule Dialog */}
          <div className="space-y-4">
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) {
                setEditingSchedule(null);
                setSelectedDateForNewSchedule(null);
              }
            }}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingSchedule ? "Edit Schedule" : "Add New Schedule"}</DialogTitle>
                  <DialogDescription>
                    {editingSchedule ? "Update the schedule details below" : "Create a new admin schedule"}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="adminName">Admin Name *</Label>
                    <Input
                      id="adminName"
                      value={formData.adminName}
                      onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                      placeholder="Enter admin name"
                      className="mb-4"
                    />
                  </div>
                  <div>
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="mb-4"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startTime">Start Time *</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        className="mb-4"
                      />
                    </div>
                    <div>
                      <Label htmlFor="endTime">End Time *</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        className="mb-4"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Student Counseling"
                      className="mb-4"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={formData.description || ""}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Optional description"
                      className="mb-4"
                    />
                  </div>
                  <div className="flex gap-2 justify-end pt-4">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveSchedule}>
                      {editingSchedule ? "Update" : "Create"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Recent Schedules */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Upcoming Schedules</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {schedules
                  .filter((s) => new Date(s.date) >= new Date(new Date().setHours(0, 0, 0, 0)))
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .slice(0, 5)
                  .map((schedule) => (
                    <div key={schedule.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">{schedule.title}</p>
                          <p className="text-xs text-gray-600">{schedule.adminName}</p>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEditSchedule(schedule)}
                            className="p-1 hover:bg-blue-100 rounded"
                          >
                            <Edit2 className="h-4 w-4 text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleDeleteSchedule(schedule.id)}
                            className="p-1 hover:bg-red-100 rounded"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600">
                        <p>{formatDate(schedule.date)}</p>
                        <p>{formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}


