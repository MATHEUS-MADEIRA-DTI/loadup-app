import { apiClient } from "@/lib/apiClient";

interface PushSubscriptionPayload {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}

export const pushNotificationService = {
  schedulePush(
    subscription: PushSubscriptionPayload,
    delaySeconds: number,
  ): Promise<{ scheduled: boolean }> {
    return apiClient.post<{ scheduled: boolean }>("/notifications/schedule", {
      subscription,
      delaySeconds,
    });
  },

  cancelPush(endpoint: string): Promise<{ cancelled: boolean }> {
    return apiClient.post<{ cancelled: boolean }>("/notifications/cancel", {
      endpoint,
    });
  },
};
