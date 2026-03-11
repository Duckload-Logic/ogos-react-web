import { apiClient } from "@/lib/api";
import { User } from "@/features/users/types/user";

const USER_GET_ROUTES = {
  me: "/users/me",
  user: (userID: number) => `/users/${userID}`,
};

export const userService = {
  async getCurrentUser(): Promise<User> {
    const { data } = await apiClient.get(USER_GET_ROUTES.me);
    return data;
  },

  async getUserByID(userID: number): Promise<User> {
    const route = USER_GET_ROUTES.user(userID);
    const { data } = await apiClient.get(route);
    return data.user;
  },
};
