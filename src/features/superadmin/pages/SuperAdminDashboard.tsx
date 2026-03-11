import { Key, Shield, Server, ClipboardList, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useLogStats } from "../hooks";

export default function SuperAdminDashboard() {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const { data: stats } = useLogStats(todayStr, todayStr);

  const getStatCount = (category: string) => {
    return stats?.find((s) => s.category === category)?.count ?? 0;
  };

  const totalLogs = stats?.reduce((sum, s) => sum + s.count, 0) ?? 0;

  const quickActions = [
    {
      title: "API Management",
      description: "Manage API keys",
      icon: Key,
      href: "/superadmin/api-management",
      border: "border-info-foreground/50",
    },
    {
      title: "Security Logs",
      description: "Auth & access events",
      icon: Shield,
      href: "/superadmin/security-logs",
      border: "border-danger-foreground/50",
    },
    {
      title: "System Logs",
      description: "System events",
      icon: Server,
      href: "/superadmin/system-logs",
      border: "border-warning-foreground/50",
    },
    {
      title: "Audit Logs",
      description: "Data change trail",
      icon: ClipboardList,
      href: "/superadmin/audit-logs",
      border: "border-success-foreground/50",
    },
  ];

  return (
    <div className="max-w-[1600px] mx-auto space-y-10">
      {/* HEADER */}
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          {today.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </header>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="rounded-lg border border-border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Today's Activity
                </p>
                <p className="text-4xl font-bold tabular-nums">{totalLogs}</p>
                <p className="text-xs text-muted-foreground">
                  total log entries
                </p>
              </div>
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10">
                <Activity className="size-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg border border-border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Security Events
                </p>
                <p className="text-4xl font-bold tabular-nums">
                  {getStatCount("SECURITY")}
                </p>
                <p className="text-xs text-muted-foreground">
                  auth & access logs
                </p>
              </div>
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-red-500/10">
                <Shield className="size-5 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg border border-border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  System Events
                </p>
                <p className="text-4xl font-bold tabular-nums">
                  {getStatCount("SYSTEM")}
                </p>
                <p className="text-xs text-muted-foreground">
                  system level logs
                </p>
              </div>
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-amber-500/10">
                <Server className="size-5 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg border border-border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Audit Events
                </p>
                <p className="text-4xl font-bold tabular-nums">
                  {getStatCount("AUDIT")}
                </p>
                <p className="text-xs text-muted-foreground">
                  data change logs
                </p>
              </div>
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-emerald-500/10">
                <ClipboardList className="size-5 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* MANAGEMENT ACTIONS */}
      <section className="space-y-5">
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
          Management Actions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                to={action.href}
                className={`
                  group bg-card border-2 ${action.border}
                  p-5 rounded-lg transition-all duration-200
                  hover:-translate-y-1 hover:shadow-md hover:bg-primary/5 hover:border-primary
                  flex items-center gap-4
                `}
              >
                <div className="p-2 border rounded-md transition-transform group-hover:rotate-6">
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{action.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {action.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
