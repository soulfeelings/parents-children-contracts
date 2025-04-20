import api from "./api";
import { API_ENDPOINTS } from "../config/api";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

export const login = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  const response = await api.post(API_ENDPOINTS.auth.login, credentials);
  return response.data;
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await api.post(API_ENDPOINTS.auth.register, data);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

export const getCurrentUser = async (): Promise<AuthResponse["user"]> => {
  const response = await api.get(API_ENDPOINTS.auth.me);
  return response.data;
};
