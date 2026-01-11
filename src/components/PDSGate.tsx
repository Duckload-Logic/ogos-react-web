import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/context";
import { checkStudentOnboardingStatus } from "@/features/students/services/service";
import { AlertTriangle } from "lucide-react";

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
  const { user } = useAuth();
  const [pdsCompleted, setPdsCompleted] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkPDSStatus = async () => {
      try {
        if (!user?.id) {
          setIsLoading(false);
          return;
        }
        const completed = await checkStudentOnboardingStatus(user.id);
        setPdsCompleted(completed);
      } catch (err) {
        console.error("Error checking PDS status:", err);
        setPdsCompleted(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkPDSStatus();
  }, [user?.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If PDS is not completed and this is not the form page
  if (!pdsCompleted && !allowOnGuidancePage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8">
          <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
            Access Restricted
          </h2>
          <p className="text-gray-600 text-center mb-6">
            You must complete your Personal Data Sheet (PDS) form first to access this service.
          </p>
          <a
            href="/student/form"
            className="w-full block text-center bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Go to PDS Form
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default PDSGate;
