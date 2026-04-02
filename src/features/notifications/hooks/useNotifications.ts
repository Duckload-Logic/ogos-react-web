import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GetMyNotifications, PatchNotificationRead } from "../services";
import { QUERY_KEYS } from "@/config/queryKeys";

export function useGetNotifications() {
  return useQuery({
    queryKey: QUERY_KEYS.notifications.me,
    queryFn: () => GetMyNotifications(),
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
