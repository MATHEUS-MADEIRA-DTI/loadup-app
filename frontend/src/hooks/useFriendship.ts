import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { friendshipService } from "@/services/friendshipService";
import { userService } from "@/services/userService";

const FRIENDS_KEY = ["friends"] as const;

export function useFriends() {
  return useQuery({
    queryKey: FRIENDS_KEY,
    queryFn: () => friendshipService.getFriends(),
  });
}

export function useSearchUsers(name: string) {
  return useQuery({
    queryKey: ["users", "search", name],
    queryFn: () => userService.search(name),
    enabled: name.trim().length >= 2,
    staleTime: 10000,
  });
}

export function useFriendStatus(otherUserId: string) {
  return useQuery({
    queryKey: ["friendship-status", otherUserId],
    queryFn: () => friendshipService.getStatus(otherUserId),
    enabled: !!otherUserId,
  });
}

export function useSendFriendRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (receiverId: string) =>
      friendshipService.sendRequest(receiverId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: FRIENDS_KEY });
      qc.invalidateQueries({ queryKey: ["users", "search"] });
    },
  });
}

export function useAcceptFriendRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (friendshipId: string) =>
      friendshipService.accept(friendshipId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: FRIENDS_KEY });
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["friendship-status"] });
    },
  });
}

export function useRejectFriendRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (friendshipId: string) =>
      friendshipService.reject(friendshipId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
