import { useMutation } from "@tanstack/react-query";
import apiClient from "./apiClient.js";

/**
 * Custom hook for handling update category mutation using React Query
 * @param {Object} params - The parameters for the update category mutation
 * @param {Object} [params.onSuccess] - Optional callback function called on successful mutation
 * @param {Object} [params.onError] - Optional callback function called on mutation error
 * @returns {UseMutationResult} Mutation result object containing mutation state and functions
 */
export function useUpdateCategoryMutation(params) {
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await apiClient({
        method: "patch",
        url: `/categories/${id}`,
        data: data,
      });
      return response.data.data;
    },
    ...params
  });
}
