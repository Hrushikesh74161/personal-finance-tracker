import { useMutation } from "@tanstack/react-query";
import apiClient from "./apiClient.js";

/**
 * Custom hook for handling create transaction mutation using React Query
 * @param {Object} params - The parameters for the create transaction mutation
 * @param {Object} [params.onSuccess] - Optional callback function called on successful mutation
 * @param {Object} [params.onError] - Optional callback function called on mutation error
 * @returns {UseMutationResult} Mutation result object containing mutation state and functions
 */
export function useCreateTransactionMutation(params = {}) {
  return useMutation({
    mutationFn: async (data) => {
      const response = await apiClient({
        method: "post",
        url: "/transactions",
        data: data,
      });
      return response.data.data;
    },
    ...params
  });
}
