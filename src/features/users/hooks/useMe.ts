import { useQuery } from "@tanstack/react-query";
import { userService } from "../services/service";

const ME_QUERY_KEY = "me";

export function useMe() {
  return useQuery({
    queryKey: ["users", ME_QUERY_KEY],
    queryFn: async () => {
      return userService.getCurrentUser();
    },
    enabled: !!localStorage.getItem("accessToken"),
    retry: false,
    staleTime: 0,
  });
}
