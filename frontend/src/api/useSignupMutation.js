import { useMutation } from "@tanstack/react-query";
import apiClient from "./apiClient";

/**
 * Custom hook for handling signup mutation using React Query
 * @param {Object} params - The parameters for the signup mutation
 * @param {Object} [params.onSuccess] - Optional callback function called on successful mutation
 * @param {Object} [params.onError] - Optional callback function called on mutation error
 * @returns {UseMutationResult} Mutation result object containing mutation state and functions
 */
export function useSignupMutation(params) {
  return useMutation({
    mutationFn: async (data) => {
      const response = await apiClient({
        method: "POST",
        url: "/auth/signup",
        data: data,
        auth: false,
      });
      return response.data.data;
    },
    ...params
  });
}