import { apiClient } from "./client";
import { AuthResponse, LoginRequest, RegisterRequest } from "./types";

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    debugger;
    const response = await apiClient.post<AuthResponse>("/auth/login", data);
    debugger;
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/register", data);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  },
};
