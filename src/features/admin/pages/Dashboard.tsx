import {
  Calendar,
  Users,
  FileText,
  Clock,
  MoreHorizontal,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppointments } from "@/features/appointments/hooks/useAppointments";
import { useAdminDashboard } from "@/features/analytics/hooks";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  format12HourTime,
  toISODateString,
} from "@/features/appointments/utils";
import { usePageMetadata } from "@/components/layout/Layout";
import { DashboardMetrics } from "@/features/admin/components/DashboardMetrics";
import { SlipStatusTracker } from "@/features/admin/components/SlipStatusTracker";
import { useGetSlipStats } from "@/features/slips/hooks/useSlips";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useMemo, useEffect } from "react";
import { Dropdown } from "@/components/form";


export default function Dashboard() {
  const navigate = useNavigate();
  const todayStr = toISODateString(new Date());

  const { data: appointmentData, isLoading: isAppointmentsLoading } = useAppointments({
    params: {
      startDate: todayStr,
      endDate: todayStr,
    },
  });

  const appointments = appointmentData?.appointments || [];
  const [showDailyTip, setShowDailyTip] = useState(false);

  const { data: slipStats, isLoading: isSlipsLoading } = useGetSlipStats();
  const { data: adminAnalytics, isLoading: isAnalyticsLoading } = useAdminDashboard();

  const tipQuotes = useMemo(
    () => [
      "Data-driven guidance is effective; check student records before each session.",
      "A short review before every session helps you guide with more confidence.",
      "Consistent follow-up turns one-time visits into meaningful student support.",
      "Clear records make every counseling session faster, smoother, and more effective.",
      "Small notes today can become valuable guidance insights tomorrow.",
      "Prepared counselors create calmer, more productive student conversations.",
    ],
    [],
  );

  const dailyTip = useMemo(() => {
    const dayIndex = new Date().getDate() % tipQuotes.length;
    return tipQuotes[dayIndex];
  }, [tipQuotes]);

  useEffect(() => {
    const todayKey = new Date().toISOString().slice(0, 10);
    const lastShownDate = localStorage.getItem("dashboard-tip-date");

    if (lastShownDate !== todayKey) {
      setShowDailyTip(true);
      localStorage.setItem("dashboard-tip-date", todayKey);
    }
  }, []);

  const metrics = [
    {
      title: "Students",
      value: adminAnalytics?.totalStudents.toString() || "0",
      trend: "+0",
      icon: Users,
      iconColor: "text-blue-500",
    },
    {
      title: "Reports",
      value: adminAnalytics?.totalReports.toString() || "0",
      trend: "+0",
      icon: FileText,
      iconColor: "text-emerald-500",
    },
    {
      title: "Consultations",
      value: adminAnalytics?.totalAppointments.toString() || "0",
      trend: "+0",
      icon: Calendar,
      iconColor: "text-purple-500",
    },
    {
      title: "Slips",
      value: adminAnalytics?.totalSlips.toString() || "0",
      trend: "+0",
      icon: FileText,
      iconColor: "text-amber-500",
    },
  ];

  const visitorData = adminAnalytics?.monthlyVisitors.map((v: { month: string; count: number }) => ({
    name: v.month,
    visitors: v.count
  })) || [];


  usePageMetadata({
    title: "Guidance Dashboard",
    description: "PUP-T Online Guidance Office Services — Supporting student success",
    badgeText: "Admin Overview",
    badgeIcon: <Sparkles className="h-3.5 w-3.5" />,
    showDate: true,
    isLoading: isAppointmentsLoading,
  });

  if (isAppointmentsLoading || isSlipsLoading || isAnalyticsLoading) {
    return null;
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Daily Tip Alert */}
      {showDailyTip && (
        <div className="relative group overflow-hidden p-6 rounded-3xl bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border border-teal-500/20 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-start gap-5">
            <div className="p-3 rounded-2xl bg-teal-500 text-white shadow-lg shadow-teal-500/20">
              <Sparkles size={24} />
            </div>
            <div className="flex-1 pr-10">
              <h4 className="text-sm font-bold text-teal-900 dark:text-teal-100 mb-1 flex items-center gap-2">
                Daily Counseling Insight
              </h4>
              <p className="text-sm text-teal-800/80 dark:text-teal-200/80 font-medium leading-relaxed">
                "{dailyTip}"
              </p>
            </div>
            <button
              onClick={() => setShowDailyTip(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-teal-900/40 dark:text-teal-100/40 hover:bg-teal-500/10 hover:text-teal-900 dark:hover:text-teal-100 transition-all opacity-0 group-hover:opacity-100"
            >
              <MoreHorizontal size={20} />
            </button>
          </div>
          {/* Subtle background decoration */}
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-teal-500/5 rounded-full blur-2xl" />
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <DashboardMetrics metrics={metrics} />
        {/* Monthly Visitors Analytics */}
        <Card className="shadow-lg backdrop-blur-md overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-bold">Monthly Visitors</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 pb-4">
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={visitorData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#94A3B8' }}
                    dy={10}
                  />
                  <YAxis hide={true} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      fontSize: '12px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="visitors"
                    stroke="#00A18E"
                    strokeWidth={3}
                    dot={{ fill: '#00A18E', strokeWidth: 2, r: 4, stroke: '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
        {/* Main Content: Upcoming Appointments */}
        <div className="flex-1 space-y-8">
          <Card className="shadow-lg backdrop-blur-md overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold">Upcoming Appointments</CardTitle>
              <button className="text-slate-400 hover:text-slate-600">
                <MoreHorizontal size={20} />
              </button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 dark:bg-black/20 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                    <tr>
                      <th className="py-4 px-6">Name</th>
                      <th className="py-4 px-6">Category</th>
                      <th className="py-4 px-6">Date</th>
                      <th className="py-4 px-6">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {appointments.slice(0, 5).map((apt) => (
                      <tr
                        key={apt.id}
                        className="group bg-glass-bg transition-colors cursor-pointer"
                        onClick={() => navigate(`/admin/appointments/${apt.id}`)}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <Avatar className="size-8 rounded-lg">
                              <AvatarImage src={apt.user?.profilePicture} />
                              <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold rounded-lg uppercase">
                                {apt.user?.firstName?.[0]}{apt.user?.lastName?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                {apt.user?.firstName} {apt.user?.lastName}
                              </p>
                              <p className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                                {apt.user?.studentNumber}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-slate-500 font-medium">
                          {apt.appointmentCategory.name}
                        </td>
                        <td className="py-4 px-6 text-sm text-slate-500 font-medium whitespace-nowrap">
                          {new Date(apt.whenDate).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6 text-sm text-slate-700 dark:text-slate-300 font-bold">
                          {format12HourTime(apt.timeSlot.time)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {appointments.length === 0 && (
                  <div className="py-10 text-center text-slate-400 text-sm italic">
                    No upcoming appointments for today
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: Slips & Analytics */}
        <div className="w-full xl:w-96 space-y-8">
          {/* Slip Status Tracker */}
          <SlipStatusTracker
            stats={{
              pending: slipStats?.pending || 12,
              approvedToday: slipStats?.approvedToday || 5,
              rejectedToday: slipStats?.rejectedToday || 1,
              urgentRequests: 3
            }}
          />
        </div>
      </div>
    </div>
  );
}
