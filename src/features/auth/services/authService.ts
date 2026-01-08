/**
 * Authentication Service
 * Centralized auth-related API calls
 */

import { apiClient } from "@/lib/apiClient";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  userId: string;
  roleId: number;
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

/**
 * Login user
 */
export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  return apiClient.post("/auth/login", payload);
};

/**
 * Register new user
 */
export const register = async (
  payload: RegisterPayload
): Promise<RegisterResponse> => {
  return apiClient.post("/auth/register", payload);
};

/**
 * Get current user profile
 */
export const getCurrentUser = async (): Promise<UserProfile> => {
  return apiClient.get("/users/me");
};

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
  await apiClient.post("/auth/logout");
};

/**
 * Refresh access token
 */
export const refreshToken = async (): Promise<{ token: string }> => {
  const refreshToken = localStorage.getItem("refreshToken");
  return apiClient.post("/auth/refresh", { refreshToken });
};
