import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimationStyles } from "@/components/ui/animations";
import { HeroSection } from "@/components/ui/hero-section";
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
} from "lucide-react";
import { useMe } from "@/features/users/hooks/useMe";
import { useUserIIR } from "@/features/iir/hooks/useUserIIR";
import { useGetSlipStats } from "@/features/slips/hooks";
import { useAppointmentsStats } from "@/features/appointments/hooks/useAppointments";
import type { QuickAction } from "@/components/ui/quick-actions-grid";
import PortalShell from "../../../layout/PortalShell";

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
];

export function Dashboard() {
  const { data: me, isLoading: isUserLoading } = useMe();
  const { data: iir, isLoading: isIIRLoading } = useUserIIR(
    me?.id || undefined,
  );
  const { data: slipStats } = useGetSlipStats({});
  const { data: appointmentStats } = useAppointmentsStats({ params: {} });

  const showForm = !!me && iir && !iir.isSubmitted;

  const totalSlips =
    slipStats?.reduce((sum: number, s: any) => sum + (s.count || 0), 0) || 0;
  const totalAppointments =
    appointmentStats?.reduce(
      (sum: number, s: any) => sum + (s.count || 0),
      0,
    ) || 0;

  const [isPageLoaded, setIsPageLoaded] = useState(false);
  useEffect(() => setIsPageLoaded(true), []);

  if (isUserLoading || isIIRLoading || !isPageLoaded) {
    return (
      <PortalShell role="student">
        <div className="space-y-6">
          <Skeleton className="h-32 w-full rounded-none" />
          <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-20 rounded-lg" />
              <Skeleton className="h-20 rounded-lg" />
            </div>
            <Skeleton className="h-6 w-32" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Skeleton className="h-20 rounded-lg" />
              <Skeleton className="h-20 rounded-lg" />
              <Skeleton className="h-20 rounded-lg" />
              <Skeleton className="h-20 rounded-lg" />
            </div>
            <Skeleton className="h-40 rounded-lg" />
          </div>
        </div>
      </PortalShell>
    );
  }

  if (!me) {
    return (
      <PortalShell role="student">
        <div className="text-center py-12">
          <p className="text-red-600">Unable to load user information</p>
        </div>
      </PortalShell>
    );
  }

  return (
    <PortalShell role="student">
      <AnimationStyles />

      <HeroSection
        greeting="Welcome back,"
        title={`${me?.firstName} ${me?.lastName}`}
        subtitle="PUP Guidance Services — Supporting your academic and personal growth"
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 py-6 sm:py-8 md:py-10">
        {showForm && (
          <Alert
            variant="destructive"
            className="animate-fade-in-up mb-6 border-l-4"
            style={{ animationDelay: "0.1s", animationFillMode: "both" }}
          >
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle className="text-base font-semibold">
              Action Required: Complete Your Personal Data Sheet
            </AlertTitle>
            <AlertDescription className="mt-1 text-sm">
              Complete your form to unlock all guidance services.
            </AlertDescription>
            <Link to="/student/form" className="mt-3 block">
              <Button size="sm" className="gap-2">
                Complete Form Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </Alert>
        )}

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
          isFormIncomplete={showForm}
        />

        {!showForm && (
          <Alert
            className="animate-fade-in-up border-l-4 border-green-500 bg-green-50 dark:bg-green-950/30 dark:border-green-600"
            style={{ animationDelay: "0.35s", animationFillMode: "both" }}
          >
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            <AlertTitle className="text-green-900 dark:text-green-300">
              Confirmation
            </AlertTitle>
            <AlertDescription className="text-green-800 dark:text-green-200 mt-1 text-sm">
              I hereby declare that all the information I have provided is true
              and correct to the best of my knowledge.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </PortalShell>
  );
}