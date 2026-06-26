import { apiClient } from "@/lib/apiClient";

export type FriendshipStatus = "none" | "pending" | "accepted" | "rejected";

export interface FriendshipStatusResult {
  status: FriendshipStatus;
  friendshipId?: string;
  isSender?: boolean;
}

export interface Friend {
  friendshipId: string;
  friend: {
    _id: string;
    name: string;
    isPublic: boolean;
  };
  since: string;
}

export const friendshipService = {
  sendRequest(receiverId: string) {
    return apiClient.post("/friendships", { receiverId });
  },

  accept(friendshipId: string) {
    return apiClient.patch(`/friendships/${friendshipId}/accept`, {});
  },

  reject(friendshipId: string) {
    return apiClient.patch(`/friendships/${friendshipId}/reject`, {});
  },

  getFriends(): Promise<Friend[]> {
    return apiClient.get<Friend[]>("/friendships");
  },

  getStatus(otherUserId: string): Promise<FriendshipStatusResult> {
    return apiClient.get<FriendshipStatusResult>(
      `/friendships/status/${otherUserId}`,
    );
  },
};
