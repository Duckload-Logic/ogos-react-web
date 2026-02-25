import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService, LoginPayload, LoginResponse } from "../services/index";

export function useLogin() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ email, password }: LoginPayload): Promise<LoginResponse> =>
      authService.login({ email, password }),
    onSuccess: () => {
      // Invalidate user queries to refetch user data after login
      queryClient.invalidateQueries({ queryKey: ["users", "me"] });
    },
  });

  return {
    login: mutation.mutateAsync,
    isLoggingIn: mutation.isPending,
    loginError: mutation.error,
  };
}

export function useLogout() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      await authService.logout();
    },
    onSuccess: () => {
      // Clear all cached queries on logout
      queryClient.clear();
    },
  });

  return {
    logout: mutation.mutate,
    isLoggingOut: mutation.isPending,
  };
}
