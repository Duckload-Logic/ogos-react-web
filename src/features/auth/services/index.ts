import { apiClient } from "@/lib/api";

export interface LoginPayload {
  email: string;
  password: string;
}

// No need to return tokens – they are set as cookies
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

export const authService = {
  async login({ email, password }: LoginPayload): Promise<LoginResponse> {
    const { data } = await apiClient.post("/auth/login", { email, password });
    // Tokens are set as cookies by the server – nothing to store
    return data;
  },

  async register(payload: RegisterPayload): Promise<RegisterResponse> {
    const { data } = await apiClient.post("/auth/register", payload);
    return data;
  },

  async getCurrentUser(): Promise<UserProfile> {
    const { data } = await apiClient.get("/users/me");
    return data;
  },

  async logout(): Promise<void> {
    await apiClient.post("/auth/logout");
    // No need to clear localStorage – cookies are cleared by server
  },
};
