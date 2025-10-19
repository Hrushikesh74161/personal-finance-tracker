import { useQuery } from "@tanstack/react-query";
import apiClient from "./apiClient.js";

/**
 * Custom hook for fetching regular payment statistics using React Query
 * @param {Object} options - Additional query options
 * @returns {UseQueryResult} Query result object containing data, loading state, and error
 */
export function useGetRegularPaymentStatsQuery(params = {}) {
  return useQuery({
    queryKey: ["regularPaymentStats"],
    queryFn: async () => {
      const response = await apiClient({
        method: "get",
        url: "/regular-payments/stats",
      });
      return response.data.data;
    },
    ...params
  });
}
