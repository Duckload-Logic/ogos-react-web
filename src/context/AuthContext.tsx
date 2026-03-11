import React, { createContext, useContext } from "react";
import { useMe } from "@/features/users/hooks/useMe";
import { useLogout as useLogoutMutation } from "@/features/auth/hooks";
import { User } from "@/features/users/types/user";

interface AuthContextType {
  isAuthenticated: boolean;
  logout: () => void;
  isLoading: boolean;
  user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: user, isLoading, isError } = useMe({});
  const { logout: logoutMutation } = useLogoutMutation();

  const logout = () => {
    logoutMutation();
  };

  // Authentication is true if we have a user and no error
  const isAuthenticated = !!user && !isError;
  // Loading if the query is loading and we haven't received a definitive answer
  const isAuthLoading = isLoading || (!user && !isError);

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
