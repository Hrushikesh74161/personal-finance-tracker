import { useQuery } from "@tanstack/react-query";
import apiClient from "./apiClient.js";

/**
 * Custom hook for fetching category statistics using React Query
 * @param {Object} options - Additional query options
 * @returns {UseQueryResult} Query result object containing data, loading state, and error
 */
export function useGetCategoryStatsQuery(options = {}) {
  return useQuery({
    queryKey: ["categories", "stats"],
    queryFn: async () => {
      const response = await apiClient({
        method: "get",
        url: "/categories/stats",
      });
      return response.data.data;
    },
    ...options
  });
}
