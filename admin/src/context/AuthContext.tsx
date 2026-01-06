import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  fullName: string;
  email: string;
  password: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => boolean;
  register: (
    fullName: string,
    email: string,
    password: string,
  ) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "authUsers";
const CURRENT_USER_KEY = "authUsername";

// Helper to get all registered users
const getRegisteredUsers = (): User[] => {
  const users = localStorage.getItem(STORAGE_KEY);
  return users ? JSON.parse(users) : [];
};

// Helper to save users
const saveUsers = (users: User[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const storedUsername = localStorage.getItem(CURRENT_USER_KEY);
    if (storedUsername) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
    }

    // Initialize with default student account on first load
    const users = getRegisteredUsers();
    const studentExists = users.some((user) => user.email === "student");
    if (!studentExists) {
      users.push({
        fullName: "Student User",
        email: "student",
        password: "password",
      });
      saveUsers(users);
    }
  }, []);

  const login = (inputUsername: string, inputPassword: string): boolean => {
    const users = getRegisteredUsers();
    const user = users.find(
      (u) => u.email === inputUsername && u.password === inputPassword,
    );

    if (user) {
      setIsAuthenticated(true);
      setUsername(user.email);
      localStorage.setItem(CURRENT_USER_KEY, user.email);
      return true;
    }
    return false;
  };

  const register = (
    fullName: string,
    email: string,
    password: string,
  ): { success: boolean; error?: string } => {
    const users = getRegisteredUsers();

    // Check if email already exists
    if (users.some((user) => user.email === email)) {
      return { success: false, error: "Email already registered" };
    }

    // Add new user
    users.push({ fullName, email, password });
    saveUsers(users);

    // Auto-login after registration
    setIsAuthenticated(true);
    setUsername(email);
    localStorage.setItem(CURRENT_USER_KEY, email);

    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUsername(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, username, login, register, logout }}
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
