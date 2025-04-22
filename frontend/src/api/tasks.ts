import { apiClient } from "./client";
import { Task, CreateTaskRequest } from "./types";

export const tasksApi = {
  getAll: async (contractId?: string): Promise<Task[]> => {
    const url = contractId ? `/tasks?contract_id=${contractId}` : "/tasks";
    const response = await apiClient.get<Task[]>(url);
    return response.data;
  },

  getById: async (id: string): Promise<Task> => {
    const response = await apiClient.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  create: async (data: CreateTaskRequest): Promise<Task> => {
    const response = await apiClient.post<Task>("/tasks", data);
    return response.data;
  },

  update: async (
    id: string,
    data: Partial<CreateTaskRequest>
  ): Promise<Task> => {
    const response = await apiClient.put<Task>(`/tasks/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/tasks/${id}`);
  },

  complete: async (id: string): Promise<Task> => {
    const response = await apiClient.post<Task>(`/tasks/${id}/complete`);
    return response.data;
  },
};
