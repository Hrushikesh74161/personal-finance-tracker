import { useQuery } from "@tanstack/react-query";
import apiClient from "./apiClient.js";

/**
 * Custom hook for fetching accounts using React Query
 * @param {Object} filters - Optional filters for the query
 * @param {Object} options - Additional query options
 * @returns {UseQueryResult} Query result object containing data, loading state, and error
 */
export function useGetAccountsQuery(filters = {}, options = {}) {
  return useQuery({
    queryKey: ["accounts", filters],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value);
        }
      });
      
      const url = queryParams.toString() ? `/accounts?${queryParams.toString()}` : "/accounts";
      const response = await apiClient({
        method: "get",
        url: url,
      });
      return response.data.data;
    },
    ...options
  });
}
