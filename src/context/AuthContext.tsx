import React, { createContext, useContext } from "react";
import { useMe } from "@/features/users/hooks/useMe";
import { useLogout as useLogoutMutation } from "@/features/auth/hooks";
import { authService } from "@/features/auth/services";
import { User } from "@/features/users/types/user";

interface AuthContextType {
  isAuthenticated: boolean;
  logout: () => void;
  isLoading: boolean;
  user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Modern AuthContext using TanStack Query
 * This is a thin wrapper around useMe hook to maintain backwards compatibility
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Use TanStack Query hooks for data fetching
  const { data: user, isLoading, isError } = useMe();
  const { logout: logoutMutation } = useLogoutMutation();

  const logout = () => {
    logoutMutation();
  };

  const hasToken = authService.isAuthenticated();
  const isAuthenticated = hasToken && !!user;
  const isAuthLoading = isLoading || (hasToken && !user && !isError);

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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
