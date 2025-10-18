import { useQuery } from "@tanstack/react-query";
import apiClient from "./apiClient.js";

/**
 * Custom hook for fetching a budget by ID using React Query
 * @param {string} budgetId - The ID of the budget to fetch
 * @param {Object} options - Additional query options
 * @returns {UseQueryResult} Query result object containing data, loading state, and error
 */
export function useGetBudgetByIdQuery(budgetId, options = {}) {
  return useQuery({
    queryKey: ["budget", budgetId],
    queryFn: async () => {
      const response = await apiClient({
        method: "get",
        url: `/budgets/${budgetId}`,
      });
      return response.data.data;
    },
    enabled: !!budgetId,
    ...options
  });
}
