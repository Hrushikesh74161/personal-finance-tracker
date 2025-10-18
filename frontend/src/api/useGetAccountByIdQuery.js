import { useQuery } from "@tanstack/react-query";
import apiClient from "./apiClient.js";

/**
 * Custom hook for fetching a single account by ID using React Query
 * @param {string} accountId - The account ID to fetch
 * @param {Object} options - Additional query options
 * @returns {UseQueryResult} Query result object containing data, loading state, and error
 */
export function useGetAccountByIdQuery(accountId, options = {}) {
  return useQuery({
    queryKey: ["account", accountId],
    queryFn: async () => {
      const response = await apiClient({
        method: "get",
        url: `/accounts/${accountId}`,
      });
      return response.data.data;
    },
    enabled: !!accountId,
    ...options
  });
}
