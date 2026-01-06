import React, { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if user was previously logged in
    return localStorage.getItem("isAuthenticated") === "true";
  });

  const [userRole, setUserRole] = useState<string | null>(() => {
    // Get user role from localStorage if previously logged in
    return localStorage.getItem("userRole");
  });

  const login = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    // Hardcoded credentials with roles
    const users: Record<string, { password: string; role: string }> = {
      admin: { password: "password", role: "admin" },
      frontdesk: { password: "password", role: "frontdesk" },
    };

    const user = users[username];
    if (user && user.password === password) {
      setIsAuthenticated(true);
      setUserRole(user.role);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userRole", user.role);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};