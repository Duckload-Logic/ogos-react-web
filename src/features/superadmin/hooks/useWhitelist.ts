import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface WhitelistEntry {
  email: string;
  roleId: number;
  roleName: string;
  createdAt: string;
}

interface AddWhitelistPayload {
  email: string;
  roleId: number;
}

export const useWhitelist = () => {
  return useQuery({
    queryKey: ["whitelist"],
    queryFn: async (): Promise<WhitelistEntry[]> => {
      const response = await api.get("/api/whitelists"); 
      return response.data;
    },
  });
};

// 2. Add to Whitelist
export const useAddWhitelist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AddWhitelistPayload) => {
      const response = await api.post("/api/whitelists", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whitelist"] });
    },
  });
};

export const useRemoveWhitelist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (email: string) => {
      const response = await api.delete(`/api/whitelists/${encodeURIComponent(email)}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whitelist"] });
    },
  });
};