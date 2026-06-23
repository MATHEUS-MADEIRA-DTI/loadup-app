export interface User {
  id: string;
  name: string;
  email: string;
  timezone?: string;
  createdAt: string;
}

export interface AuthResponse {
  id: string;
  name: string;
  email: string;
  token: string;
  expiresIn: number;
  createdAt: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}
