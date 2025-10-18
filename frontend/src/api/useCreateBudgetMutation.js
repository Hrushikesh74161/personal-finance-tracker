import { useMutation } from "@tanstack/react-query";
import apiClient from "./apiClient.js";

/**
 * Custom hook for handling create budget mutation using React Query
 * @param {Object} params - The parameters for the create budget mutation
 * @param {Object} [params.onSuccess] - Optional callback function called on successful mutation
 * @param {Object} [params.onError] - Optional callback function called on mutation error
 * @returns {UseMutationResult} Mutation result object containing mutation state and functions
 */
export function useCreateBudgetMutation(params) {
  return useMutation({
    mutationFn: async (data) => {
      const response = await apiClient({
        method: "post",
        url: "/budgets",
        data: data,
      });
      return response.data.data;
    },
    ...params
  });
}
