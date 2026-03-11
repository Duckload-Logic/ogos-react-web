import { useQuery } from "@tanstack/react-query";
import { userService } from "../services/service";
import { User } from "../types/user";

const ME_QUERY_KEY = "me";

export function useMe({ enabled = true }: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["users", ME_QUERY_KEY],
    queryFn: async (): Promise<User> => {
      return await userService.getCurrentUser();
    },
    enabled: !!localStorage.getItem("accessToken"),
    retry: false,
    staleTime: 0,
  });
}
