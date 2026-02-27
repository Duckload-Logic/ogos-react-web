import { apiClient } from "@/lib/api";
import { User } from "@/types";

const USER_GET_ROUTES = {
  me: "/users/me",
  user: (userID: number) => `/users/${userID}`,
};

const ROLE_NAMES: Record<number, string> = {
  1: "student",
  2: "admin",
};

export const userService = {
  async getCurrentUser(): Promise<User> {
    const { data } = await apiClient.get(USER_GET_ROUTES.me);
    // Transform backend response: { roleId } → { role: { id, name } }
    return {
      ...data,
      role: {
        id: data.roleId,
        name: ROLE_NAMES[data.roleId] || "unknown",
      },
    };
  },

  async getUserByID(userID: number) {
    const route = USER_GET_ROUTES.user(userID);
    const { data } = await apiClient.get(route);
    return data.user;
  },
};
