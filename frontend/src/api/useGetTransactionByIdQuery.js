import { useQuery } from "@tanstack/react-query";
import apiClient from "./apiClient.js";

/**
 * Custom hook for fetching a single transaction by ID using React Query
 * @param {string} transactionId - The transaction ID to fetch
 * @param {Object} options - Additional query options
 * @returns {UseQueryResult} Query result object containing data, loading state, and error
 */
export function useGetTransactionByIdQuery(params = {}) {
  return useQuery({
    queryKey: ["transaction", params?.transactionId],
    queryFn: async () => {
      const response = await apiClient({
        method: "get",
        url: `/transactions/${params?.transactionId}`,
      });
      return response.data.data;
    },
    enabled: !!params?.transactionId,
    ...params
  });
}
