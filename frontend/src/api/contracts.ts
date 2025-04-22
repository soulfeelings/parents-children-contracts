import { apiClient } from "./client";
import { Contract, CreateContractRequest } from "./types";

export const contractsApi = {
  getAll: async (): Promise<Contract[]> => {
    const response = await apiClient.get<Contract[]>("/contracts");
    return response.data;
  },

  getById: async (id: string): Promise<Contract> => {
    const response = await apiClient.get<Contract>(`/contracts/${id}`);
    return response.data;
  },

  create: async (data: CreateContractRequest): Promise<Contract> => {
    const response = await apiClient.post<Contract>("/contracts", data);
    return response.data;
  },

  update: async (
    id: string,
    data: Partial<CreateContractRequest>
  ): Promise<Contract> => {
    const response = await apiClient.put<Contract>(`/contracts/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/contracts/${id}`);
  },
};
