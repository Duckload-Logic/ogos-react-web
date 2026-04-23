import { useMemo, useState } from "react";
import {
  TrendingUp,
  Users,
  Calendar,
  FileText,
  Clock,
  ArrowUpRight,
  BarChart,
  Filter,
  Activity,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { usePageMetadata } from "@/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAdminAnalytics } from "@/features/system-admin/hooks";

export default function AnalyticsOverview() {
  const [range, setRange] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly");
  const { data: analytics, isLoading } = useAdminAnalytics(range);

  usePageMetadata({
    title: "Deep Analytics",
    badgeText: "System Intelligence",
    badgeIcon: <BarChart className="h-3 w-3" />,
    description:
      "Deep dive into system growth, visitor trends, and administrative overhead.",
  });

  const visitorData = useMemo(() => {
    if (!analytics?.monthlyVisitors) return [];
    return analytics.monthlyVisitors.map((v) => ({
      name: v.period,
      logins: v.logins,
      activity: v.activity,
    }));
  }, [analytics]);

  const distributionData = [
    { name: "Reports", value: analytics?.totalReports || 0, color: "hsl(var(--primary))" },
    { name: "Appts", value: analytics?.totalAppointments || 0, color: "hsl(var(--secondary))" },
    { name: "Slips", value: analytics?.totalSlips || 0, color: "hsl(var(--primary) / 0.7)" },
  ];

  if (isLoading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground animate-pulse">Aggregating system intelligence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1700px] space-y-6">
      {/* Tooling Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1 bg-white/[0.03] p-1.5 rounded-2xl backdrop-blur-xl border border-white/10 shadow-2xl">
          {(["daily", "weekly", "monthly", "yearly"] as const).map((r) => (
            <Button
              key={r}
              variant="ghost"
              size="sm"
              onClick={() => setRange(r)}
              className={`rounded-xl px-6 h-9 capitalize transition-all duration-300 font-medium ${
                range === r
                  ? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] hover:bg-primary/90"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              {r}
            </Button>
          ))}
        </div>
      </div>

      {/* Hero Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "Total Students", value: analytics?.totalStudents, icon: Users, color: "primary" },
          { label: "Significant Notes", value: analytics?.totalReports, icon: FileText, color: "secondary" },
          { label: "Appointments", value: analytics?.totalAppointments, icon: Calendar, color: "primary" },
          { label: "Medical Slips", value: analytics?.totalSlips, icon: Clock, color: "secondary" },
          { label: "Live Sessions", value: analytics?.liveSessions, icon: Activity, color: "primary" },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-2xl bg-${item.color}/10 text-${item.color}`}>
                  <item.icon size={20} />
                </div>
                <ArrowUpRight className="text-muted-foreground h-4 w-4" />
              </div>
              <div className="mt-4">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{item.label}</p>
                <p className="text-4xl font-bold mt-1">{item.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Visitors Growth */}
        <Card className="col-span-1 min-h-[450px] lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between pb-8">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <TrendingUp size={24} className="text-primary" />
                System Traffic
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={visitorData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#888888" }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#888888" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(16px)",
                      borderRadius: "20px",
                      border: "1px solid rgba(255,255,255,0.2)",
                      boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend verticalAlign="top" align="right" height={36} iconType="circle" />
                  <Line
                    type="monotone"
                    dataKey="logins"
                    name="System Logins"
                    stroke="hsl(var(--primary))"
                    strokeWidth={4}
                    dot={{ r: 6, fill: "hsl(var(--primary))", strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 8, strokeWidth: 0 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="activity"
                    name="System Activity"
                    stroke="hsl(var(--secondary))"
                    strokeWidth={4}
                    strokeDasharray="8 8"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
