import { useMutation } from "@tanstack/react-query";
import apiClient from "./apiClient.js";

/**
 * Custom hook for handling update regular payment mutation using React Query
 * @param {Object} params - The parameters for the update regular payment mutation
 * @param {Object} [params.onSuccess] - Optional callback function called on successful mutation
 * @param {Object} [params.onError] - Optional callback function called on mutation error
 * @returns {UseMutationResult} Mutation result object containing mutation state and functions
 */
export function useUpdateRegularPaymentMutation(params) {
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await apiClient({
        method: "patch",
        url: `/regular-payments/${id}`,
        data: data,
      });
      return response.data.data;
    },
    ...params
  });
}
