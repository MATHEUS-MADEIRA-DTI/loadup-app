"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { queryClient as globalQueryClient } from "@/lib/queryClient";
import { tokenStorage } from "@/lib/tokenStorage";
import { authService } from "@/services/authService";
import { LoginPayload, RegisterPayload } from "@/types";

export function useLogin() {
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (data) => {
      authService.storeToken(data);
      authService.storeName(data);
      qc.invalidateQueries();
      router.push("/home");
    },
  });
}

export function useRegister(options?: { onSuccess?: () => void }) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: () => {
      qc.invalidateQueries();
      options?.onSuccess?.();
    },
  });
}

export function useLogout() {
  const router = useRouter();

  return function logout() {
    tokenStorage.clear();
    globalQueryClient.clear();
    router.push("/login");
  };
}
