/**
 * Authentication Service
 * Handles login, registration, and logout operations
 */

import { apiClient, AxiosConfigWithMeta } from "@/lib/api";
import { API_ROUTES } from "@/config/apiRoutes";
import type {
  IDPAuthorizeResponse,
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

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roleId: number;
  createdAt: string;
}

/**
 * Fetches the IDP authorization URL for OAuth 2.0 flow
 * @param config - Optional axios config with metadata
 * @returns Promise resolving to authorization URL response
 * @throws Error if request fails
 */
export const GetIDPAuthorize = async (
  config?: AxiosConfigWithMeta,
): Promise<IDPAuthorizeResponse> => {
  try {
    const { data } = await apiClient.get(
      API_ROUTES.auth.idpAuthorizeUrl,
      config,
    );
    return data;
  } catch (error) {
    console.error(
      `[GetIDPAuthorize] {Fetch Auth URL}: ${error}`,
    );
    throw error;
  }
};

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
): Promise<UserProfile> => {
  try {
    const { data } = await apiClient.get(API_ROUTES.users.me, config);
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
): Promise<void> => {
  try {
    await apiClient.post(API_ROUTES.auth.logout, {}, config);
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

  async getCurrentUser(): Promise<UserProfile> {
    return GetCurrentUser();
  },

  async logout(): Promise<void> {
    return PostLogout();
  },
};
