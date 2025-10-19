import { useMutation } from "@tanstack/react-query";
import apiClient from "./apiClient.js";

/**
 * Custom hook for handling update next due date mutation using React Query
 * @param {Object} params - The parameters for the update next due date mutation
 * @param {Object} [params.onSuccess] - Optional callback function called on successful mutation
 * @param {Object} [params.onError] - Optional callback function called on mutation error
 * @returns {UseMutationResult} Mutation result object containing mutation state and functions
 */
export function useUpdateNextDueDateMutation(params) {
  return useMutation({
    mutationFn: async (id) => {
      const response = await apiClient({
        method: "patch",
        url: `/regular-payments/${id}/next-due-date`,
      });
      return response.data.data;
    },
    ...params
  });
}
