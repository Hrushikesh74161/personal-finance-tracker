import { useQuery } from "@tanstack/react-query";
import apiClient from "./apiClient.js";

/**
 * Custom hook for fetching upcoming regular payments using React Query
 * @param {number} days - Number of days to look ahead (default: 30)
 * @param {Object} options - Additional query options
 * @returns {UseQueryResult} Query result object containing data, loading state, and error
 */
export function useGetUpcomingPaymentsQuery(days = 30, params = {}) {
  return useQuery({
    queryKey: ["upcomingPayments", days],
    queryFn: async () => {
      const response = await apiClient({
        method: "get",
        url: `/regular-payments/upcoming?days=${days}`,
      });
      return response.data.data;
    },
    ...params
  });
}
