import { tokenStorage } from "./tokenStorage";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = tokenStorage.get();

  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${BASE_URL}${path}`, { ...init, headers });

  if (response.status === 401 && !path.startsWith("/auth")) {
    tokenStorage.clear();
    window.location.href = "/login";
    return Promise.reject(new Error("Sessão expirada"));
  }

  if (response.status === 204) {
    return undefined as unknown as T;
  }

  const body: unknown = await response.json();

  if (!response.ok) {
    const message =
      body !== null &&
      typeof body === "object" &&
      "message" in body &&
      typeof (body as Record<string, unknown>).message === "string"
        ? (body as { message: string }).message
        : "Erro inesperado";
    throw new Error(message);
  }

  return body as T;
}

async function requestFile<T>(path: string, formData: FormData): Promise<T> {
  const token = tokenStorage.get();

  const headers = new Headers();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  // Do NOT set Content-Type — browser sets it with the multipart boundary

  const response = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (response.status === 401 && !path.startsWith("/auth")) {
    tokenStorage.clear();
    window.location.href = "/login";
    return Promise.reject(new Error("Sessão expirada"));
  }

  if (response.status === 204) {
    return undefined as unknown as T;
  }

  const body: unknown = await response.json();

  if (!response.ok) {
    const message =
      body !== null &&
      typeof body === "object" &&
      "message" in body &&
      typeof (body as Record<string, unknown>).message === "string"
        ? (body as { message: string }).message
        : "Erro inesperado";
    throw new Error(message);
  }

  return body as T;
}

export const apiClient = {
  get<T>(path: string): Promise<T> {
    return request<T>(path, { method: "GET" });
  },

  post<T>(path: string, data?: unknown): Promise<T> {
    return request<T>(path, { method: "POST", body: JSON.stringify(data) });
  },

  patch<T>(path: string, data?: unknown): Promise<T> {
    return request<T>(path, { method: "PATCH", body: JSON.stringify(data) });
  },

  delete<T>(path: string): Promise<T> {
    return request<T>(path, { method: "DELETE" });
  },

  postFile<T>(path: string, formData: FormData): Promise<T> {
    return requestFile<T>(path, formData);
  },
};
