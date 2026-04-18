import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/context";
import { AlertTriangle } from "lucide-react";
import { useMe } from "@/features/users/hooks/useMe";
import { useIIRForm } from "@/features/iir/hooks";
import { useIIRStatus } from "@/features/iir/hooks";
import { AnimationStyles } from "@/components/ui/animations";
import { Spinner } from "@/components/shared";
import { cn } from "@/lib/utils";

interface IIRGateProps {
  children: React.ReactNode;
  allowOnGuidancePage?: boolean;
}

/**
 * IIRGate Component
 * Restricts access to student services until PDS form is completed
 * Only allows access to /student/form (PDS form page)
 * Redirects to /student if PDS is not yet filled
 */
export const IIRGate = ({
  children,
  allowOnGuidancePage = false,
}: IIRGateProps) => {
  const { data: isSubmitted, isLoading: isIIRLoading } = useIIRStatus();

  if (isIIRLoading) {
    return (
      <Spinner
        size="lg"
        message="Checking your profile..."
      />
    );
  }

  // If PDS is not completed and this is not the form page
  if (!isSubmitted && !allowOnGuidancePage) {
    return (
      <div className="relative">
        {/* Blurred background content */}
        <div className="pointer-events-none select-none blur-sm">
          {children}
        </div>

        {/* Modal overlay */}
        <div
          className={cn(
            "animate-fade-in fixed inset-0 z-50 flex items-center",
            "justify-center bg-background/60 p-4 backdrop-blur-sm",
          )}
        >
          <AnimationStyles />
          <div
            className={cn(
              "animate-fade-in-scale w-full max-w-md rounded-xl border",
              "border-border bg-card p-8 text-card-foreground shadow-xl",
            )}
          >
            <div
              className={cn(
                "mx-auto mb-4 flex h-12 w-12 items-center justify-center",
                "rounded-full bg-yellow-100 dark:bg-yellow-900/40",
              )}
            >
              <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h2 className="mb-2 text-center text-2xl font-bold text-foreground">
              Access Restricted
            </h2>
            <p className="mb-6 text-center text-muted-foreground">
              You must complete your student Individual Inventory Record (IIR)
              form first to access this service.
            </p>
            <a
              href="/student/iir/form"
              className={cn(
                "block w-full rounded-lg bg-primary py-3 text-center",
                "font-semibold text-primary-foreground transition-colors",
                "hover:bg-primary/90",
              )}
            >
              Go to IIR Form
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default IIRGate;
