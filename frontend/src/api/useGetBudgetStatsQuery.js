import { useQuery } from "@tanstack/react-query";
import apiClient from "./apiClient.js";

/**
 * Custom hook for fetching budget statistics using React Query
 * @param {Object} options - Additional query options
 * @returns {UseQueryResult} Query result object containing data, loading state, and error
 */
export function useGetBudgetStatsQuery(options = {}) {
  return useQuery({
    queryKey: ["budgetStats"],
    queryFn: async () => {
      const response = await apiClient({
        method: "get",
        url: "/budgets/stats",
      });
      return response.data.data;
    },
    ...options
  });
}
