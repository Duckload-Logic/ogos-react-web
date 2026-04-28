import { Navigate } from "react-router-dom";
import { useAuth } from "@/context";
import { Spinner } from "@/components/shared";
import { useMe } from "@/features/users/hooks/useMe";

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
        <Spinner />
      </div>
    );
  }

  /**
   * Only redirect if loading is complete and user
   * is not authenticated
   */

  if (!isAuthenticated || !user) {
    console.error("[ProtectedRoute] Unauthorized access attempt");
    return <Navigate to="/login" replace />;
  }

  console.log("Current User Role:", user.role); 

  /**
   * Check role-based access if required
   */
  if (
    requiredRole &&
    user.role.name.toLowerCase() !== requiredRole.toLowerCase()
  ) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
