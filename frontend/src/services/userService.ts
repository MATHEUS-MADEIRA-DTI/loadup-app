import { apiClient } from "@/lib/apiClient";
import { User } from "@/types";

export const userService = {
  getMe(): Promise<User> {
    return apiClient.get<User>("/users/me");
  },
};
