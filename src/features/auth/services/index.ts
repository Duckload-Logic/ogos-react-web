/**
 * Authentication Service
 * Centralized auth-related API calls
 */

import { apiClient } from "@/lib/api";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthDate?: string;
  placeOfBirth?: string;
  mobileNumber?: string;
}

export interface RegisterResponse {
  userId: string;
  email: string;
  message: string;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roleId: number;
  createdAt: string;
}

// Token management utilities
export const tokenManager = {
  setTokens(token: string, refreshToken: string) {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("refreshToken", refreshToken);
  },

  clearTokens() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },

  getAccessToken(): string | null {
    return localStorage.getItem("accessToken");
  },

  getRefreshToken(): string | null {
    return localStorage.getItem("refreshToken");
  },
};

export const authService = {
  /**
   * Login user and automatically save tokens
   */
  async login({ email, password }: LoginPayload): Promise<LoginResponse> {
    const { data } = await apiClient.post("/auth/login", { email, password });

    // Automatically save tokens to localStorage
    if (data.token && data.refreshToken) {
      tokenManager.setTokens(data.token, data.refreshToken);
    }

    return data;
  },

  /**
   * Register new user
   */
  async register(payload: RegisterPayload): Promise<RegisterResponse> {
    const { data } = await apiClient.post("/auth/register", payload);
    return data;
  },

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<UserProfile> {
    const { data } = await apiClient.get("/users/me");
    return data;
  },

  /**
   * Logout user and clear tokens
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("sidebarHovered");
    } finally {
      // Always clear tokens even if API call fails
      tokenManager.clearTokens();
    }
  },

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<{ token: string }> {
    const refreshToken = tokenManager.getRefreshToken();
    const { data } = await apiClient.post("/auth/refresh", { refreshToken });

    // Update the access token
    if (data.token) {
      localStorage.setItem("accessToken", data.token);
    }

    return data;
  },

  /**
   * Check if user has valid token
   */
  isAuthenticated(): boolean {
    return !!tokenManager.getAccessToken();
  },
};
