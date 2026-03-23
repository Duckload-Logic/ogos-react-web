import { AnimationStyles } from "@/components/ui/animations";
import { StatsCard } from "@/components/ui/stats-card";
import { QuickActionsGrid } from "@/components/ui/quick-actions-grid";
import { StudentProfileCard } from "@/features/students/components/StudentProfileCard";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  CalendarPlus,
  FileText,
  ClipboardList,
  ArrowRight,
  User,
} from "lucide-react";
import { useMe } from "@/features/users/hooks/useMe";
import { useUserIIR } from "@/features/iir/hooks/useUserIIR";
import { useGetSlipStats } from "@/features/slips/hooks";
import { useAppointmentsStats } from "@/features/appointments/hooks/useAppointments";
import type { QuickAction } from "@/components/ui/quick-actions-grid";
import PortalShell from "../../../layout/PortalShell";
import Layout from "@/components/layout/Layout";

const QUICK_ACTIONS: QuickAction[] = [
  {
    title: "Schedule Appointment",
    description: "Book a counseling session",
    icon: CalendarPlus,
    to: "/student/appointments/schedule",
    color: "text-blue-600 bg-blue-50",
  },
  {
    title: "Submit Admission Slip",
    description: "File an excuse slip",
    icon: FileText,
    to: "/student/slips/submit",
    color: "text-green-600 bg-green-50",
  },
  {
    title: "Appointments",
    description: "View your appointments",
    icon: ClipboardList,
    to: "/student/appointments",
    color: "text-purple-600 bg-purple-50",
  },
  {
    title: "Admission Slips",
    description: "Track submitted slips",
    icon: FileText,
    to: "/student/slips",
    color: "text-orange-600 bg-orange-50",
  },
  {
    title: "My IIR Profile",
    description: "View your personal record",
    icon: User,
    to: "/student/iir",
    color: "text-rose-600 bg-rose-50",
  },
];

export function Dashboard() {
  const { data: me, isLoading: isUserLoading } = useMe({});
  const { data: iir, isLoading: isIIRLoading } = useUserIIR(
    me?.id || undefined,
  );
  const { data: slipStats } = useGetSlipStats({});
  const { data: appointmentStats } = useAppointmentsStats({ params: {} });

  // const showForm = !isIIRLoading && iir && !iir.isSubmitted;

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

  if (!isLoading && !me) {
    return (
      <Layout title="Services" isLoading={false}>
        <PortalShell role="student">
          <div className="text-center py-12">
            <p className="text-red-600">Unable to load user information</p>
          </div>
        </PortalShell>
      </Layout>
    );
  }

  return (
    <Layout
      title={`Welcome back, ${me?.firstName} ${me?.lastName}`}
      description="PUP Guidance Services — Supporting your academic and personal growth"
      badgeText="Student Dashboard"
      badgeIcon={<User className="h-4 w-4" />}
      isLoading={isLoading}
    >
      <PortalShell role="student">
        <AnimationStyles />

        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 py-6 sm:py-8 md:py-10">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <StatsCard
              to="/student/appointments"
              count={totalAppointments}
              label="Appointments"
              icon={ClipboardList}
              iconColor="text-blue-600"
              bgColor="bg-blue-50"
              borderColor="border-blue-400"
              animationDelay="0.1s"
            />
            <StatsCard
              to="/student/slips"
              count={totalSlips}
              label="Admission Slips"
              icon={FileText}
              iconColor="text-green-600"
              bgColor="bg-green-50"
              borderColor="border-green-400"
              animationDelay="0.1s"
            />
          </div>

          <QuickActionsGrid actions={QUICK_ACTIONS} />

          <StudentProfileCard
            firstName={me?.firstName}
            lastName={me?.lastName}
            middleName={me?.middleName}
            email={me?.email}
            isFormIncomplete={true}
          />
        </div>
      </PortalShell>
    </Layout>
  );
}
