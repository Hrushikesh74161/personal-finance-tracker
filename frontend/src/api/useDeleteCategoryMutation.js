import { useMutation } from "@tanstack/react-query";
import apiClient from "./apiClient.js";

/**
 * Custom hook for handling delete category mutation using React Query
 * @param {Object} params - The parameters for the delete category mutation
 * @param {Object} [params.onSuccess] - Optional callback function called on successful mutation
 * @param {Object} [params.onError] - Optional callback function called on mutation error
 * @returns {UseMutationResult} Mutation result object containing mutation state and functions
 */
export function useDeleteCategoryMutation(params) {
  return useMutation({
    mutationFn: async (categoryId) => {
      const response = await apiClient({
        method: "delete",
        url: `/categories/${categoryId}`,
      });
      return response.data.data;
    },
    ...params
  });
}
