import { apiClient } from "@/lib/api";

export const authService = {
  login: (data: any) => apiClient.post('/auth/login', data),
  register: (data: any) => apiClient.post('/auth/register', data),
  verify: (registrationId: string, otp: string) =>
    apiClient.post(`/auth/verify?registration_id=${registrationId}`, { otp }),
  resendVerify: (registrationId: string) =>
    apiClient.post(`/auth/verify/resend?registration_id=${registrationId}`),
  getMe: () => apiClient.get('/auth/me'),
  logout: (redirectUri: string) => apiClient.post(`/auth/logout?redirect_uri=${redirectUri}`),
};

export const m2mService = {
  getClients: () => apiClient.get('/m2m-clients'),
  createClient: (data: any) => apiClient.post('/m2m-clients', data),
  deleteClient: (id: string) => apiClient.delete(`/m2m-clients/${id}`),
};

export default apiClient;
