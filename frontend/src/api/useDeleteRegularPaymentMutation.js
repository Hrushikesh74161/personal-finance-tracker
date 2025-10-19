import { useMutation } from "@tanstack/react-query";
import apiClient from "./apiClient.js";

/**
 * Custom hook for handling delete regular payment mutation using React Query
 * @param {Object} params - The parameters for the delete regular payment mutation
 * @param {Object} [params.onSuccess] - Optional callback function called on successful mutation
 * @param {Object} [params.onError] - Optional callback function called on mutation error
 * @returns {UseMutationResult} Mutation result object containing mutation state and functions
 */
export function useDeleteRegularPaymentMutation(params) {
  return useMutation({
    mutationFn: async (id) => {
      const response = await apiClient({
        method: "delete",
        url: `/regular-payments/${id}`,
      });
      return response.data.data;
    },
    ...params
  });
}
