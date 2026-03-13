/**
 * Authentication Context
 * Provides global authentication state and bootstrapper
 * integration with proper session persistence and
 * timeout safeguards to prevent infinite loading
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useMe } from "@/features/users/hooks/useMe";
import { useLogout as useLogoutMutation } from "@/features/auth/hooks";
import { BootstrapApp } from "@/services/bootstrapper";
import { User } from "@/features/users/types/user";

interface AuthContextType {
  isAuthenticated: boolean;
  logout: () => void;
  isLoading: boolean;
  user: User | null;
}

const AuthContext = createContext<
  AuthContextType | undefined
>(undefined);

/**
 * Timeout duration (ms) to prevent infinite loading
 * If useMe doesn't resolve within this time, force
 * loading state to false to allow redirect to login
 */
const AUTH_TIMEOUT_MS = 5000;

/**
 * Authentication Provider
 * Wraps app with auth context and triggers bootstrap
 * on successful authentication. Maintains session
 * across page refreshes by deferring redirect until
 * useMe query completes. Includes timeout safeguard
 * to prevent infinite loading on auth failures.
 *
 * @param children - React components to wrap
 */
export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const {
    data: user,
    status,
    isError,
  } = useMe({});
  const { logout: logoutMutation } = useLogoutMutation();
  const [hasTimedOut, setHasTimedOut] = useState(false);

  /**
   * Timeout safeguard: If auth check takes too long,
   * force loading to false to prevent app lockout
   */
  useEffect(() => {
    if (status === "pending") {
      const timeoutId = setTimeout(() => {
        console.warn(
          "[AuthProvider] {Timeout}: Auth check " +
            "exceeded 5s, forcing loading state to false",
        );
        setHasTimedOut(true);
      }, AUTH_TIMEOUT_MS);

      return () => clearTimeout(timeoutId);
    } else {
      setHasTimedOut(false);
    }
  }, [status]);

  /**
   * Trigger bootstrap when user is authenticated
   * Fetches critical data once on successful auth
   */
  useEffect(() => {
    if (user && status === "success" && !isError) {
      BootstrapApp().catch((error: any) => {
        console.error(
          "[AuthProvider] {Bootstrap}: " +
            `${error.message}`,
        );
      });
    }
  }, [user, status, isError]);

  const logout = () => {
    logoutMutation();
  };

  /**
   * Authentication is true only if query succeeded
   * and we have a user object
   */
  const isAuthenticated = status === "success" && !!user;

  /**
   * Loading is true only while query is pending
   * AND no error has occurred AND timeout hasn't fired
   * This ensures loading state resolves in all cases:
   * - Success: status becomes "success"
   * - Error: status becomes "error"
   * - Timeout: hasTimedOut becomes true
   */
  const isAuthLoading =
    status === "pending" && !isError && !hasTimedOut;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user: user || null,
        logout,
        isLoading: isAuthLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to access authentication context
 * Must be used within AuthProvider
 *
 * @returns Authentication context value
 * @throws Error if used outside AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider",
    );
  }
  return context;
};
