import { useQuery } from "@tanstack/react-query";
import apiClient from "./apiClient.js";

/**
 * Custom hook for fetching account balance summary using React Query
 * @param {Object} options - Additional query options
 * @returns {UseQueryResult} Query result object containing data, loading state, and error
 */
export function useGetAccountBalanceSummaryQuery(params) {
  return useQuery({
    queryKey: ["accountBalanceSummary"],
    queryFn: async () => {
      const response = await apiClient({
        method: "get",
        url: "/accounts/summary",
      });
      return response.data.data;
    },
    ...params
  });
}
