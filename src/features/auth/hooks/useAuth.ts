/**
 * Authentication Hook
 * Handles login and logout with bootstrapper integration
 */

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { PostLogin, LoginPayload } from "../services/index";
import {
  BootstrapApp,
  ResetBootstrap,
} from "@/services/bootstrapper";
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
    mutationFn: (payload: LoginPayload) =>
      PostLogin(payload),
    onSuccess: async () => {
      try {
        // Trigger bootstrap to fetch critical data
        await BootstrapApp();

        // Invalidate user query to refetch
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.users.me,
        });
      } catch (error: any) {
        console.error(
          '[useLogin] {Bootstrap}: ' +
          `${error.message}`,
        );
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

  const mutation = useMutation({
    mutationFn: () =>
      import('../services/index').then(
        (m) => m.PostLogout(),
      ),
    onSuccess: () => {
      // Reset bootstrap state
      ResetBootstrap();

      // Clear all cached queries
      queryClient.clear();

      console.log(
        '[useLogout] {Cleanup}: Logout complete',
      );
    },
    onError: (error: any) => {
      console.error(
        '[useLogout] {Logout}: ' +
        `${error.message}`,
      );
    },
  });

  return {
    logout: mutation.mutate,
    isLoggingOut: mutation.isPending,
  };
}
