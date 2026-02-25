import { useQuery } from "@tanstack/react-query";
import { userService } from "../services/service";

export function useUserByID(userID: number) {
  return useQuery({
    queryKey: ["users", userID],
    queryFn: async () => {
      return userService.getUserByID(userID);
    },
    enabled: !!userID,
  });
}
