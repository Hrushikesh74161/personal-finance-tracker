import { useQuery } from "@tanstack/react-query";
import apiClient from "./apiClient.js";

/**
 * Custom hook for fetching a single category by ID using React Query
 * @param {string} categoryId - The ID of the category to fetch
 * @param {Object} options - Additional query options
 * @returns {UseQueryResult} Query result object containing data, loading state, and error
 */
export function useGetCategoryByIdQuery(categoryId, options = {}) {
  return useQuery({
    queryKey: ["categories", categoryId],
    queryFn: async () => {
      const response = await apiClient({
        method: "get",
        url: `/categories/${categoryId}`,
      });
      return response.data.data;
    },
    enabled: !!categoryId,
    ...options
  });
}
