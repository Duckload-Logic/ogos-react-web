/**
 * Authentication Hook
 * Handles login and logout with bootstrapper integration
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { PostLogin, LoginPayload, LogoutResponse } from "../services/index";
import { BootstrapApp, ResetBootstrap } from "@/services/bootstrapper";
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
 * Logout mutation hook
 * Clears bootstrap state and all cached queries
 *
 * @returns Logout mutation and state
 */
export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: () => import("../services/index").then((m) => m.PostLogout()),
    onSuccess: (data: LogoutResponse) => {
      // Reset bootstrap state
      ResetBootstrap();

      // Clear all cached queries
      queryClient.clear();

      // If an IDP logout URL is provided, redirect the browser to clear the session
      if (data?.logoutUrl) {
        window.location.href = data.logoutUrl;
      } else {
        // Standard logout: navigate to login page
        navigate("/login");
      }
    },
    onError: (error: any) => {
      console.error("[useLogout] {Logout}: " + `${error.message}`);
    },
  });

  return {
    logout: mutation.mutate,
    isLoggingOut: mutation.isPending,
  };
}
