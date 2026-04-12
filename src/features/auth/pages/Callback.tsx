/**
 * AuthCallback Component
 * Handles OAuth 2.0 callback after IDP authentication
 * Extracts authorization code and state from URL, exchanges
 * them for tokens, and redirects user to role-based dashboard
 */

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PostIDPTokenExchange, GetCurrentUser } from "../services";
import {
  IDP_ERROR_MESSAGES,
  ROLE_ROUTES_INTERNAL,
  ERROR_DISMISS_TIMEOUT,
} from "../types/idp";
import { useAuth } from "@/context";

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
  const { refresh } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    /**
     * Processes OAuth callback and routes user
     * Runs once on component mount
     */
    const processCallback = async () => {
      try {
        // Extract parameters from URL
        const type = searchParams.get("type");
        const code = searchParams.get("code");
        const errorParam = searchParams.get("error");
        const isNative = type === "native";

        // Handle IDP error response
        if (errorParam) {
          const errorDesc = searchParams.get("error_description");
          console.error(`[AuthCallback] {IDP Error}: ${errorParam}`);
          setError(errorDesc || IDP_ERROR_MESSAGES.MISSING_CODE);
          setIsLoading(false);
          return;
        }

        // Use Same normalization as rest of app
        let roleKey = "student";

        // Use returned data if available (OAuth)
        if (!isNative) {
          if (!code) {
            console.error("[AuthCallback] {Extract Params}: missing code");
            setError(IDP_ERROR_MESSAGES.MISSING_CODE);
            setIsLoading(false);
            return;
          }

          // Exchange code for tokens (OAuth only)
          const response = await PostIDPTokenExchange({ code });

          // Synchronize AuthContext state before proceeding
          await refresh();

          roleKey = response.role.name.toLowerCase().replace(" ", "");
        } else {
          // Synchronize AuthContext state (Native already refetched in Login.tsx
          // but we call it anyway for robustness)
          await refresh();

          // Fetch user profile to determine role (Native only)
          const user = await GetCurrentUser();
          if (!user.role) {
            throw new Error("User has no roles assigned");
          }
          roleKey = user.role.name.toLowerCase().replace(" ", "");
        }

        const dashboardRoute = (ROLE_ROUTES_INTERNAL as Record<string, string>)[
          roleKey
        ];

        if (!dashboardRoute) {
          console.error(
            `[AuthCallback] {Route User}: ` + `unknown role ${roleKey}`,
          );
          setError(IDP_ERROR_MESSAGES.UNKNOWN_ROLE);
          setIsLoading(false);
          return;
        }

        // Navigate to dashboard with replace
        navigate(dashboardRoute, { replace: true });
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : IDP_ERROR_MESSAGES.TOKEN_EXCHANGE_FAILED;

        console.error(`[AuthCallback] {Process Callback}: ${err}`);

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
      console.error("[AuthCallback] {Error}:", error);
      const timeoutId = setTimeout(() => {
        navigate("/login", { replace: true });
      }, ERROR_DISMISS_TIMEOUT);

      return () => clearTimeout(timeoutId);
    }
  }, [error, navigate]);

  // Loading state
  if (isLoading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[hsl(var(--background))]">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 z-0">
          <div className="absolute -left-[10%] -top-[10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
          <div className="absolute -right-[10%] -bottom-[10%] h-[40%] w-[40%] rounded-full bg-secondary/10 blur-[120px] animate-pulse [animation-delay:2s]" />
          <div className="absolute left-1/2 top-1/2 h-[30%] w-[30%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[100px]" />
        </div>

        <div className="relative z-10 w-full max-w-md px-6">
          <div className="group relative overflow-hidden rounded-[32px] border border-white/20 bg-white/10 p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] backdrop-blur-xl dark:border-white/10 dark:bg-black/20">
            {/* Inner Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

            <div className="flex flex-col items-center">
              {/* Custom High-Fidelity Loader */}
              <div className="relative mb-10 h-24 w-24">
                {/* Outer Ring */}
                <div className="absolute inset-0 rounded-full border-[3px] border-primary/20" />
                <div className="absolute inset-0 rounded-full border-[3px] border-t-primary animate-spin" />

                {/* Middle Ring (Reverse rotation) */}
                <div className="absolute inset-3 rounded-full border-[2px] border-secondary/20" />
                <div className="absolute inset-3 rounded-full border-[2px] border-b-secondary animate-[spin_1.5s_linear_infinite_reverse]" />

                {/* Inner Pulsing Core */}
                <div className="absolute inset-7 flex items-center justify-center rounded-full bg-primary shadow-[0_0_20px_rgba(var(--primary),0.4)]">
                  <div className="h-full w-full rounded-full animate-ping bg-white/20" />
                </div>
              </div>

              <div className="space-y-4 text-center">
                <h2 className="text-2xl font-bold tracking-tight text-foreground/90">
                  Verifying Session
                </h2>
                <div className="flex items-center justify-center space-x-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" />
                </div>
                <p className="max-w-[240px] text-sm leading-relaxed text-muted-foreground/80">
                  Securely authenticating your credentials. Please wait a
                  moment.
                </p>
              </div>
            </div>
          </div>

          {/* Subtle decoration */}
          <p className="mt-8 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground/40">
            PUPT OGOS • Secure Gateway
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-[hsl(var(--background))] p-6">
        <div className="w-full max-w-md overflow-hidden rounded-[32px] border border-destructive/20 bg-destructive/5 p-10 shadow-2xl backdrop-blur-xl">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-alert-circle"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
          </div>

          <h2 className="mb-3 text-2xl font-bold tracking-tight text-foreground">
            Authentication Failed
          </h2>

          <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
            {error ||
              "An unexpected error occurred during authentication. Please try logging in again."}
          </p>

          <button
            onClick={() => navigate("/login", { replace: true })}
            className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-primary px-6 py-4 font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98]"
          >
            <span className="relative z-10">Return to Login</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          </button>

          <div className="mt-6 flex items-center justify-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
            <span className="h-1 w-1 rounded-full bg-muted-foreground/20" />
            <span>Auto-redirecting in {ERROR_DISMISS_TIMEOUT / 1000}s</span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground/20" />
          </div>
        </div>
      </div>
    );
  }

  return null;
}
