/**
 * Authentication Service
 * Handles login, registration, and logout operations
 */

import { UserRole, User } from "@/features/users/types/user";
import { apiClient, AxiosConfigWithMeta } from "@/lib/api";
import { API_ROUTES } from "@/config/apiRoutes";
import type {
  IDPTokenExchangeRequest,
  IDPTokenExchangeResponse,
} from "../types/idp";

export interface LoginPayload {
  email: string;
  password: string;
}

/**
 * Response from login endpoint
 * Tokens are set as cookies by the server
 */
export interface LoginResponse {
  message: string;
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

/**
 * Response from logout endpoint
 * May contain a logoutUrl for IDP session termination
 */
export interface LogoutResponse {
  message: string;
  logoutUrl?: string;
}

/**
 * Exchanges authorization code for access tokens
 * @param payload - Authorization code and state from IDP
 * @param config - Optional axios config with metadata
 * @returns Promise resolving to token exchange response
 * @throws Error if exchange fails
 */
export const PostIDPTokenExchange = async (
  payload: IDPTokenExchangeRequest,
  config?: AxiosConfigWithMeta,
): Promise<IDPTokenExchangeResponse> => {
  try {
    const { data } = await apiClient.post(
      API_ROUTES.auth.idpToken,
      payload,
      config,
    );
    return data;
  } catch (error) {
    console.error(
      `[PostIDPTokenExchange] {Token Exchange}: ${error}`,
    );
    throw error;
  }
};

/**
 * Post login request
 * @param payload - Email and password credentials
 * @param config - Optional axios config with metadata
 * @returns Promise resolving to login response
 */
export const PostLogin = async (
  payload: LoginPayload,
  config?: AxiosConfigWithMeta,
): Promise<LoginResponse> => {
  try {
    const { data } = await apiClient.post(
      API_ROUTES.auth.login,
      payload,
      config,
    );
    return data;
  } catch (error) {
    const handlerName = config?.handlerName || "PostLogin";
    const stepName = config?.stepName || "Login";
    console.error(`[${handlerName}] {${stepName}}: ${error}`);
    throw error;
  }
};

/**
 * Post registration request
 * @param payload - Registration data
 * @param config - Optional axios config with metadata
 * @returns Promise resolving to registration response
 */
export const PostRegister = async (
  payload: RegisterPayload,
  config?: AxiosConfigWithMeta,
): Promise<RegisterResponse> => {
  try {
    const { data } = await apiClient.post(
      API_ROUTES.auth.register,
      payload,
      config,
    );
    return data;
  } catch (error) {
    const handlerName = config?.handlerName || "PostRegister";
    const stepName = config?.stepName || "Register";
    console.error(`[${handlerName}] {${stepName}}: ${error}`);
    throw error;
  }
};

/**
 * Get current user profile
 * @param config - Optional axios config with metadata
 * @returns Promise resolving to user profile
 */
export const GetCurrentUser = async (
  config?: AxiosConfigWithMeta,
): Promise<User> => {
  try {
    const { data } = await apiClient.get(API_ROUTES.auth.me, config);
    return data;
  } catch (error) {
    const handlerName = config?.handlerName || "GetCurrentUser";
    const stepName = config?.stepName || "Fetch User";
    console.error(`[${handlerName}] {${stepName}}: ${error}`);
    throw error;
  }
};

/**
 * Post logout request
 * @param config - Optional axios config with metadata
 * @returns Promise resolving when logout completes
 */
export const PostLogout = async (
  config?: AxiosConfigWithMeta,
): Promise<LogoutResponse> => {
  try {
    const { data } = await apiClient.post(API_ROUTES.auth.logout, {}, config);
    return data;
  } catch (error) {
    const handlerName = config?.handlerName || "PostLogout";
    const stepName = config?.stepName || "Logout";
    console.error(`[${handlerName}] {${stepName}}: ${error}`);
    throw error;
  }
};

/**
 * Legacy service object for backward compatibility
 * @deprecated Use individual exported functions instead
 */
export const authService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    return PostLogin(payload);
  },

  async register(payload: RegisterPayload): Promise<RegisterResponse> {
    return PostRegister(payload);
  },

  async getCurrentUser(): Promise<User> {
    return GetCurrentUser();
  },

  async logout(): Promise<LogoutResponse> {
    return PostLogout();
  },
};
