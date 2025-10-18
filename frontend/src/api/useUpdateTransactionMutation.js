import { useMutation } from "@tanstack/react-query";
import apiClient from "./apiClient.js";

/**
 * Custom hook for handling update transaction mutation using React Query
 * @param {Object} params - The parameters for the update transaction mutation
 * @param {Object} [params.onSuccess] - Optional callback function called on successful mutation
 * @param {Object} [params.onError] - Optional callback function called on mutation error
 * @returns {UseMutationResult} Mutation result object containing mutation state and functions
 */
export function useUpdateTransactionMutation(params = {}) {
  return useMutation({
    mutationFn: async ({ transactionId, updateData }) => {
      const response = await apiClient({
        method: "patch",
        url: `/transactions/${transactionId}`,
        data: updateData,
      });
      return response.data.data;
    },
    ...params
  });
}
