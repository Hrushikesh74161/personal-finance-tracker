import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "./apiClient.js";

/**
 * Custom hook for handling delete account mutation using React Query
 * @param {Object} params - The parameters for the delete account mutation
 * @param {Object} [params.onSuccess] - Optional callback function called on successful mutation
 * @param {Object} [params.onError] - Optional callback function called on mutation error
 * @returns {UseMutationResult} Mutation result object containing mutation state and functions
 */
export function useDeleteAccountMutation(params) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (accountId) => {
      const response = await apiClient({
        method: "delete",
        url: `/accounts/${accountId}`,
      });
      return response.data.data;
    },
    onSuccess: (data, accountId) => {
      // Invalidate and refetch accounts queries
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.removeQueries({ queryKey: ["account", accountId] });
      params?.onSuccess?.(data, accountId);
    },
    ...params
  });
}
