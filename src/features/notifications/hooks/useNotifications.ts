import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GetMyNotifications, PatchNotificationRead } from "../services";
import { QUERY_KEYS } from "@/config/queryKeys";
import { useAuth } from "@/context";

export function useGetNotifications() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: QUERY_KEYS.notifications.me,
    queryFn: () => GetMyNotifications(),
    enabled: isAuthenticated,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => PatchNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.notifications.me,
      });
    },
    onError: (error) => {
      console.error(
        "[useMarkNotificationRead] {Mutation}: ",
        error instanceof Error ? error.message : "Failed to mark as read",
      );
    },
  });
}
