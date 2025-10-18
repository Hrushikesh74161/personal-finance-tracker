import { useMutation } from "@tanstack/react-query";
import apiClient from "./apiClient.js";

/**
 * Custom hook for handling create category mutation using React Query
 * @param {Object} params - The parameters for the create category mutation
 * @param {Object} [params.onSuccess] - Optional callback function called on successful mutation
 * @param {Object} [params.onError] - Optional callback function called on mutation error
 * @returns {UseMutationResult} Mutation result object containing mutation state and functions
 */
export function useCreateCategoryMutation(params) {
  return useMutation({
    mutationFn: async (data) => {
      const response = await apiClient({
        method: "post",
        url: "/categories",
        data: data,
      });
      return response.data.data;
    },
    ...params
  });
}
