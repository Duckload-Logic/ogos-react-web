import { apiClient } from "@/lib/api";
import { User } from "@/types/user";

export const useUser = () => {
  const fetchUserData = async (userID: number) => {
    const { data } = await apiClient.get(`/users/id/${userID}`);
    return data as User;
  }

  return { fetchUserData };
}