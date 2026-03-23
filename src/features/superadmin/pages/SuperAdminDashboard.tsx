import {
  Key,
  Shield,
  Server,
  ClipboardList,
  Activity,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";
import { useLogStats } from "../hooks";

export default function SuperAdminDashboard() {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const { data: stats, isLoading } = useLogStats(todayStr, todayStr);

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
      accent:
        "from-sky-500/15 to-blue-500/5 text-sky-600 dark:text-sky-400 border-sky-500/20",
    },
    {
      title: "Security Logs",
      description: "Auth & access events",
      icon: Shield,
      href: "/superadmin/security-logs",
      accent:
        "from-red-500/15 to-rose-500/5 text-red-600 dark:text-red-400 border-red-500/20",
    },
    {
      title: "System Logs",
      description: "System events",
      icon: Server,
      href: "/superadmin/system-logs",
      accent:
        "from-amber-500/15 to-yellow-500/5 text-amber-600 dark:text-amber-400 border-amber-500/20",
    },
    {
      title: "Audit Logs",
      description: "Data change trail",
      icon: ClipboardList,
      href: "/superadmin/audit-logs",
      accent:
        "from-emerald-500/15 to-green-500/5 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    },
  ];

  const statCards = [
    {
      title: "Today's Activity",
      value: totalLogs,
      subtitle: "total log entries",
      icon: Activity,
      iconWrap:
        "bg-white/60 dark:bg-white/5 text-primary border-white/40 dark:border-white/10",
    },
    {
      title: "Security Events",
      value: getStatCount("SECURITY"),
      subtitle: "auth & access logs",
      icon: Shield,
      iconWrap:
        "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    },
    {
      title: "System Events",
      value: getStatCount("SYSTEM"),
      subtitle: "system level logs",
      icon: Server,
      iconWrap:
        "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    },
    {
      title: "Audit Events",
      value: getStatCount("AUDIT"),
      subtitle: "data change logs",
      icon: ClipboardList,
      iconWrap:
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    },
  ];

  return (
    <Layout
      title="Super Admin Dashboard"
      isLoading={isLoading}
      badgeText="Super Admin Overview"
      description="Monitor platform activity, access events, API usage, and audit trails in one place."
      showDate
      headerStats={
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/30 bg-white/60 px-4 py-3 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.05]">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Total Today
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">
              {totalLogs}
            </p>
          </div>

          <div className="rounded-xl border border-white/30 bg-white/60 px-4 py-3 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.05]">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Security
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">
              {getStatCount("SECURITY")}
            </p>
          </div>
        </div>
      }
    >
      <div className="mx-auto flex w-full max-w-[1700px] flex-col space-y-5">

        {/* Stats */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((item) => {
            const Icon = item.icon;

            return (
              <Card
                key={item.title}
                className="group overflow-hidden rounded-[18px] border border-white/20 bg-white/45 shadow-[0_8px_22px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(15,23,42,0.09)] dark:border-white/10 dark:bg-white/[0.04] dark:shadow-[0_8px_22px_rgba(0,0,0,0.22)]"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2.5">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        {item.title}
                      </p>

                      <div className="space-y-1">
                        <p className="text-4xl font-bold tracking-tight tabular-nums text-foreground">
                          {item.value}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border backdrop-blur-md transition-transform duration-200 group-hover:scale-105 ${item.iconWrap}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>

        {/* Quick actions */}
        <section className="space-y-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Management Actions
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
              Open key admin modules
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              const accentBorder = action.accent.split(" ").pop();

              return (
                <Link key={action.title} to={action.href} className="group">
                  <div className="relative overflow-hidden rounded-[18px] border border-white/20 bg-white/45 p-4 shadow-[0_8px_22px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:bg-white/55 hover:shadow-[0_10px_24px_rgba(15,23,42,0.09)] dark:border-white/10 dark:bg-white/[0.04] dark:hover:bg-white/[0.06]">
                    <div
                      className={`pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-br ${action.accent} opacity-90`}
                    />

                    <div className="relative flex min-h-[140px] flex-col justify-between">
                      <div className="flex items-start justify-between gap-4">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl border bg-white/70 backdrop-blur-md dark:bg-white/[0.06] ${accentBorder}`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>

                        <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
                      </div>

                      <div className="space-y-1 pt-6">
                        <h3 className="text-base font-semibold text-foreground">
                          {action.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </Layout>
  );
}
