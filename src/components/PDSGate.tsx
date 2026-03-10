import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/context";
import { checkStudentOnboardingStatus } from "@/features/iir/services/service";
import { AlertTriangle } from "lucide-react";
import { useMe } from "@/features/users/hooks/useMe";
import { useIIRForm } from "@/features/iir/hooks";
import { useIIRStatus } from "@/features/iir/hooks";
import { AnimationStyles } from "@/components/ui/animations";

interface PDSGateProps {
  children: React.ReactNode;
  allowOnGuidancePage?: boolean;
}

/**
 * PDSGate Component
 * Restricts access to student services until PDS form is completed
 * Only allows access to /student/form (PDS form page)
 * Redirects to /student if PDS is not yet filled
 */
export const PDSGate = ({
  children,
  allowOnGuidancePage = false,
}: PDSGateProps) => {
  const { data: me } = useMe();
  const { data: iirRecord, isLoading } = useIIRStatus(me?.email || "");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If PDS is not completed and this is not the form page
  if (!iirRecord?.isSubmitted && !allowOnGuidancePage) {
    return (
      <div className="relative">
        {/* Blurred background content */}
        <div className="pointer-events-none select-none blur-sm">
          {children}
        </div>

        {/* Modal overlay */}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/60 backdrop-blur-sm animate-fade-in">
          <AnimationStyles />
          <div className="bg-card text-card-foreground rounded-xl shadow-xl max-w-md w-full p-8 border border-border animate-fade-in-scale">
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 dark:bg-yellow-900/40 rounded-full mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h2 className="text-2xl font-bold text-center text-foreground mb-2">
              Access Restricted
            </h2>
            <p className="text-muted-foreground text-center mb-6">
              You must complete your Personal Data Sheet (PDS) form first to
              access this service.
            </p>
            <a
              href="/student/form"
              className="w-full block text-center bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Go to PDS Form
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default PDSGate;
