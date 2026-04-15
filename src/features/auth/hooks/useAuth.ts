/**
 * Authentication Hook
 * Handles login and logout with bootstrapper integration
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { PostLogin, LoginPayload, GetLogoutURL } from "../services/index";
import { ResetBootstrap } from "@/services/bootstrapper";
import { QUERY_KEYS } from "@/config/queryKeys";

/**
 * Login mutation hook
 * Triggers bootstrap on successful login
 *
 * @returns Login mutation and state
 */
export function useLogin() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: LoginPayload) => PostLogin(payload),
    onSuccess: async () => {
      try {
        // Invalidate user query to refetch
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.users.me,
        });
      } catch (error: any) {
        console.error("[useLogin] {Bootstrap}: " + `${error.message}`);
        throw error;
      }
    },
  });

  return {
    login: mutation.mutateAsync,
    isLoggingIn: mutation.isPending,
    loginError: mutation.error,
  };
}

/**
 * Logout hook
 * Synchronizes with backend front-channel redirect by initiating
 * direct browser navigation to the logout endpoint.
 *
 * @returns Logout function and state
 */
export function useLogout() {
  const logout = () => {
    // Clear bootstrap state before navigating
    ResetBootstrap();

    // Trigger full page navigation to handle API redirect to IDP
    window.location.href = GetLogoutURL();
  };

  return {
    logout,
    isLoggingOut: false,
  };
}
