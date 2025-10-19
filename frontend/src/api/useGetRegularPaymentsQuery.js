import { useQuery } from "@tanstack/react-query";
import apiClient from "./apiClient.js";

/**
 * Custom hook for fetching regular payments using React Query
 * @param {Object} filters - Optional filters for the query
 * @param {Object} options - Additional query options
 * @returns {UseQueryResult} Query result object containing data, loading state, and error
 */
export function useGetRegularPaymentsQuery(params = {}) {
  return useQuery({
    queryKey: ["regularPayments", params?.filters],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      Object.entries(params?.filters ?? {}).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value);
        }
      });

      const url = queryParams.toString() ? `/regular-payments?${queryParams.toString()}` : "/regular-payments";
      const response = await apiClient({
        method: "get",
        url: url,
      });
      return response.data.data;
    },
    ...params
  });
}
