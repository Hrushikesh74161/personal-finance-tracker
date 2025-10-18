import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "./apiClient.js";

/**
 * Custom hook for handling delete transaction mutation using React Query
 * @param {Object} params - The parameters for the delete transaction mutation
 * @param {Object} [params.onSuccess] - Optional callback function called on successful mutation
 * @param {Object} [params.onError] - Optional callback function called on mutation error
 * @returns {UseMutationResult} Mutation result object containing mutation state and functions
 */
export function useDeleteTransactionMutation(params={}) {
  return useMutation({
    mutationFn: async (transactionId) => {
      const response = await apiClient({
        method: "delete",
        url: `/transactions/${transactionId}`,
      });
      return response.data.data;
    },
    ...params
  });
}
