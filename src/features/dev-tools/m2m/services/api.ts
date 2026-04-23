import { apiClient } from "@/lib/api";

export const m2mService = {
  getClients: () => apiClient.get('/m2m-clients'),
  createClient: (data: { clientName: string; clientDescription: string }) => 
    apiClient.post('/m2m-clients', data),
  deleteClient: (id: string) => apiClient.delete(`/m2m-clients/${id}`),
  generateSecret: (id: string) => apiClient.post(`/m2m-clients/${id}/secret`),
};

export default m2mService;
