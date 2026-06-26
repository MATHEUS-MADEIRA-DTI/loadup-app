import { apiClient } from "@/lib/apiClient";

export interface Notification {
  _id: string;
  type: "friend_request" | "friend_accepted";
  fromUserId: string;
  fromUserName: string;
  friendshipId?: string;
  read: boolean;
  createdAt: string;
}

export const notificationService = {
  getAll(): Promise<Notification[]> {
    return apiClient.get<Notification[]>("/notifications");
  },

  getUnreadCount(): Promise<{ count: number }> {
    return apiClient.get<{ count: number }>("/notifications/unread-count");
  },

  markAsRead(id: string): Promise<Notification> {
    return apiClient.patch<Notification>(`/notifications/${id}/read`, {});
  },

  markAllAsRead() {
    return apiClient.patch("/notifications/read-all", {});
  },
};
