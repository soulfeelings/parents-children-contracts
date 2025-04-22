import { apiClient } from "./client";
import { Reward, CreateRewardRequest } from "./types";

export const rewardsApi = {
  getAll: async (contractId?: string): Promise<Reward[]> => {
    const url = contractId ? `/rewards?contract_id=${contractId}` : "/rewards";
    const response = await apiClient.get<Reward[]>(url);
    return response.data;
  },

  getById: async (id: string): Promise<Reward> => {
    const response = await apiClient.get<Reward>(`/rewards/${id}`);
    return response.data;
  },

  create: async (data: CreateRewardRequest): Promise<Reward> => {
    const response = await apiClient.post<Reward>("/rewards", data);
    return response.data;
  },

  update: async (
    id: string,
    data: Partial<CreateRewardRequest>
  ): Promise<Reward> => {
    const response = await apiClient.put<Reward>(`/rewards/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/rewards/${id}`);
  },

  claim: async (id: string): Promise<Reward> => {
    const response = await apiClient.post<Reward>(`/rewards/${id}/claim`);
    return response.data;
  },
};
