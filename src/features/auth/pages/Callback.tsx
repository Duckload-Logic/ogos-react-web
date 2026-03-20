/**
 * AuthCallback Component
 * Handles OAuth 2.0 callback after IDP authentication
 * Extracts authorization code and state from URL, exchanges
 * them for tokens, and redirects user to role-based dashboard
 */

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { PostIDPTokenExchange } from "../services";
import { GetCurrentUser } from "../services";
import {
  IDP_ERROR_MESSAGES,
  ROLE_ROUTES,
  ERROR_DISMISS_TIMEOUT,
} from "../types/idp";

/**
 * OAuth callback page component
 * Lifecycle:
 * 1. Mount: Extract code and state from URL params
 * 2. Validate: Check both params exist
 * 3. Exchange: Call backend to exchange code for tokens
 * 4. Fetch: Get current user profile to determine role
 * 5. Route: Redirect to role-based dashboard with replace
 *
 * @returns JSX element showing loading or error state
 */
export default function Callback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    /**
     * Processes OAuth callback and routes user
     * Runs once on component mount
     */
    const processCallback = async () => {
      try {
        // Step 1: Extract parameters from URL
        const code = searchParams.get("code");
        const errorParam = searchParams.get("error");

        // Step 2: Handle IDP error response
        if (errorParam) {
          const errorDesc = searchParams.get("error_description");
          console.error(
            `[AuthCallback] {IDP Error}: ${errorParam}`,
          );
          setError(errorDesc || IDP_ERROR_MESSAGES.MISSING_CODE);
          setIsLoading(false);
          return;
        }

        // Step 3: Validate required parameters
        if (!code) {
          console.error(
            "[AuthCallback] {Extract Params}: missing code",
          );
          setError(IDP_ERROR_MESSAGES.MISSING_CODE);
          setIsLoading(false);
          return;
        }

        // Step 4: Exchange code for tokens
        await PostIDPTokenExchange({ code });

        // Step 5: Fetch user profile to determine role
        const user = await GetCurrentUser();

        // Step 6: Determine dashboard route based on role
        const roleId = user.roleId as keyof typeof ROLE_ROUTES;
        const dashboardRoute = ROLE_ROUTES[roleId];

        if (!dashboardRoute) {
          console.error(
            `[AuthCallback] {Route User}: ` +
              `unknown role ${roleId}`,
          );
          setError(IDP_ERROR_MESSAGES.UNKNOWN_ROLE);
          setIsLoading(false);
          return;
        }

        // Step 7: Navigate to dashboard with replace
        navigate(dashboardRoute, { replace: true });
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : IDP_ERROR_MESSAGES.TOKEN_EXCHANGE_FAILED;

        console.error(
          `[AuthCallback] {Process Callback}: ${err}`,
        );

        setError(errorMessage);
        setIsLoading(false);
      }
    };

    processCallback();
  }, [searchParams, navigate]);

  /**
   * Auto-dismiss error after timeout
   */
  useEffect(() => {
    if (error) {
      const timeoutId = setTimeout(() => {
        navigate("/login", { replace: true });
      }, ERROR_DISMISS_TIMEOUT);

      return () => clearTimeout(timeoutId);
    }
  }, [error, navigate]);

  // Loading state
  if (isLoading) {
    return (
      <div
        className={
          "min-h-screen flex flex-col " +
          "items-center justify-center"
        }
      >
        <Spinner className="size-20 text-primary" />
        <p
          className={
            "mt-4 text-sm text-muted-foreground " +
            "animate-pulse"
          }
        >
          Processing authentication...
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className={
          "min-h-screen flex flex-col " +
          "items-center justify-center p-4"
        }
      >
        <div
          className={
            "max-w-md w-full bg-destructive/10 " +
            "border border-destructive rounded-lg p-6"
          }
        >
          <h2
            className={
              "text-lg font-semibold " +
              "text-destructive mb-2"
            }
          >
            Authentication Failed
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            {error}
          </p>
          <button
            onClick={() => navigate("/login", { replace: true })}
            className={
              "w-full px-4 py-2 bg-primary " +
              "text-primary-foreground rounded-md " +
              "hover:bg-primary/90 transition-colors"
            }
          >
            Return to Login
          </button>
          <p
            className={
              "text-xs text-muted-foreground " +
              "text-center mt-4"
            }
          >
            Redirecting automatically in{" "}
            {ERROR_DISMISS_TIMEOUT / 1000} seconds...
          </p>
        </div>
      </div>
    );
  }

  return null;
}
