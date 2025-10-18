import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "./apiClient.js";

/**
 * Custom hook for handling transfer money mutation using React Query
 * @param {Object} params - The parameters for the transfer money mutation
 * @param {Object} [params.onSuccess] - Optional callback function called on successful mutation
 * @param {Object} [params.onError] - Optional callback function called on mutation error
 * @returns {UseMutationResult} Mutation result object containing mutation state and functions
 */
export function useTransferMoneyMutation(params) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (transferData) => {
      const response = await apiClient({
        method: "post",
        url: "/transactions",
        data: {
          type: "transfer",
          category: "Transfer",
          amount: transferData.amount,
          description: transferData.description || `Transfer from ${transferData.fromAccountId} to ${transferData.toAccountId}`,
          date: new Date().toISOString(),
          accountId: transferData.fromAccountId,
          transferToAccountId: transferData.toAccountId
        },
      });
      return response.data.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate accounts and transactions queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accountBalanceSummary"] });
      params?.onSuccess?.(data, variables);
    },
    ...params
  });
}
