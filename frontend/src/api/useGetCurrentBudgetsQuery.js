import { useQuery } from "@tanstack/react-query";
import apiClient from "./apiClient.js";

/**
 * Custom hook for fetching current active budgets using React Query
 * @param {Object} options - Additional query options
 * @returns {UseQueryResult} Query result object containing data, loading state, and error
 */
export function useGetCurrentBudgetsQuery(options = {}) {
  return useQuery({
    queryKey: ["currentBudgets"],
    queryFn: async () => {
      const response = await apiClient({
        method: "get",
        url: "/budgets/current",
      });
      return response.data.data;
    },
    ...options
  });
}
