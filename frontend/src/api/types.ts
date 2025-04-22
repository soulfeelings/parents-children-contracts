// Общие типы
export interface User {
  id: string;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  role: "parent" | "child";
  created_at: string;
  updated_at: string;
}

export interface Contract {
  id: string;
  title: string;
  description?: string;
  parent_id: string;
  child_id: string;
  status: "active" | "completed" | "cancelled";
  start_date: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  contract_id: string;
  title: string;
  description?: string;
  status: "pending" | "completed" | "failed";
  points: number;
  due_date: string;
  created_at: string;
  updated_at: string;
}

export interface Reward {
  id: string;
  contract_id: string;
  title: string;
  description?: string;
  points: number;
  status: "available" | "claimed" | "completed";
  created_at: string;
  updated_at: string;
}

// Типы запросов
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  first_name?: string;
  last_name?: string;
  role: "parent" | "child";
}

export interface CreateContractRequest {
  title: string;
  description?: string;
  child_id: string;
  start_date: string;
  end_date?: string;
}

export interface CreateTaskRequest {
  contract_id: string;
  title: string;
  description?: string;
  points: number;
  due_date: string;
}

export interface CreateRewardRequest {
  contract_id: string;
  title: string;
  description?: string;
  points: number;
}

// Типы ответов
export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}
