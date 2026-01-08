import React, { createContext, useContext, useState, useEffect } from "react";
import { apiClient } from "@/lib/api";
import { User } from "@/types/user";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; roleId?: number; error?: string }>;
  logout: () => void;
  isLoading: boolean;
  user: User | null; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null); // Use the User type
  const [isLoading, setIsLoading] = useState(true);

  // Define fetch function inside or outside useEffect
  const fetchUserData = async () => {
    try {
      const { data } = await apiClient.get('/users/me');
      setUser(data);
      setIsAuthenticated(true);
      return data;
    } catch (error) {
      console.error('Session invalid', error);
      logout(); // Clear storage if token is expired/invalid
      return null
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        await fetchUserData();
      } else {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await apiClient.post('/auth/login', { email, password });

      localStorage.setItem('accessToken', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);

      // After login, fetch the full user profile
      const userData = await fetchUserData();

      return { success: true, roleId: userData?.roleId };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed. Please try again.',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
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