import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "@/services/notificationService";

const NOTIF_KEY = ["notifications"] as const;

export function useNotifications() {
  return useQuery({
    queryKey: NOTIF_KEY,
    queryFn: () => notificationService.getAll(),
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: [...NOTIF_KEY, "unread"],
    queryFn: () => notificationService.getUnreadCount(),
    refetchInterval: 30000,
  });
}

export function useMarkAsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: NOTIF_KEY });
    },
  });
}

export function useMarkAllAsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: NOTIF_KEY });
    },
  });
}
