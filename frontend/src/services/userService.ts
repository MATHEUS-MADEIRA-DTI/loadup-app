import { apiClient } from "@/lib/apiClient";

export interface UserSearchResult {
  _id: string;
  name: string;
  isPublic: boolean;
}

export interface UserProfile {
  _id: string;
  name: string;
  isPublic: boolean;
  createdAt: string;
}

export const userService = {
  search(name: string): Promise<UserSearchResult[]> {
    return apiClient.get<UserSearchResult[]>(
      `/users/search?name=${encodeURIComponent(name)}`,
    );
  },

  updateProfile(data: {
    name?: string;
    isPublic?: boolean;
  }): Promise<UserProfile> {
    return apiClient.patch<UserProfile>("/users/me", data);
  },

  getProfile(userId: string): Promise<UserProfile> {
    return apiClient.get<UserProfile>(`/users/${userId}/profile`);
  },
};
