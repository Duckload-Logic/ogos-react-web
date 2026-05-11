import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { StudentProfileCard } from "@/features/student-core/components/StudentProfileCard";
import { useEffect, useState } from "react";
import {
  CalendarPlus,
  FileText,
  ClipboardList,
  User,
  ArrowUpRight,
  LayoutDashboard,
  Clock,
  ClipboardCheck,
} from "lucide-react";
import { useMe } from "@/features/users/hooks/useMe";
import { useUserIIR } from "@/features/iir/hooks";
import { useGetSlipStats } from "@/features/slips/hooks";
import { useAppointmentsStats } from "@/features/appointments/hooks/useAppointments";
import { usePageMetadata } from "@/context";
import { AnimationStyles } from "@/components/ui/animations";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { data: me, isLoading: isUserLoading } = useMe({});
  const { data: iir, isLoading: isIIRLoading } = useUserIIR(
    me?.id || undefined,
  );
  const { data: slipStats } = useGetSlipStats({});
  const { data: appointmentStats } = useAppointmentsStats({ params: {} });

  const totalSlips =
    slipStats?.reduce((sum: number, s: any) => sum + (s.count || 0), 0) || 0;
  const totalAppointments =
    appointmentStats?.reduce(
      (sum: number, s: any) => sum + (s.count || 0),
      0,
    ) || 0;

  const [isPageLoaded, setIsPageLoaded] = useState(false);
  useEffect(() => setIsPageLoaded(true), []);

  const isLoading = isUserLoading || isIIRLoading || !isPageLoaded;
  const iirProfileStatus = iir?.isSubmitted ? "Complete" : "Pending";
  const studentQuickActions = [
    {
      title: "Schedule Appointment",
      description: "Choose an available counseling session",
      icon: CalendarPlus,
      href: "/student/appointments/schedule",
      accent:
        "from-blue-500/15 to-sky-500/5 text-blue-600 dark:text-blue-400 border-blue-500/20",
    },
    {
      title: "Submit Admission Slip",
      description: "Upload and track your excuse slip",
      icon: FileText,
      href: "/student/slips/submit",
      accent:
        "from-emerald-500/15 to-green-500/5 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    },
    {
      title: "My IIR Profile",
      description: "View your personal record",
      icon: User,
      href: "/student/iir",
      accent:
        "from-rose-500/15 to-red-500/5 text-rose-600 dark:text-rose-400 border-rose-500/20",
    },
  ];

  const statCards = [
  {
    title: "My Appointments",
    value: totalAppointments,
    subtitle: "scheduled sessions",
    icon: Clock,
    iconWrap:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  {
    title: "Admission Slips",
    value: totalSlips,
    subtitle: "submitted excuses",
    icon: ClipboardCheck,
    iconWrap:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  {
    title: "IIR Profile",
    value: iirProfileStatus,
    subtitle: iir?.isSubmitted
      ? "student record completed"
      : "complete your student record",
    icon: ClipboardList,
    iconWrap: iir?.isSubmitted
      ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
      : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
];

  usePageMetadata({
    title: me ? `Welcome back, ${me.firstName}!` : "Welcome back",
    description:
      "PUP Guidance Services — Supporting your academic and personal growth",
    badgeText: "Student Overview",
    badgeIcon: <LayoutDashboard className="h-4 w-4" />,
    isLoading,
    headerStats: (
      <div className="grid grid-cols-2 gap-3">
        <div
          className={cn(
            "rounded-xl border border-white/30 bg-white/60 px-4 py-3",
            "backdrop-blur-md dark:border-white/10 dark:bg-white/[0.05]",
          )}
        >
          <p
            className={cn(
              "text-center text-[11px] font-medium uppercase",
              "tracking-[0.18em] text-muted-foreground",
            )}
          >
            Appts
          </p>
          <p className="mt-1 text-center text-2xl font-bold tabular-nums text-foreground">
            {totalAppointments}
          </p>
        </div>
        <div
          className={cn(
            "rounded-xl border border-white/30 bg-white/60 px-4 py-3",
            "backdrop-blur-md dark:border-white/10 dark:bg-white/[0.05]",
          )}
        >
          <p
            className={cn(
              "text-center text-[11px] font-medium uppercase",
              "tracking-[0.18em] text-muted-foreground",
            )}
          >
            Slips
          </p>
          <p className="mt-1 text-center text-2xl font-bold tabular-nums text-foreground">
            {totalSlips}
          </p>
        </div>
      </div>
    ),
  });

  if (isLoading) return null;

  return (
    <div className="mx-auto flex w-full max-w-[1700px] flex-col space-y-8">
      <AnimationStyles />

      {/* 1. Stats Grid */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map((item) => (
          <Card
            key={item.title}
            className={cn(
              "group overflow-hidden rounded-[18px] border border-white/20",
              "bg-white/45 shadow-[0_8px_22px_rgba(15,23,42,0.06)]",
              "backdrop-blur-xl transition-all duration-200",
              "hover:-translate-y-0.5 dark:border-white/10",
              "dark:bg-white/[0.04]",
            )}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2.5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {item.title}
                  </p>
                  <div className="space-y-1">
                    <p className="text-4xl font-bold tabular-nums tracking-tight text-foreground">
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
                  <item.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* 2. Quick Actions */}
      <section className="space-y-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Self-Services
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
            Guidance Quick Actions
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {studentQuickActions.map((action) => (
            <Link
              key={action.title}
              to={action.href}
              className="group"
            >
              <div
                className={cn(
                  "relative overflow-hidden rounded-[18px] border",
                  "border-white/20 bg-white/45 p-4",
                  "shadow-[0_8px_22px_rgba(15,23,42,0.06)] backdrop-blur-xl",
                  "transition-all duration-200 hover:-translate-y-0.5",
                  "hover:border-primary/25 hover:bg-white/55",
                  "dark:border-white/10 dark:bg-white/[0.04]",
                )}
              >
                <div
                  className={`pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-br ${action.accent} opacity-90`}
                />
                <div className="relative flex min-h-[120px] flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl border bg-white/70 backdrop-blur-md dark:bg-white/[0.06] ${action.accent.split(" ").pop()}`}
                    >
                      <action.icon className="h-5 w-5" />
                    </div>
                    <ArrowUpRight
                      className={cn(
                        "h-5 w-5 text-muted-foreground transition-all duration-200",
                        "group-hover:text-foreground",
                      )}
                    />
                  </div>
                  <div className="pt-4">
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
          ))}
        </div>
      </section>

      {/* 3. Personal Profile Area */}
      <section className="pt-2">
        <StudentProfileCard
          firstName={me?.firstName}
          lastName={me?.lastName}
          suffixName={me?.suffixName}
          middleName={me?.middleName}
          email={me?.email}
          studentCorUrl={me?.studentCorUrl}
          isFormIncomplete={!iir || !iir.isSubmitted}
        />
      </section>
    </div>
  );
}
