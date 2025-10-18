import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "./apiClient.js";

/**
 * Custom hook for handling update account mutation using React Query
 * @param {Object} params - The parameters for the update account mutation
 * @param {Object} [params.onSuccess] - Optional callback function called on successful mutation
 * @param {Object} [params.onError] - Optional callback function called on mutation error
 * @returns {UseMutationResult} Mutation result object containing mutation state and functions
 */
export function useUpdateAccountMutation(params) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ accountId, updateData }) => {
      const response = await apiClient({
        method: "patch",
        url: `/accounts/${accountId}`,
        data: updateData,
      });
      return response.data.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch accounts queries
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["account", variables.accountId] });
      params?.onSuccess?.(data, variables);
    },
    ...params
  });
}
