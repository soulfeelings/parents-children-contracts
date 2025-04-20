// Базовый URL для API
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080";

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
};

// Эндпоинты API
export const API_ENDPOINTS = {
  // Аутентификация
  auth: {
    login: "/api/auth/login",
    register: "/api/auth/register",
    me: "/api/auth/me",
  },
  // Контракты
  contracts: {
    list: "/api/contracts",
    create: "/api/contracts",
    get: (id: number) => `/api/contracts/${id}`,
    update: (id: number) => `/api/contracts/${id}`,
    delete: (id: number) => `/api/contracts/${id}`,
  },
  // Задачи
  tasks: {
    list: "/api/tasks",
    create: "/api/tasks",
    get: (id: number) => `/api/tasks/${id}`,
    update: (id: number) => `/api/tasks/${id}`,
    delete: (id: number) => `/api/tasks/${id}`,
    complete: (id: number) => `/api/tasks/${id}/complete`,
  },
  // Награды
  rewards: {
    list: "/api/rewards",
    create: "/api/rewards",
    get: (id: number) => `/api/rewards/${id}`,
    update: (id: number) => `/api/rewards/${id}`,
    delete: (id: number) => `/api/rewards/${id}`,
    redeem: (id: number) => `/api/rewards/${id}/redeem`,
  },
  // Настройки
  settings: {
    get: "/api/settings",
    update: "/api/settings",
  },
};
