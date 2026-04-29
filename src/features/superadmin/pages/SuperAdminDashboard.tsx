import { useMemo } from "react";
import {
  Users,
  Fingerprint,
  Activity,
  ShieldAlert,
  Search,
  Key,
  Database,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { usePageMetadata } from "@/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  useLogStats,
  useAdminAnalytics,
  useM2MClients,
  useUsers,
  useUserDistribution,
  useLogActivity,
} from "../hooks";
import { SearchInput } from "@/components/form";

const formatCompactNumber = (num: number | undefined | null): string => {
  if (!num || num === 0) return "0";
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(num);
};

const DUMMY_CHART_DATA = [];

export default function SuperAdminDashboard() {
  const { data: logStats = [] } = useLogStats();
  const { data: analytics } = useAdminAnalytics();
  const { data: m2mClients = [] } = useM2MClients();
  const { data: usersData } = useUsers({ page_size: 1 });
  const { data: userDist = [] } = useUserDistribution();
  const { data: logActivity = [] } = useLogActivity();

  const totalLogs = useMemo(
    () => logStats.reduce((acc, curr) => acc + curr.count, 0),
    [logStats],
  );

  const activeM2MCount = useMemo(
    () => m2mClients.filter((c) => c.isActive).length,
    [m2mClients],
  );

  // Map real user distribution to pie chart
  const pieData = useMemo(() => {
    if (userDist.length === 0) return [];

    const colors: Record<string, string> = {
      superadmin: "#eab308", 
      admin: "#64748b",     
      student: "hsl(var(--primary))",
      counselor: "#10b981",  
      developer: "#a855f7", 
    };

    return userDist.map((d) => {
      const normalizedRole = d.roleName.toLowerCase().replace(/\s+/g, '');

      return {
        name: d.roleName.charAt(0).toUpperCase() + d.roleName.slice(1) + (d.roleName.endsWith('s') ? '' : 's'),
        value: d.count,
        color: colors[normalizedRole] || "hsl(var(--muted))",
      };
    });
  }, [userDist]);

  usePageMetadata({
    title: "System Overview",
    badgeText: "Real-time Metrics",
    badgeIcon: <Activity className="h-3 w-3" />,
    description:
      "Monitor global system health, API throughput, and infrastructure performance.",
  });

  const stats = [
    {
      label: "Total Users",
      value: usersData?.total || 0,
      icon: Users,
      trend: "+12%",
      isPositive: true,
      color: "primary",
    },
    {
      label: "M2M Clients",
      value: activeM2MCount,
      icon: Fingerprint,
      trend: "+2",
      isPositive: true,
      color: "secondary",
    },
    {
      label: "System Events",
      value: formatCompactNumber(totalLogs),
      icon: Activity,
      trend: "-5%",
      isPositive: false,
      color: "primary",
    },
    {
      label: "Alert Count",
      value: logStats.find((s) => s.category === "SECURITY")?.count || 0,
      icon: ShieldAlert,
      trend: "Stable",
      isPositive: true,
      color: "secondary",
    },
  ];
  
  const paddedLogActivity = useMemo(() => {
    if (!logActivity || logActivity.length === 0) return [];
    if (logActivity.length <= 2) {
      return [
        { time: "Start", requests: 0, errors: 0 },
        ...logActivity,
        { time: "End", requests: 0, errors: 0 }
      ];
    }
    return logActivity;
  }, [logActivity]);

  return (
    <div className="mx-auto w-full max-w-[1700px] space-y-6">

      {/* KPI Section */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colorClass = stat.color === "primary" ? "primary" : "secondary";

          return (
            <Card
              key={stat.label}
              className="group relative overflow-hidden"
            >
              <div className={`absolute right-0 top-0 h-24 w-24 translate-x-10 -translate-y-10 rounded-full bg-${colorClass}/10 blur-3xl`} />
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-${colorClass}/10 text-${colorClass}`}>
                    <Icon size={22} />
                  </div>
                  <Badge className="rounded-lg font-medium bg-glass-bg bg-glass-border">
                    {stat.isPositive ? (
                      <ArrowUpRight className="mr-1 h-3 w-3 text-emerald-500" />
                    ) : (
                      <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
                    )}
                    {stat.trend}
                  </Badge>
                </div>
                <div className="mt-4 space-y-1">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                  <p className="text-3xl font-bold tracking-tight text-foreground">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Analytics Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* System Activity Chart */}
        <Card className="col-span-1 min-h-[420px] lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between text-card-foreground">
            <div>
              <CardTitle className="text-lg font-semibold">System Activity</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Traffic and errors in the last 24 hours</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Requests</Badge>
              <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Errors</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={paddedLogActivity}>
                  <defs>
                    <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorErrors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#888888" }}
                    interval="preserveStartEnd"
                    tickFormatter={(val) => val ? val.split(' ')[1] || val : ''} 
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "16px",
                      boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                      color: "#fff"
                    }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="requests"
                    stroke="#059669"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRequests)"
                  />
                  <Area
                    type="monotone"
                    dataKey="errors"
                    stroke="#dc2626"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorErrors)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* User Distribution */}
        <Card className="min-h-[420px]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">User Distribution</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Breakdown by user roles</p>
          </CardHeader>
          
          <CardContent className="flex flex-col items-center pt-6">
            <div className="relative h-[220px] w-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={75}
                    outerRadius={95}
                    paddingAngle={6}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(12px)",
                      borderRadius: "16px",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#fff"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold tracking-tight text-foreground">
                  {usersData?.total || 0}
                </span>
                <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Total Users
                </span>
              </div>
            </div>

            <div className="mt-8 w-full max-w-[240px] space-y-3">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div 
                      className="h-3 w-3 rounded-full shadow-sm" 
                      style={{ backgroundColor: item.color }} 
                    />
                    <span className="font-medium text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-bold text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 pt-2">
        {[
          { label: "M2M Management", icon: Key, link: "/superadmin/m2m-management", color: "primary" },
          { label: "User Accounts", icon: Users, link: "/superadmin/users", color: "secondary" },
          { label: "Security Logs", icon: ShieldCheck, link: "/superadmin/security-logs", color: "primary" },
          { label: "System Metrics", icon: Activity, link: "/superadmin/analytics", color: "secondary" }
        ].map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            className="h-auto flex-col items-center justify-center py-6 px-4 hover:bg-muted/30 transition-all hover:shadow-2xl"
            asChild
          >
            <a href={item.link}>
              <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-${item.color === 'primary' ? 'primary' : 'secondary'}/10 text-${item.color === 'primary' ? 'primary' : 'secondary'}`}>
                <item.icon size={22} />
              </div>
              <span className="font-bold text-foreground">{item.label}</span>
            </a>
          </Button>
        ))}
      </section>
    </div>
  );
}
