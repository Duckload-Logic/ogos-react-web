import { Navigate } from "react-router-dom";
import { useAuth } from "@/context";
import { LoadingSpinner } from "@/components/shared";

const ROLE_MAP: { [key: number]: string } = {
  1: "student",
  2: "admin",
  3: "superadmin",
};

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

/**
 * Protected Route Component
 * Ensures user is authenticated before rendering
 * children. Handles loading state during session
 * persistence to prevent premature redirects.
 *
 * @param children - Components to render if authorized
 * @param requiredRole - Optional role requirement
 * @returns Protected content or redirect/loading state
 */
export const ProtectedRoute = ({
  children,
  requiredRole,
}: ProtectedRouteProps) => {
  const { user, isLoading, isAuthenticated } = useAuth();

  /**
   * While loading, show spinner instead of redirecting
   * This prevents redirect loops during page refresh
   * when session is being restored
   */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  /**
   * Only redirect if loading is complete and user
   * is not authenticated
   */
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  /**
   * Check role-based access if required
   */
  if (requiredRole && ROLE_MAP[user.role?.id || 0] !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
