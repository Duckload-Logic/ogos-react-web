import Layout from "@/components/Layout";
import {
  Calendar,
  Users,
  FileText,
  TrendingUp,
  Eye,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { AdminCalendar } from "../components/AdminCalendar";
import { AppointmentsList } from "../components/AppointmentsList";
import { useAdminAppointments } from "../hooks/useAdminAppointments";

export default function Dashboard() {
  const { appointments, fetchAppointments } = useAdminAppointments();
  const { fetchUserData } = useUser();
  const [students, setStudents] = useState<any[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const touchStartX = useRef<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    const fetchAllAppointments = async () => {
      await fetchAppointments();
    }

    fetchAllAppointments();
  }, [fetchAppointments])

  useEffect(() => {
    const fetchAllStudents = async () => {
      if (appointments.length === 0) return;

      try {
        // Get unique IDs to avoid redundant API calls
        const uniqueStudentIds = [...new Set(appointments.map((apt) => apt.userId))];
        
        // Fetch all user data in parallel
        const studentData = await Promise.all(
          uniqueStudentIds.map((id) => fetchUserData(id))
        );
        
        setStudents(studentData);
      } catch (err) {
        console.error("Failed to fetch students:", err);
      }
    };

    fetchAllStudents();
  }, [appointments]);

  const bookedDates = new Set(
    appointments
      .filter((apt) => ["Approved", "Rescheduled"].includes(apt.status))
      .map((apt) => {
        const date = new Date(apt.scheduledDate);
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const d = String(date.getDate()).padStart(2, '0');
        
        return `${y}-${m}-${d}`; 
      })
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

  const calendarLegends = [
    { color: "bg-primary", label: "Scheduled Appointments" },
  ];

  const stats = [
    {
      label: "Scheduled",
      value: appointments.filter((a) => ['Approved', 'Rescheduled'].includes(a.status)).length,
      color: "bg-blue-100/90 text-blue-600 ",
    },
    {
      label: "Pending Requests",
      value: appointments.filter((a) => a.status === "Pending").length,
      color: "bg-yellow-100/90 text-yellow-600",
    },
    {
      label: "Completed",
      value: appointments.filter((a) => a.status === "Completed").length,
      color: "bg-green-100/90 text-green-600",
    },
    {
      label: "Cancelled",
      value: appointments.filter((a) => a.status === "Cancelled").length,
      color: "bg-red-100/90 text-red-600",
    },
  ];

  const appointmentActions = [
    {
      purpose: "View",
      label: <Eye size={16}/>, 
      color: "bg-gray-500 text-white", 
      onClick: (appointment: any) => {
        console.log("View appointment", appointment);
      }}
  ];

  const quickActions = [
    {
      title: "View Appointments",
      description: "Manage appointment requests from students",
      icon: Calendar,
      href: "/admin/appointments",
    },
    {
      title: "Student Records",
      description: "View and manage student information",
      icon: Users,
      href: "/admin/student-records",
    },
    {
      title: "Review Excuses",
      description: "Review and approve student excuse slips",
      icon: FileText,
      href: "/admin/review-excuses",
    },
    {
      title: "Reports",
      description: "Generate and analyze guidance reports",
      icon: TrendingUp,
      href: "/admin/reports",
    },
  ];

  return (
    <Layout title="Dashboard">
      <div className="flex flex-col gap-6 h-full">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className={`${stat.color} p-4 rounded-lg`}>
              <p className="text-sm font-medium opacity-75">{stat.label}</p>
              <p className="text-3xl font-bold mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
          {/* Calendar */}
          <AdminCalendar
            currentYear={currentMonth.getFullYear()}
            currentMonth={currentMonth.getMonth()}
            previousMonth={previousMonth}
            nextMonth={nextMonth}
            monthName={monthName}
            emptyDays={emptyDays}
            days={days}
            bookedDates={bookedDates}
            isCurrentMonth={isCurrentMonth}
            todayDate={todayDate}
            touchStartX={touchStartX}
            selectedDate={selectedDate}
            onDateClick={(day) => {
              const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
              setSelectedDate(newDate);
            }}
            legends={calendarLegends}
          />

          {/* Right Side: Appointments List and Activity */}
          <div className="lg:col-span-3 space-y-6">
            {/* Appointments List */}
            <AppointmentsList 
              title="Upcoming Appointments"
              appointments={appointments} 
              students={students} 
              status="Approved"
              selectedDate={selectedDate}
              excludeStatus={['Pending']} 
              actions={appointmentActions}
            />

            {/* Quick Actions */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action) => {
                  const IconComponent = action.icon;
                  return (
                    <Link
                      key={action.title}
                      to={action.href}
                      className="bg-card rounded-lg shadow p-4 hover:shadow-lg transition-all hover:border-primary border border-border group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                          <IconComponent
                            size={20}
                            className="text-primary group-hover:text-white"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm text-foreground">
                            {action.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}


