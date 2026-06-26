import { apiClient } from "@/lib/apiClient";
import { tokenStorage } from "@/lib/tokenStorage";
import { AuthResponse, LoginPayload, RegisterPayload } from "@/types";

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>("/auth/register", payload);
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>("/auth/login", payload);
  },

  storeToken(response: AuthResponse): void {
    tokenStorage.set(response.token);
  },

  storeName(response: AuthResponse): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("loadup_user_name", response.name ?? "");
    }
  },

  getName(): string {
    if (typeof window === "undefined") return "";
    const stored = localStorage.getItem("loadup_user_name");
    if (stored) return stored;
    const token = localStorage.getItem("loadup_token");
    if (!token) return "";
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const name: string = payload.name || "";
      if (name) localStorage.setItem("loadup_user_name", name);
      return name;
    } catch {
      return "";
    }
  },
  getEmail(): string {
    if (typeof window === "undefined") return "";
    const token = localStorage.getItem("loadup_token");
    if (!token) return "";
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.email || "";
    } catch {
      return "";
    }
  },

  storeEmail(response: AuthResponse): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("loadup_user_email", response.email ?? "");
    }
  },
};
