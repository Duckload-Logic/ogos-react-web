import { useQuery } from "@tanstack/react-query";
import { userService } from "../services/service";
import { QUERY_KEYS } from "@/config/queryKeys";

export function useUserByID(userID: number) {
  return useQuery({
    queryKey: QUERY_KEYS.users.byId(
      userID.toString(),
    ),
    queryFn: async () => {
      return userService.GetUserById(userID);
    },
    enabled: !!userID,
  });
}
